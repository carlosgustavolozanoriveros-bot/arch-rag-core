'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState, useRef } from 'react';

interface HeaderProps {
  toggleSidebar?: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
          if (session?.user) fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('role, subscription_expires_at, cancel_at_period_end')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

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

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch('/api/subscription/cancel', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setProfile((prev: any) => ({ ...prev, cancel_at_period_end: true }));
        setShowCancelModal(false);
        setShowDropdown(false);
      } else {
        alert(data.error || 'Error al cancelar');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setIsCancelling(false);
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email || 'Usuario';
  const initial = userName.charAt(0).toUpperCase();
  const isSubscriber = profile?.role === 'subscriber' || profile?.role === 'admin';
  const expiresAt = profile?.subscription_expires_at
    ? new Date(profile.subscription_expires_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <>
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
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'var(--primary-color)', color: 'white',
                  border: '2px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: '1rem', transition: 'border-color 0.2s',
                  overflow: 'hidden'
                }}
                title={userName}
              >
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt={userName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  initial
                )}
              </button>
              
              {showDropdown && (
                <div className="profile-dropdown" style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: '0',
                  background: 'var(--card-bg, #1a1a2e)',
                  border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  borderRadius: '12px', padding: '0', minWidth: '240px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 1000,
                  overflow: 'hidden', animation: 'slideDown 0.2s ease'
                }}>
                  {/* User info section */}
                  <div style={{ padding: '1rem 1rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                      background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 'bold', fontSize: '1.1rem'
                    }}>
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : initial}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-color, #f0f0f5)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {userName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #a0a0b0)', marginTop: '2px' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Subscription status */}
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #a0a0b0)' }}>Suscripción</span>
                      <span style={{
                        fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600,
                        background: isSubscriber ? 'rgba(82, 196, 26, 0.15)' : 'rgba(255,255,255,0.06)',
                        color: isSubscriber ? '#52c41a' : 'var(--text-secondary, #a0a0b0)',
                        border: `1px solid ${isSubscriber ? 'rgba(82, 196, 26, 0.3)' : 'rgba(255,255,255,0.1)'}`
                      }}>
                        {isSubscriber ? '✓ Activa' : 'Free'}
                      </span>
                    </div>
                    {isSubscriber && expiresAt && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #a0a0b0)' }}>
                        Válida hasta {expiresAt}
                      </div>
                    )}

                    {isSubscriber && profile?.cancel_at_period_end && (
                      <div style={{ 
                        marginTop: '0.5rem', fontSize: '0.72rem', color: '#ff6b6b', 
                        background: 'rgba(255, 77, 79, 0.08)', padding: '0.4rem', 
                        borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(255, 77, 79, 0.1)' 
                      }}>
                        No se renovará automáticamente
                      </div>
                    )}

                    {isSubscriber && profile?.role !== 'admin' && !profile?.cancel_at_period_end && (
                      <button
                        onClick={() => { setShowCancelModal(true); setShowDropdown(false); }}
                        style={{
                          marginTop: '0.5rem', width: '100%', padding: '0.4rem',
                          background: 'rgba(255, 77, 79, 0.08)', border: '1px solid rgba(255, 77, 79, 0.2)',
                          borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer',
                          fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 79, 0.15)'; e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.4)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 77, 79, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 77, 79, 0.2)'; }}
                      >
                        Cancelar suscripción
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ padding: '0.5rem' }}>
                    <button 
                      onClick={handleLogout}
                      style={{
                        width: '100%', padding: '0.5rem 0.75rem', textAlign: 'left',
                        background: 'transparent', border: 'none', color: '#ff4d4f',
                        cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 77, 79, 0.08)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
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

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, animation: 'fadeIn 0.2s ease'
        }} onClick={() => !isCancelling && setShowCancelModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--card-bg, #1a1a2e)',
              border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '90%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)', textAlign: 'center',
              animation: 'slideDown 0.3s ease'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
            <h3 style={{ color: 'var(--text-color, #f0f0f5)', margin: '0 0 0.5rem', fontSize: '1.15rem' }}>
              ¿Cancelar suscripción?
            </h3>
            <p style={{ color: 'var(--text-secondary, #a0a0b0)', fontSize: '0.85rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Perderás acceso a todos los recursos premium y descargas ilimitadas. Esta acción no se puede deshacer.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                style={{
                  flex: 1, padding: '0.65rem', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                  color: 'var(--text-color, #f0f0f5)', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                Mantener
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                style={{
                  flex: 1, padding: '0.65rem', borderRadius: '8px',
                  background: isCancelling ? 'rgba(255, 77, 79, 0.3)' : 'rgba(255, 77, 79, 0.15)',
                  border: '1px solid rgba(255, 77, 79, 0.3)',
                  color: '#ff4d4f', cursor: isCancelling ? 'wait' : 'pointer',
                  fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
                }}
                onMouseOver={(e) => !isCancelling && (e.currentTarget.style.background = 'rgba(255, 77, 79, 0.25)')}
                onMouseOut={(e) => !isCancelling && (e.currentTarget.style.background = 'rgba(255, 77, 79, 0.15)')}
              >
                {isCancelling ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
