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
  
  // Modals state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [isCancelling, setIsCancelling] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [hasUnreadNews, setHasUnreadNews] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchNews();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          setUser(session?.user ?? null);
          if (session?.user) {
            fetchProfile(session.user.id);
            fetchNews();
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setNews([]);
          setHasUnreadNews(false);
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

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.news) setNews(data.news);
      setHasUnreadNews(!!data.hasUnread);
    } catch (e) {
      console.error(e);
    }
  };

  const openNews = async () => {
    setShowNewsModal(true);
    if (hasUnreadNews) {
      setHasUnreadNews(false);
      await fetch('/api/news', { method: 'POST' });
    }
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
    window.location.href = '/';
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
        showToast('Renovación cancelada', 'success');
      } else {
        showToast(data.error || 'Error al cancelar', 'error');
      }
    } catch {
      showToast('Error de conexión', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const submitSupport = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket_type: formData.get('type'),
          description: formData.get('description')
        })
      });
      if (res.ok) {
        showToast('Reporte enviado con éxito', 'success');
        setShowSupportModal(false);
      } else {
        showToast('Error al enviar el reporte', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/resource-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          reference_url: formData.get('reference_url')
        })
      });
      if (res.ok) {
        showToast('Solicitud enviada con éxito', 'success');
        setShowResourceModal(false);
      } else {
        showToast('Error al enviar la solicitud', 'error');
      }
    } finally {
      setIsSubmitting(false);
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
        <div className="header-brand hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="10" height="10" stroke="var(--text-secondary)" strokeWidth="2.5" />
              <rect x="10" y="10" width="10" height="10" stroke="var(--accent-gold)" strokeWidth="2.5" />
            </svg>
            <span style={{ letterSpacing: '-0.02em' }}>Asistente de Recursos AEC</span>
          </div>
        </div>

        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              {/* Notification Bell */}
              <button
                onClick={openNews}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                  cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center',
                  padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                title="Novedades"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {hasUnreadNews && (
                  <span style={{
                    position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px',
                    background: '#ff4d4f', borderRadius: '50%', border: '2px solid var(--bg-primary)'
                  }} />
                )}
              </button>

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
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: '12px', padding: '0', minWidth: '240px',
                    boxShadow: 'var(--shadow-lg)', zIndex: 1000,
                    overflow: 'hidden', animation: 'slideDown 0.2s ease'
                  }}>
                    {/* User info section */}
                    <div style={{ padding: '1rem 1rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-default)' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
                        background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 'bold', fontSize: '1.1rem'
                      }}>
                        {user.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : initial}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {userName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {user.email}
                        </div>
                      </div>
                    </div>

                    {/* Subscription status */}
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Suscripción</span>
                        <span style={{
                          fontSize: '0.65rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600,
                          background: isSubscriber ? 'rgba(78, 203, 113, 0.15)' : 'var(--bg-tertiary)',
                          color: isSubscriber ? 'var(--accent-green)' : 'var(--text-secondary)',
                          border: `1px solid ${isSubscriber ? 'rgba(78, 203, 113, 0.3)' : 'var(--border-default)'}`
                        }}>
                          {isSubscriber ? '✓ Activa' : 'Free'}
                        </span>
                      </div>
                      {isSubscriber && expiresAt && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          Válida hasta {expiresAt}
                        </div>
                      )}

                      {isSubscriber && profile?.cancel_at_period_end && (
                        <div style={{ 
                          marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--accent-red)', 
                          background: 'rgba(239, 91, 91, 0.08)', padding: '0.4rem', 
                          borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(239, 91, 91, 0.2)' 
                        }}>
                          No se renovará automáticamente
                        </div>
                      )}

                      {isSubscriber && profile?.role !== 'admin' && !profile?.cancel_at_period_end && (
                        <button
                          onClick={() => { setShowCancelModal(true); setShowDropdown(false); }}
                          style={{
                            marginTop: '0.5rem', width: '100%', padding: '0.4rem',
                            background: 'rgba(239, 91, 91, 0.08)', border: '1px solid rgba(239, 91, 91, 0.2)',
                            borderRadius: '6px', color: 'var(--accent-red)', cursor: 'pointer',
                            fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.2s'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 91, 91, 0.15)'; e.currentTarget.style.borderColor = 'rgba(239, 91, 91, 0.4)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239, 91, 91, 0.08)'; e.currentTarget.style.borderColor = 'rgba(239, 91, 91, 0.2)'; }}
                        >
                          Cancelar suscripción
                        </button>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-default)' }}>
                      <button 
                        onClick={() => { setShowResourceModal(true); setShowDropdown(false); }}
                        style={{
                          width: '100%', padding: '0.5rem 0.75rem', textAlign: 'left',
                          background: 'transparent', border: 'none', color: 'var(--text-primary)',
                          cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Solicitar Recurso
                      </button>
                      
                      <button 
                        onClick={() => { setShowSupportModal(true); setShowDropdown(false); }}
                        style={{
                          width: '100%', padding: '0.5rem 0.75rem', textAlign: 'left',
                          background: 'transparent', border: 'none', color: 'var(--text-primary)',
                          cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        Reportar un problema
                      </button>
                    </div>

                    {/* Logout Actions */}
                    <div style={{ padding: '0.5rem' }}>
                      <button 
                        onClick={handleLogout}
                        style={{
                          width: '100%', padding: '0.5rem 0.75rem', textAlign: 'left',
                          background: 'transparent', border: 'none', color: 'var(--accent-red)',
                          cursor: 'pointer', borderRadius: '6px', fontSize: '0.85rem',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 91, 91, 0.08)'}
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
            </>
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

      {/* --- Modals --- */}
      
      {/* 1. Cancel Subscription */}
      {showCancelModal && (
        <div style={modalOverlayStyle} onClick={() => !isCancelling && setShowCancelModal(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
            <h3 style={modalTitleStyle}>¿Cancelar suscripción?</h3>
            <p style={modalTextStyle}>
              Perderás acceso a todos los recursos premium y descargas ilimitadas al final de tu periodo actual. Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowCancelModal(false)} disabled={isCancelling} style={btnSecondaryStyle}>
                Mantener
              </button>
              <button onClick={handleCancelSubscription} disabled={isCancelling} style={btnDangerStyle}>
                {isCancelling ? 'Cancelando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Support / Bug Report */}
      {showSupportModal && (
        <div style={modalOverlayStyle} onClick={() => !isSubmitting && setShowSupportModal(false)}>
          <div style={{...modalContentStyle, maxWidth: '500px', textAlign: 'left'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>Soporte / Reportar Problema</h3>
            <p style={modalTextStyle}>Cuéntanos qué pasó o qué podemos mejorar en el chat.</p>
            
            <form onSubmit={submitSupport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Tipo</label>
                <select name="type" required style={inputStyle}>
                  <option value="bug">Error en el sistema (Bug)</option>
                  <option value="suggestion">Sugerencia de mejora</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Descripción</label>
                <textarea name="description" required rows={4} placeholder="Detalla el problema o sugerencia..." style={{...inputStyle, resize: 'vertical'}} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowSupportModal(false)} disabled={isSubmitting} style={btnSecondaryStyle}>Cancelar</button>
                <button type="submit" disabled={isSubmitting} style={btnPrimaryStyle}>{isSubmitting ? 'Enviando...' : 'Enviar Reporte'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Resource Request */}
      {showResourceModal && (
        <div style={modalOverlayStyle} onClick={() => !isSubmitting && setShowResourceModal(false)}>
          <div style={{...modalContentStyle, maxWidth: '500px', textAlign: 'left'}} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>Solicitar un Recurso</h3>
            <p style={modalTextStyle}>¿No encontraste lo que buscabas? Pídenoslo y lo subiremos a la base de datos.</p>
            
            <form onSubmit={submitResource} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>¿Qué necesitas?</label>
                <input name="title" required type="text" placeholder="Ej: Familia de puerta pivotante Revit" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Descripción adicional</label>
                <textarea name="description" required rows={3} placeholder="Para qué versión, medidas, detalles técnicos..." style={{...inputStyle, resize: 'vertical'}} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>URL de referencia (opcional)</label>
                <input name="reference_url" type="url" placeholder="https://ejemplo.com/recurso" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowResourceModal(false)} disabled={isSubmitting} style={btnSecondaryStyle}>Cancelar</button>
                <button type="submit" disabled={isSubmitting} style={btnPrimaryStyle}>{isSubmitting ? 'Enviando...' : 'Solicitar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. News / Novedades */}
      {showNewsModal && (
        <div style={modalOverlayStyle} onClick={() => setShowNewsModal(false)}>
          <div style={{...modalContentStyle, maxWidth: '500px', textAlign: 'left'}} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{...modalTitleStyle, margin: 0}}>Novedades</h3>
              <button onClick={() => setShowNewsModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {news.length === 0 ? (
                <p style={modalTextStyle}>No hay novedades recientes.</p>
              ) : (
                news.map(item => (
                  <div key={item.id} style={{ padding: '1rem', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '0.25rem', fontWeight: 600 }}>
                      {new Date(item.created_at).toLocaleDateString('es-CO')}
                    </div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>{item.title}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* 5. Custom Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 10000,
          background: toast.type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)',
          color: 'white', padding: '12px 24px', borderRadius: '8px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'slideUp 0.3s ease', fontWeight: 500, fontSize: '0.9rem'
        }}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </>
  );
}

// Reusable Styles
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 9999, animation: 'fadeIn 0.2s ease', padding: '1rem'
};

const modalContentStyle: React.CSSProperties = {
  background: 'var(--bg-card)', border: '1px solid var(--border-default)',
  borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '400px',
  boxShadow: 'var(--shadow-lg)', textAlign: 'center', animation: 'slideDown 0.3s ease'
};

const modalTitleStyle: React.CSSProperties = { color: 'var(--text-primary)', margin: '0 0 0.5rem', fontSize: '1.15rem' };
const modalTextStyle: React.CSSProperties = { color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1.5rem', lineHeight: 1.5 };

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.75rem', borderRadius: '8px',
  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'inherit'
};

const btnSecondaryStyle: React.CSSProperties = {
  flex: 1, padding: '0.65rem', borderRadius: '8px',
  background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)',
  color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
};

const btnPrimaryStyle: React.CSSProperties = {
  flex: 1, padding: '0.65rem', borderRadius: '8px',
  background: 'var(--accent-gold)', border: 'none',
  color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
};

const btnDangerStyle: React.CSSProperties = {
  flex: 1, padding: '0.65rem', borderRadius: '8px',
  background: 'rgba(239, 91, 91, 0.15)', border: '1px solid rgba(239, 91, 91, 0.3)',
  color: 'var(--accent-red)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s'
};
