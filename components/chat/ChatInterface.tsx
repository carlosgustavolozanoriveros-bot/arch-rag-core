'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as React from 'react';
import { DefaultChatTransport, UIMessage } from 'ai';
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
  const [pendingProducts, setPendingProducts] = useState<MatchedResource[]>([]);
  const [showLoginWall, setShowLoginWall] = useState(false);
  const [loginWallMessage, setLoginWallMessage] = useState('');
  const [loginWallCount, setLoginWallCount] = useState(0);
  const [visibleProducts, setVisibleProducts] = useState<MatchedResource[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const supabase = createClient();

  // Load chat history if currentChatId is present
  useEffect(() => {
    async function loadHistory() {
      setIsInitializing(true);
      if (currentChatId) {
        try {
          const res = await fetch(`/api/chat/history?chatId=${currentChatId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.messages && data.messages.length > 0) {
              setInitialMessages(data.messages);
            } else {
              setInitialMessages([]);
            }
          }
        } catch (error) {
          console.error("Failed to load history", error);
          setInitialMessages([]);
        }
      } else {
        setInitialMessages([]);
      }
      setIsInitializing(false);
    }
    loadHistory();
  }, [currentChatId]);

  // Initialize session and user
  useEffect(() => {
    const sid = getSessionId();
    setSessionId(sid);

    // Check if user is logged in
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

    // Listen for auth changes
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

          // Sync anonymous session
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sid, user_id: session.user.id }),
          });

          // Show pending products after login
          if (pendingProducts.length > 0) {
            setShowLoginWall(false);
            setVisibleProducts(pendingProducts);
            setPendingProducts([]);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [pendingProducts, supabase.auth]);

  // Memoize transport to avoid re-creating on every render
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

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: initialMessages,
    id: currentChatId || 'new', // Forces hook to reset when id changes
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    sendMessage({ text });
  }, [inputValue, isLoading, sendMessage]);

  const handleSuggestion = useCallback((text: string) => {
    setInputValue(text);
    // Focus textarea
    textareaRef.current?.focus();
  }, []);

  const handleGoogleLogin = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase]);

  // Auto-resize textarea
  const handleTextareaInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const handleSearchProducts = useCallback(async (args: { query: string }) => {
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search', query: args.query }),
      });
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        setPendingProducts(data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  }, []);

  const handleShowProducts = useCallback(async (resourceIds: string[]) => {
    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_by_ids', resourceIds }),
      });
      const data = await res.json();
      if (data.results) {
        setVisibleProducts(data.results);
      }
    } catch (error) {
      console.error('Show products error:', error);
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showLoginWall, visibleProducts]);

  useEffect(() => {
    for (const msg of messages) {
      if (msg.role === 'assistant' && msg.parts) {
        for (const part of msg.parts) {
          // Check for any tool invocation part (static or dynamic)
          const isToolCall = (part.type as string).startsWith('tool-') || part.type === 'tool-invocation';
          if (isToolCall) {
            // Using 'any' cast because the exact shape of tool calls is internal to AI SDK v6
            const toolCall = part as any;
            const toolName = toolCall.toolName || (part.type as string).replace('tool-', '');
            // In AI SDK v6, UI tool invocations store arguments in 'input', not 'args'
            const args = toolCall.args || toolCall.input;
            
            if (toolName === 'search_products' && args) {
              handleSearchProducts(args as { query: string });
            }
            if (toolName === 'require_login' && !user && args) {
              const reqArgs = args as { message: string; productCount: number };
              setLoginWallMessage(reqArgs.message);
              setLoginWallCount(reqArgs.productCount);
              setShowLoginWall(true);
            }
            if (toolName === 'show_product_cards' && args) {
              const showArgs = args as { resourceIds: string[] };
              handleShowProducts(showArgs.resourceIds);
            }
          }
        }
      }
    }
  }, [messages, user, handleSearchProducts, handleShowProducts]);

  const hasMessages = messages.length > 0;

  // Extract text content
  const getMessageText = (msg: typeof messages[0]): string => {
    if (msg.parts && msg.parts.length > 0) {
      const textParts = msg.parts
        .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
        .map(p => p.text);
      if (textParts.length > 0) return textParts.join('');
    }
    return '';
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="chat-messages-inner">
          {isInitializing ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              Cargando conversación...
            </div>
          ) : !hasMessages && (
            <div className="welcome-screen">
              <div className="welcome-icon">🏗️</div>
              <h1 className="welcome-title">
                Asistente Experto en<br />Activos AEC
              </h1>
              <p className="welcome-subtitle">
                Tu consultor especializado en recursos BIM para Revit. 
                Cuéntame sobre tu proyecto y te ayudaré a encontrar las familias, 
                plantillas y recursos perfectos.
              </p>
              <div className="welcome-suggestions">
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Necesito familias de equipamiento para un gimnasio')}
                >
                  🏋️ Equipamiento de gimnasio
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Busco patrones de pisos de madera para un proyecto residencial')}
                >
                  🪵 Patrones de madera
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Necesito bloques de título profesionales para mis planos')}
                >
                  📐 Bloques de título
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Estoy diseñando un parque infantil y necesito juegos')}
                >
                  🎡 Juegos infantiles
                </button>
                <button
                  className="suggestion-chip"
                  onClick={() => handleSuggestion('Busco mobiliario para un spa y centro wellness')}
                >
                  🧖 Spa y Wellness
                </button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              content={getMessageText(message)}
              user={user}
            />
          ))}

          {showLoginWall && !user && (
            <LoginWall
              message={loginWallMessage}
              productCount={loginWallCount}
              onLogin={handleGoogleLogin}
            />
          )}

          {visibleProducts.length > 0 && (
            <div className="product-cards-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userRole={user ? 'free' : undefined}
                />
              ))}
            </div>
          )}

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
          <p className="chat-disclaimer">
            El asistente puede cometer errores. Verifica los detalles técnicos.
          </p>
        </div>
      </div>
    </div>
  );
}
