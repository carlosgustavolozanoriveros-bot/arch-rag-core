'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getSessionId } from '@/lib/session';
import { useTheme } from '../ThemeProvider';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface SidebarProps {
  currentChatId: string | null;
  isOpen: boolean;
  toggleSidebar: () => void;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
}

export function Sidebar({ currentChatId, isOpen, toggleSidebar, onSelectChat, onNewChat }: SidebarProps) {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    async function loadChats() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setChats([]);
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('chats')
        .select('id, title, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (!error && data) {
        setChats(data);
      }
      setIsLoading(false);
    }
    
    loadChats();
  }, [currentChatId]);

  // Focus input when editing
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpenId) return;
    const close = () => setMenuOpenId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpenId]);

  const handleRename = async (chatId: string) => {
    if (!editTitle.trim()) return;
    const supabase = createClient();
    await supabase.from('chats').update({ title: editTitle.trim() }).eq('id', chatId);
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: editTitle.trim() } : c));
    setEditingId(null);
  };

  const handleDelete = async (chatId: string) => {
    const supabase = createClient();
    // Delete messages first, then chat
    await supabase.from('messages').delete().eq('chat_id', chatId);
    await supabase.from('chats').delete().eq('id', chatId);
    setChats(prev => prev.filter(c => c.id !== chatId));
    setMenuOpenId(null);
    // If deleting current chat, go to new chat
    if (currentChatId === chatId) {
      onNewChat();
    }
  };

  return (
    <>
      <div className={`chat-sidebar ${isOpen ? 'open' : ''}`} style={{
        width: isOpen ? '260px' : '68px',
        background: theme === 'dark' ? '#1e1f20' : '#f0f4f9',
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Hamburger Menu */}
        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', height: '64px' }}>
          {toggleSidebar && (
            <button 
              onClick={toggleSidebar}
              style={{
                background: 'transparent', border: 'none', color: 'var(--text-color)',
                cursor: 'pointer', padding: '0.5rem', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minWidth: '36px', height: '36px'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        
        {/* New Chat Button */}
        <div style={{ padding: '0 0.8rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => { onNewChat(); }}
            style={{
              width: isOpen ? '100%' : '42px', 
              padding: isOpen ? '0.75rem' : '0', 
              height: '42px',
              background: 'var(--bg-color)',
              border: '1px solid var(--border-color)', borderRadius: '21px',
              color: 'var(--text-color)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center',
              gap: '0.5rem', fontWeight: 500,
              transition: 'all 0.2s ease',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'var(--hover-color, rgba(0,0,0,0.05))'}
            onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
          >
            <div style={{ minWidth: '42px', display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            {isOpen && <span style={{ paddingRight: '1rem' }}>Nuevo Chat</span>}
          </button>
        </div>
        
        {/* Chats List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.8rem', opacity: isOpen ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: isOpen ? 'auto' : 'none' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-color)', opacity: 0.7 }}>
            Recientes
          </div>
          {isLoading ? (
            <div style={{ padding: '0.5rem', textAlign: 'center', opacity: 0.5, fontSize: '0.9rem' }}>...</div>
          ) : chats.length === 0 ? (
            <div style={{ padding: '0.5rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem', lineHeight: '1.4' }}>
              No hay chats.<br/><br/>
              <span style={{ fontSize: '0.75rem', color: '#ffa600' }}>Inicia sesión para guardar tu historial.</span>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {chats.map(chat => {
                const isActive = currentChatId === chat.id;
                const isEditing = editingId === chat.id;
                const isMenuOpen = menuOpenId === chat.id;

                return (
                  <li key={chat.id} style={{ position: 'relative' }}>
                    {isEditing ? (
                      <form
                        onSubmit={(e) => { e.preventDefault(); handleRename(chat.id); }}
                        style={{ display: 'flex', gap: '4px' }}
                      >
                        <input
                          ref={editInputRef}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => handleRename(chat.id)}
                          onKeyDown={(e) => { if (e.key === 'Escape') setEditingId(null); }}
                          style={{
                            flex: 1, padding: '0.5rem 0.6rem', fontSize: '0.85rem',
                            background: 'var(--bg-color)', color: 'var(--text-color)',
                            border: '1px solid var(--primary-color)', borderRadius: '6px',
                            outline: 'none',
                          }}
                        />
                      </form>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                           className="sidebar-chat-item"
                      >
                        <button
                          onClick={() => { onSelectChat(chat.id); }}
                          style={{
                            width: '100%', padding: '0.6rem 0.8rem', textAlign: 'left',
                            background: isActive 
                              ? (theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')
                              : 'transparent',
                            border: 'none', borderRadius: '8px',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-color)',
                            fontWeight: isActive ? 600 : 400,
                            cursor: 'pointer',
                            fontSize: '0.9rem', whiteSpace: 'nowrap',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }}
                          onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                        >
                          {chat.title || 'Chat sin título'}
                        </button>
                        {/* Three dots menu button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpenId(isMenuOpen ? null : chat.id); }}
                          className="chat-menu-btn"
                          style={{
                            position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', color: 'var(--text-color)',
                            cursor: 'pointer', padding: '4px 6px', borderRadius: '4px',
                            opacity: isMenuOpen ? 1 : 0,
                            fontSize: '14px', lineHeight: 1,
                            transition: 'opacity 0.15s',
                          }}
                        >
                          ⋮
                        </button>
                        {/* Dropdown menu */}
                        {isMenuOpen && (
                          <div style={{
                            position: 'absolute', right: 0, top: '100%',
                            background: theme === 'dark' ? '#2d2e30' : '#fff',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px', padding: '4px', zIndex: 100,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                            minWidth: '140px',
                          }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditTitle(chat.title || ''); setEditingId(chat.id); setMenuOpenId(null); }}
                              style={{
                                width: '100%', padding: '8px 12px', textAlign: 'left',
                                background: 'none', border: 'none', borderRadius: '6px',
                                color: 'var(--text-color)', cursor: 'pointer', fontSize: '0.85rem',
                                display: 'flex', alignItems: 'center', gap: '8px',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                            >
                              ✏️ Renombrar
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(chat.id); }}
                              style={{
                                width: '100%', padding: '8px 12px', textAlign: 'left',
                                background: 'none', border: 'none', borderRadius: '6px',
                                color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem',
                                display: 'flex', alignItems: 'center', gap: '8px',
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Theme Toggle */}
        <div style={{ padding: '1rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center', transition: 'all 0.2s' }}>
          {isOpen && (
            <span style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              Tema
            </span>
          )}
          <button
            onClick={toggle}
            style={{
              width: isOpen ? '56px' : '40px', height: isOpen ? '28px' : '40px', 
              background: isOpen ? (theme === 'dark' ? 'var(--primary-color)' : '#e2e8f0') : 'transparent',
              border: 'none', borderRadius: isOpen ? '14px' : '50%', position: 'relative', cursor: 'pointer',
              transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            aria-label="Cambiar tema"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {isOpen ? (
               <div style={{
                width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                position: 'absolute', top: '4px', left: theme === 'dark' ? '32px' : '4px',
                transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}>
                <span style={{ fontSize: '12px' }}>{theme === 'dark' ? '🌙' : '☀️'}</span>
              </div>
            ) : (
              <span style={{ fontSize: '1.2rem' }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
            )}
          </button>
        </div>
      </div>
      
      {/* Sidebar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .chat-sidebar {
            position: fixed !important;
            left: 0;
            top: 0; 
            height: 100vh !important;
            z-index: 1000;
          }
        }
        .sidebar-chat-item:hover .chat-menu-btn {
          opacity: 1 !important;
        }
      `}} />
    </>
  );
}
