'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
  };

  const userName = user?.user_metadata?.full_name || user?.email || 'Usuario';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <header style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '0 1.5rem', height: '64px', background: 'transparent'
    }}>
      <div className="header-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🏗️</span> Asistente AEC
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <div className="user-menu" style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              className="user-avatar-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'var(--primary-color)', color: 'white',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '1rem'
              }}
              title={userName}
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt={userName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
              ) : (
                initial
              )}
            </button>
            
            {showDropdown && (
              <div className="dropdown-menu" style={{
                position: 'absolute', top: '120%', right: '0',
                background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                borderRadius: '8px', padding: '0.5rem', minWidth: '150px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 100
              }}>
                <div style={{ padding: '0.5rem', fontWeight: 500, borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem', color: 'var(--text-color)' }}>
                  {userName}
                </div>
                <button 
                  onClick={handleLogout}
                  style={{
                    width: '100%', padding: '0.5rem', textAlign: 'left',
                    background: 'transparent', border: 'none', color: '#ff4d4f',
                    cursor: 'pointer', borderRadius: '4px'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
              });
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', background: 'var(--bg-tertiary, #1a1a26)',
              border: '1px solid var(--border-default, rgba(255,255,255,0.1))',
              borderRadius: '20px', color: 'var(--text-primary, #f0f0f5)',
              cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold, #c8a97e)'; e.currentTarget.style.color = 'var(--accent-gold, #c8a97e)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-default, rgba(255,255,255,0.1))'; e.currentTarget.style.color = 'var(--text-primary, #f0f0f5)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Iniciar sesión
          </button>
        )}
      </div>
    </header>
  );
}
