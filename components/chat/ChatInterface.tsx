'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as React from 'react';
import { DefaultChatTransport } from 'ai';
import { createClient } from '@/lib/supabase/client';
import { getSessionId } from '@/lib/session';
import { MessageBubble } from './MessageBubble';
import { LoginWall } from './LoginWall';
import { ProductCard } from './ProductCard';
import type { MatchedResource } from '@/lib/supabase/types';

interface UserState {
  id: string;
  email: string;
  avatar_url?: string;
  display_name?: string;
}

interface ChatInterfaceProps {
  currentChatId: string | null;
  onChatCreated?: (chatId: string) => void;
}

export function ChatInterface({ currentChatId, onChatCreated }: ChatInterfaceProps) {
  const [user, setUser] = useState<UserState | null>(null);
  const [sessionId, setSessionId] = useState<string>('');

  const [inputValue, setInputValue] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  // Separate state for search results that useChat might strip from parts
  const [searchResultsMap, setSearchResultsMap] = useState<Record<string, any[]>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingMessageRef = useRef<string | null>(null);
  const supabase = createClient();

  // Standard transport — recreates when currentChatId changes
  const transport = React.useMemo(() => {
    return new DefaultChatTransport({
      api: '/api/chat',
      body: {
        sessionId,
        chatId: currentChatId,
        isAuthenticated: !!user,
      },
    });
  }, [sessionId, currentChatId, user]);

  // Initialize useChat with stable ID
  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    id: currentChatId || 'new',
  });

  // Load chat history when currentChatId changes
  useEffect(() => {
    if (!currentChatId) {
      setMessages([]);
      setSearchResultsMap({});
      return;
    }

    setIsLoadingHistory(true);

    fetch(`/api/chat/history?chatId=${currentChatId}`)
      .then(res => res.ok ? res.json() : { messages: [] })
      .then(data => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          // Extract search results into separate map (in case useChat strips custom parts)
          const resultsMap: Record<string, any[]> = {};
          for (const msg of data.messages) {
            if (msg.role === 'assistant' && msg.parts) {
              for (const part of msg.parts) {
                if (part.type === 'tool-search_products') {
                  const results = part.output?.results || part.result?.results;
                  if (results?.length > 0) {
                    resultsMap[msg.id] = results;
                  }
                }
              }
            }
          }
          setSearchResultsMap(resultsMap);
        } else {
          setMessages([]);
          setSearchResultsMap({});
        }
      })
      .catch(error => {
        console.error('Failed to load history', error);
        setMessages([]);
        setSearchResultsMap({});
      })
      .finally(() => setIsLoadingHistory(false));
  }, [currentChatId, setMessages]);

  // Send pending message after transport updates with new chatId
  useEffect(() => {
    if (currentChatId && pendingMessageRef.current) {
      const text = pendingMessageRef.current;
      pendingMessageRef.current = null;
      // Small delay to ensure transport is ready
      setTimeout(() => sendMessage({ text }), 100);
    }
  }, [currentChatId, sendMessage]);

  // Restore saved conversation after OAuth login redirect + save to DB
  useEffect(() => {
    if (!user || !sessionId) return;
    const saved = localStorage.getItem('aec_chat_before_login');
    if (!saved) return;

    try {
      const savedMessages = JSON.parse(saved);
      localStorage.removeItem('aec_chat_before_login');
      if (savedMessages.length > 0 && messages.length === 0) {
        setMessages(savedMessages);

        // Save to DB in background — delay onChatCreated so purchase intent flow can complete
        (async () => {
          try {
            const firstUserMsg = savedMessages.find((m: any) => m.role === 'user');
            const title = firstUserMsg 
              ? (firstUserMsg.parts?.[0]?.text || firstUserMsg.content || '').slice(0, 100) 
              : 'Conversación restaurada';

            const res = await fetch('/api/chat/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, title, userId: user.id }),
            });
            const data = await res.json();
            if (!data.chatId) return;

            // Save all messages to DB
            for (const msg of savedMessages) {
              // Find text content from any text part (not just parts[0])
              let content = msg.content || '';
              if (!content && msg.parts) {
                for (const part of msg.parts as any[]) {
                  if (part.type === 'text' && part.text) {
                    content = part.text;
                    break;
                  }
                }
              }

              // Extract search results from tool parts (check multiple formats)
              let toolCalls = null;
              if (msg.role === 'assistant' && msg.parts) {
                for (const part of msg.parts as any[]) {
                  const results = part.output?.results || part.result?.results;
                  if (
                    (part.type === 'tool-search_products' || part.toolName === 'search_products') &&
                    results?.length > 0
                  ) {
                    toolCalls = { search_results: results };
                  }
                }
              }

              await fetch('/api/chat/history/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chatId: data.chatId,
                  role: msg.role,
                  content,
                  toolCalls,
                }),
              });
            }

            // Delay onChatCreated so purchase intent modal has time to open
            // (onChatCreated triggers history reload which would clear restored messages)
            setTimeout(() => {
              onChatCreated?.(data.chatId);
            }, 5000);
          } catch (err) {
            console.error('Failed to save restored chat:', err);
          }
        })();
      }
    } catch (e) {
      localStorage.removeItem('aec_chat_before_login');
    }
  }, [user, sessionId, setMessages]);

  // Initialize session and user — runs ONCE
  useEffect(() => {
    const sid = getSessionId();
    setSessionId(sid);

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          avatar_url: session.user.user_metadata?.avatar_url,
          display_name: session.user.user_metadata?.full_name,
        });
      }
    });

    // Listen for auth changes — subscribe ONCE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const newUser = {
            id: session.user.id,
            email: session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            display_name: session.user.user_metadata?.full_name,
          };
          setUser(newUser);

          // Sync anonymous session with authenticated user
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sid, user_id: session.user.id }),
          });

        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — runs ONCE on mount

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // If no chatId yet AND user is logged in, create chat first
    if (!currentChatId && sessionId && user) {
      try {
        const res = await fetch('/api/chat/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sessionId, 
            title: text.slice(0, 100),
            userId: user.id
          }),
        });
        const data = await res.json();
        if (data.chatId) {
          // Store message to send after transport updates
          pendingMessageRef.current = text;
          onChatCreated?.(data.chatId);
          return; // Don't send now — useEffect will send when chatId propagates
        }
      } catch (err) {
        console.error('Error creating chat:', err);
      }
    }

    sendMessage({ text });
  }, [inputValue, isLoading, sendMessage, currentChatId, sessionId, user, onChatCreated]);

  const handleSuggestion = useCallback((text: string) => {
    setInputValue(text);
    // Focus textarea
    textareaRef.current?.focus();
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    // Save current conversation before redirect so it can be restored after login
    if (messages.length > 0) {
      try {
        localStorage.setItem('aec_chat_before_login', JSON.stringify(messages));
      } catch (e) {
        console.error('Failed to save chat state:', e);
      }
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase, messages]);

  // Auto-resize textarea
  const handleTextareaInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);





  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);



  const hasMessages = messages.length > 0;

  // Extract text content
  const getMessageText = (msg: typeof messages[0]): string => {
    if (msg.parts && msg.parts.length > 0) {
      const textParts = msg.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map(p => p.text);
      if (textParts.length > 0) return textParts.join('');
    }
    // Fallback: read content directly (for messages loaded from DB history)
    if (typeof (msg as any).content === 'string') {
      return (msg as any).content;
    }
    return '';
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="chat-messages-inner">
          {isLoadingHistory ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              Cargando conversación...
            </div>
          ) : !hasMessages && (
            <div className="welcome-screen">
              <div className="welcome-icon">🏗️</div>
              <h1 className="welcome-title">
                Tu Asistente de<br />Recursos AEC
              </h1>
              <p className="welcome-subtitle">
                Tu aliado para encontrar el recurso exacto que necesitas en tus proyectos 
                de arquitectura, ingeniería y construcción. Familias, bloques, texturas, 
                cursos y más — solo cuéntame qué necesitas.
              </p>
              <div className="welcome-suggestions">
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Busco familias para Revit')}
                >
                  🏠 Familias Revit
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Necesito bloques para AutoCAD')}
                >
                  📐 Bloques CAD
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Busco texturas y materiales para renders')}
                >
                  🎨 Texturas y Materiales
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Necesito assets 3D para mis proyectos')}
                >
                  🌳 Assets 3D
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Quiero aprender con cursos de BIM y renders')}
                >
                  📚 Cursos y Tutoriales
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Busco escenas o plantillas para D5 Render o SketchUp')}
                >
                  🖼️ Escenas y Templates
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => {
            const textContent = getMessageText(message);
            
            // Check if this assistant message has search_products results
            let searchResults: any[] | null = null;
            if (message.role === 'assistant' && message.parts) {
              for (const part of message.parts) {
                const p = part as any;
                // Check multiple formats: streaming (output-available) and history reconstruction
                if (p.type === 'tool-search_products') {
                  const results = p.output?.results || p.result?.results;
                  if (results?.length > 0) {
                    searchResults = results;
                  }
                }
              }
            }
            // Fallback: check searchResultsMap (populated from history API, survives useChat parts stripping)
            if (!searchResults && searchResultsMap[message.id]?.length > 0) {
              searchResults = searchResultsMap[message.id];
            }

            return (
              <React.Fragment key={message.id}>
                {textContent && (
                  <MessageBubble
                    role={message.role}
                    content={textContent}
                    user={user}
                  />
                )}
                {searchResults && (
                  <div className="product-cards-grid">
                    {searchResults.map((product: any) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        userRole={user ? 'free' : null}
                        onRequireLogin={handleGoogleLogin}
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {isLoading && (
            <div className="message">
              <div className="message-avatar assistant">🏗️</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          {(!user && messages.filter(m => m.role === 'user').length >= 15) ? (
            <div className="login-prompt-container" style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,166,0,0.1)', borderRadius: '12px', border: '1px solid rgba(255,166,0,0.3)', marginBottom: '1rem' }}>
              <p style={{ color: '#ffa600', marginBottom: '1rem', fontWeight: 500 }}>
                Has alcanzado el límite del asesor gratuito. Inicia sesión en 1 clic para continuar tu proyecto y guardar el historial.
              </p>
              <button 
                onClick={handleGoogleLogin}
                style={{ background: '#ffa600', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Continuar con Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="chat-input-container">
                <textarea
                  ref={textareaRef}
                  className="chat-input"
                  value={inputValue}
                  onChange={handleTextareaInput}
                  placeholder="Describe tu proyecto o lo que necesitas..."
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={isLoading || !inputValue.trim()}
                  aria-label="Enviar mensaje"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
            </form>
          )}
          <p className="chat-disclaimer">
            El asistente puede cometer errores. Verifica los detalles técnicos.
          </p>
        </div>
      </div>
    </div>
  );
}
