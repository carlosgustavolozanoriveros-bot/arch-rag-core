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
            Probar el asistente
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
            Todos los recursos AEC<br />
            <span className="landing-h1-gold">que tu proyecto necesita</span>
          </h1>
          <p className="landing-subtitle">
            Cursos, familias Revit, bloques AutoCAD, escenas D5 Render, assets de visualización,
            plantillas de proyecto, materiales, modelos 3D y mucho más.
            Dile al asistente qué buscas y lo encuentra por ti.
          </p>
          <div className="landing-tags">
            <span className="landing-tag">Familias Revit</span>
            <span className="landing-tag">Cursos</span>
            <span className="landing-tag">Bloques AutoCAD</span>
            <span className="landing-tag">Escenas D5</span>
            <span className="landing-tag">Assets 3D</span>
            <span className="landing-tag">Plantillas</span>
            <span className="landing-tag">Materiales</span>
            <span className="landing-tag">Renders</span>
            <span className="landing-tag">Modelado BIM</span>
            <span className="landing-tag">Visualización</span>
          </div>
          <div className="landing-hero-actions">
            <Link href="/chat" className="landing-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Hablar con el asistente
            </Link>
          </div>
          <div className="landing-hero-stats">
            <div className="landing-stat">
              <span className="landing-stat-number">+500</span>
              <span className="landing-stat-label">Recursos disponibles</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">+90</span>
              <span className="landing-stat-label">Cursos especializados</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">IA</span>
              <span className="landing-stat-label">Búsqueda inteligente</span>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll find */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Todo lo que un profesional AEC necesita</h2>
          <p className="landing-section-sub">
            No pierdas tiempo buscando en internet. Aquí está todo organizado y listo para descargar.
          </p>
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🎓</div>
              <h3>Cursos especializados</h3>
              <p>Más de 90 cursos de Revit, AutoCAD, Civil 3D, ETABS, CYPE, Dynamo, Navisworks, Photoshop, Illustrator y más.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🏗️</div>
              <h3>Familias Revit paramátricas</h3>
              <p>Puertas, ventanas, mobiliario, accesorios de baño, iluminación, elementos estructurales — todo editable y listo para tus proyectos.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">🎨</div>
              <h3>Librerías D5 Render</h3>
              <p>Materiales, vegetación, mobiliario y assets para crear renders fotorrealistas de tus proyectos arquitectónicos.</p>
            </div>
            <div className="landing-feature-card">
              <div className="landing-feature-icon">📐</div>
              <h3>Plantillas y bloques</h3>
              <p>Plantillas de proyecto, hojas de título, bloques AutoCAD y configuraciones predefinidas para acelerar tu trabajo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why the assistant */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">¿Por qué usar nuestro asistente?</h2>
          <p className="landing-section-sub">
            Porque buscar recursos no debería tomar horas.
          </p>
          <div className="landing-why-grid">
            <div className="landing-why-card">
              <div className="landing-why-number">01</div>
              <h3>Búsqueda inteligente</h3>
              <p>No necesitas saber el nombre exacto. Escribe &quot;necesito familias de puertas corredizas para Revit&quot; y la IA entiende lo que buscas.</p>
            </div>
            <div className="landing-why-card">
              <div className="landing-why-number">02</div>
              <h3>Todo en un catálogo</h3>
              <p>Cursos, familias, plantillas, bloques, librerías de render — no saltes entre 20 páginas. Todo está aquí, curado y organizado.</p>
            </div>
            <div className="landing-why-card">
              <div className="landing-why-number">03</div>
              <h3>Descarga inmediata</h3>
              <p>Encuentras lo que necesitas, lo compras y lo descargas al instante. Sin esperas, sin formularios, directo a tu proyecto.</p>
            </div>
            <div className="landing-why-card">
              <div className="landing-why-number">04</div>
              <h3>Contenido profesional</h3>
              <p>Cada recurso fue creado por profesionales AEC activos. No son archivos genéricos — son herramientas reales para proyectos reales.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Así de fácil funciona</h2>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3>Pregunta</h3>
              <p>Escribe qué necesitas: &quot;curso de Revit estructural&quot;, &quot;familias de mobiliario&quot;, &quot;materiales para D5&quot;...</p>
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
              <p>Selecciona el recurso, cómpralo y descárgalo al instante. Listo para usar en tu proyecto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Hecho por profesionales, para profesionales</h2>
          <div className="landing-trust-grid">
            <div className="landing-trust-item">
              <div className="landing-trust-icon">🏛️</div>
              <h4>Arquitectura</h4>
              <p>Familias de diseño, materiales, renders, plantillas de presentación</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">⚙️</div>
              <h4>Ingeniería</h4>
              <p>Modelos estructurales, MEP, Civil 3D, cálculos, plantillas técnicas</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">🔨</div>
              <h4>Construcción</h4>
              <p>Planificación, presupuestos, programación de obra, documentación</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="landing-cta-box">
            <h2 className="landing-h2" style={{ marginBottom: '12px' }}>Deja de buscar. Empieza a encontrar.</h2>
            <p className="landing-section-sub" style={{ marginBottom: '32px' }}>
              Consultar con el asistente es gratis. Escríbele lo que necesitas y descubre todo lo que tenemos para ti.
            </p>
            <Link href="/chat" className="landing-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Hablar con el asistente
            </Link>
          </div>
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
