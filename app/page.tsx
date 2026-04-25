import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
              <rect x="10" y="10" width="10" height="10" stroke="var(--accent-gold)" strokeWidth="2.5" />
            </svg>
            <span>Asistente AEC</span>
          </div>
          <Link href="/chat" className="landing-nav-cta">
            Empezar ahora
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-bg">
          <div className="landing-hero-glow" />
          <div className="landing-hero-grid" />
        </div>
        <div className="landing-container">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            Asistente IA para profesionales AEC
          </div>
          <h1 className="landing-h1">
            Encuentra recursos BIM<br />
            <span className="landing-h1-gold">en segundos, no en horas</span>
          </h1>
          <p className="landing-subtitle">
            Consulta con nuestro asistente inteligente y descarga familias paramátricas de Revit,
            plantillas profesionales y modelos BIM listos para usar en tus proyectos.
          </p>
          <div className="landing-hero-actions">
            <Link href="/chat" className="landing-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Empezar a buscar
            </Link>
            <a href="#precios" className="landing-btn-secondary">
              Ver planes
            </a>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat">
              <span className="landing-stat-number">+500</span>
              <span className="landing-stat-label">Recursos BIM</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">23</span>
              <span className="landing-stat-label">Packs profesionales</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">IA</span>
              <span className="landing-stat-label">Búsqueda inteligente</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Todo lo que necesitas para tus proyectos</h2>
          <p className="landing-section-sub">
            Recursos profesionales de arquitectura, ingeniería y construcción en un solo lugar.
          </p>
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🏗️</div>
              <h3>Familias Revit</h3>
              <p>Familias paramátricas listas para usar en tus proyectos de arquitectura e ingeniería. Puertas, ventanas, mobiliario y más.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">📐</div>
              <h3>Plantillas profesionales</h3>
              <p>Plantillas de proyecto, hojas de título y configuraciones predefinidas para acelerar tu flujo de trabajo en Revit.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🤖</div>
              <h3>Búsqueda con IA</h3>
              <p>Describe lo que necesitas en lenguaje natural y nuestro asistente encontrará los recursos perfectos para ti.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">⬇️</div>
              <h3>Descarga inmediata</h3>
              <p>Compra y descarga al instante. Sin esperas, sin complicaciones. Directo a tu proyecto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Así de fácil funciona</h2>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3>Pregunta</h3>
              <p>Escribe qué necesitas: &quot;familias de puertas para Revit&quot;, &quot;plantilla de proyecto residencial&quot;...</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3>Encuentra</h3>
              <p>La IA analiza tu consulta y te muestra los recursos más relevantes de nuestro catálogo.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3>Descarga</h3>
              <p>Compra el recurso individual o suscríbete para acceso ilimitado y descarga al instante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="landing-section" id="precios">
        <div className="landing-container">
          <h2 className="landing-h2">Planes</h2>
          <p className="landing-section-sub">
            Elige la opción que mejor se adapte a tus necesidades.
          </p>
          <div className="landing-pricing-grid">
            <div className="landing-pricing-card">
              <div className="landing-pricing-header">
                <h3>Individual</h3>
                <div className="landing-pricing-price">
                  $15.000 <span>COP</span>
                </div>
                <p className="landing-pricing-period">por recurso</p>
              </div>
              <ul className="landing-pricing-features">
                <li>✓ Un recurso a elegir</li>
                <li>✓ Descarga inmediata</li>
                <li>✓ Acceso permanente al archivo</li>
                <li>✓ Sin compromiso</li>
              </ul>
              <Link href="/chat" className="landing-btn-outline">
                Comprar recurso
              </Link>
            </div>
            <div className="landing-pricing-card landing-pricing-featured">
              <div className="landing-pricing-badge">Más popular</div>
              <div className="landing-pricing-header">
                <h3>Suscripción Pro</h3>
                <div className="landing-pricing-price">
                  $35.000 <span>COP</span>
                </div>
                <p className="landing-pricing-period">por mes</p>
              </div>
              <ul className="landing-pricing-features">
                <li>✓ Acceso a todos los recursos</li>
                <li>✓ 3 descargas diarias</li>
                <li>✓ Nuevos recursos cada semana</li>
                <li>✓ Cancela cuando quieras</li>
              </ul>
              <Link href="/chat" className="landing-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Suscribirme
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <h2 className="landing-h2" style={{ marginBottom: '12px' }}>¿Listo para optimizar tus proyectos?</h2>
          <p className="landing-section-sub" style={{ marginBottom: '32px' }}>
            Empieza a buscar recursos BIM con nuestro asistente inteligente.
          </p>
          <Link href="/chat" className="landing-btn-primary">
            Empezar ahora — Es gratis consultar
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-inner">
            <div className="landing-logo" style={{ opacity: 0.6 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
                <rect x="10" y="10" width="10" height="10" stroke="var(--accent-gold)" strokeWidth="2.5" />
              </svg>
              <span>Asistente AEC</span>
            </div>
            <p className="landing-copyright">© {new Date().getFullYear()} Asistente AEC. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
