import Link from 'next/link';
import Image from 'next/image';

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

      {/* ===== 1. HERO — El gancho ===== */}
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
            Deja de perder horas<br />
            <span className="landing-h1-gold">buscando recursos AEC</span>
          </h1>
          <p className="landing-subtitle">
            Cursos, familias Revit, bloques AutoCAD, escenas D5 Render, plantillas,
            materiales, modelos 3D — pregúntale al asistente y descárgalo al instante.
          </p>
          <div className="landing-tags">
            <span className="landing-tag">Familias Revit</span>
            <span className="landing-tag">+90 Cursos</span>
            <span className="landing-tag">Bloques AutoCAD</span>
            <span className="landing-tag">Escenas D5</span>
            <span className="landing-tag">Assets 3D</span>
            <span className="landing-tag">Plantillas</span>
            <span className="landing-tag">Materiales</span>
            <span className="landing-tag">Modelado BIM</span>
            <span className="landing-tag">Visualización</span>
          </div>
          <div className="landing-hero-actions">
            <Link href="/chat" className="landing-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Hablar con el asistente — Es gratis
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

      {/* ===== 2. DOLOR — ¿Te suena familiar? ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">¿Te suena familiar?</h2>
          <div className="landing-pain-grid">
            <div className="landing-pain-card">
              <div className="landing-pain-icon">😩</div>
              <p>Pasas <strong>horas buscando</strong> familias de Revit en foros, blogs y páginas que ni conoces</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">💔</div>
              <p>Descargas archivos que <strong>no sirven</strong>, están incompletos o son de versiones antiguas</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🔍</div>
              <p>No encuentras <strong>cursos actualizados en español</strong> para el software que necesitas</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🔄</div>
              <p>Cada proyecto <strong>empiezas de cero</strong> porque no tienes una librería organizada</p>
            </div>
          </div>
          <p className="landing-pain-conclusion">
            Si dijiste &quot;sí&quot; a alguno, este asistente se hizo para ti.
          </p>
        </div>
      </section>

      {/* ===== 3. SOLUCIÓN — Nosotros lo resolvimos ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Un solo lugar. Todo lo que necesitas.</h2>
          <p className="landing-section-sub">
            Dejamos de buscar en 20 páginas diferentes. Ahora todo está aquí.
          </p>
          <div className="landing-solution-grid">
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Catálogo centralizado</h4>
                <p>Cursos, familias, bloques, assets, escenas y plantillas — todo curado y organizado en un solo lugar.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>IA que entiende lo que buscas</h4>
                <p>No necesitas saber el nombre exacto. Escribe &quot;familias de puertas corredizas&quot; y la IA lo encuentra.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Descarga al instante</h4>
                <p>Compra y descarga en segundos. Sin formularios, sin esperas. Directo a tu proyecto.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Contenido profesional real</h4>
                <p>Creado por profesionales AEC activos. No son archivos genéricos — son herramientas para proyectos reales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. CATÁLOGO — Mira todo lo que hay ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Mira todo lo que vas a encontrar</h2>
          <p className="landing-section-sub">
            Más de 500 recursos profesionales listos para usar.
          </p>
          <div className="landing-catalog-grid">
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🎓</div>
              <h3>Mega Pack +90 Cursos</h3>
              <p>Revit, AutoCAD, Civil 3D, ETABS, CYPE, Dynamo, Navisworks, Photoshop, Illustrator y muchos más.</p>
              <span className="landing-catalog-tag">Aprendizaje</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🏗️</div>
              <h3>Familias Revit</h3>
              <p>Puertas, ventanas, mobiliario, baños, iluminación, elementos estructurales — todo paramétrico y editable.</p>
              <span className="landing-catalog-tag">Modelado</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🎨</div>
              <h3>Escenas y Assets D5</h3>
              <p>Materiales, vegetación, mobiliario y escenas completas para renders fotorrealistas.</p>
              <span className="landing-catalog-tag">Renderizado</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">📐</div>
              <h3>Plantillas de proyecto</h3>
              <p>Plantillas Revit, hojas de título, configuraciones predefinidas para empezar proyectos en minutos.</p>
              <span className="landing-catalog-tag">Productividad</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">✏️</div>
              <h3>Bloques AutoCAD</h3>
              <p>Bloques 2D y 3D organizados por categoría: arquitectura, mobiliario, instalaciones, detalles constructivos.</p>
              <span className="landing-catalog-tag">Documentación</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🧩</div>
              <h3>Packs temáticos</h3>
              <p>Conjuntos completos para proyectos residenciales, comerciales, estructurales e institucionales.</p>
              <span className="landing-catalog-tag">Paquetes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. CÓMO FUNCIONA — 3 pasos ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Así de fácil funciona</h2>
          <p className="landing-section-sub">
            Sin complicaciones. Sin registro obligatorio.
          </p>
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
              <p>La IA analiza tu consulta y te muestra los recursos más relevantes con vista previa.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3>Descarga</h3>
              <p>Selecciona, compra y descárgalo al instante. Listo para usar en tu proyecto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. PARA QUIÉN — Esto es para ti ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">¿Para quién es esto?</h2>
          <p className="landing-section-sub">
            Si trabajas o estudias en el mundo AEC, esto es para ti.
          </p>
          <div className="landing-trust-grid">
            <div className="landing-trust-item">
              <div className="landing-trust-icon">🏛️</div>
              <h4>Arquitectos</h4>
              <p>Familias de diseño, materiales, renders, plantillas de presentación, escenas D5</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">⚙️</div>
              <h4>Ingenieros</h4>
              <p>Modelos estructurales, MEP, Civil 3D, ETABS, CYPE, cálculos y plantillas técnicas</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">📚</div>
              <h4>Estudiantes</h4>
              <p>+90 cursos completos, plantillas base, bloques, familias para aprender desde cero</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. DEMO — Mira cómo funciona ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Mira cómo funciona</h2>
          <p className="landing-section-sub">
            Así se ve una conversación real con el asistente.
          </p>
          <div className="landing-demo-wrapper">
            <Image
              src="/chat-preview.png"
              alt="Vista previa del asistente AEC mostrando una conversación con resultados de recursos BIM"
              width={900}
              height={560}
              className="landing-demo-image"
              priority={false}
            />
            <div className="landing-demo-overlay">
              <Link href="/chat" className="landing-btn-primary">
                Probar ahora — Es gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 8. CTA FINAL — Cierre ===== */}
      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="landing-cta-box">
            <h2 className="landing-cta-title">
              Cada minuto buscando es un minuto<br />
              <span className="landing-h1-gold">que no estás diseñando</span>
            </h2>
            <p className="landing-cta-sub">
              Consultar con el asistente es gratis. Sin registro obligatorio, sin compromiso.<br />
              Escríbele lo que necesitas y descubre todo lo que tenemos para ti.
            </p>
            <Link href="/chat" className="landing-btn-primary landing-btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Empezar ahora
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
