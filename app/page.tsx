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
            Tu experto BIM personal las 24 horas
          </div>
          <h1 className="landing-h1">
            Encuentra recursos AEC premium<br />
            <span className="landing-h1-gold">sin perder horas buscando</span>
          </h1>
          <p className="landing-subtitle">
            Accede a una librería profesional en constante crecimiento de más de <strong>50 Terabytes</strong>. 
            Cursos, familias Revit, bloques AutoCAD, escenas D5 Render y plantillas exclusivas.
            Dile al asistente experto qué necesitas y obtén resultados instantáneos.
          </p>
          <div className="landing-tags">
            <span className="landing-tag">Familias Revit Pro</span>
            <span className="landing-tag">+90 Cursos</span>
            <span className="landing-tag">Bloques AutoCAD</span>
            <span className="landing-tag">Escenas D5</span>
            <span className="landing-tag">Assets 3D Premium</span>
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
              <span className="landing-stat-number">+50 TB</span>
              <span className="landing-stat-label">Librería Profesional</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">100%</span>
              <span className="landing-stat-label">Recursos Premium</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">IA</span>
              <span className="landing-stat-label">Búsqueda personalizada</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. DOLOR — ¿Te suena familiar? ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">El tiempo en tus proyectos es oro</h2>
          <div className="landing-pain-grid">
            <div className="landing-pain-card">
              <div className="landing-pain-icon">⏳</div>
              <p>El tiempo apremia en las entregas y tú pasas <strong>horas buscando recursos dispersos</strong> entre decenas de páginas.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">📉</div>
              <p>Descargas archivos gratuitos de foros que <strong>no están hechos a medida</strong> y le restan calidad profesional a tu proyecto.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">😩</div>
              <p>Es <strong>frustrante y agota tu paciencia</strong> tener que preguntarle a personas o buscadores que no entienden realmente de AEC.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🔄</div>
              <p>Te ves obligado a <strong>empezar desde cero</strong> o adaptar recursos mediocres porque no encuentras la solución concreta que buscas.</p>
            </div>
          </div>
          <p className="landing-pain-conclusion">
            No sacrifiques la calidad ni el tiempo de tu proyecto. El Asistente AEC es la solución definitiva.
          </p>
        </div>
      </section>

      {/* ===== 3. SOLUCIÓN — Nosotros lo resolvimos ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Un experto que entiende exactamente lo que necesitas.</h2>
          <p className="landing-section-sub">
            Olvídate de buscar. Centralizamos todo para que solo te dediques a diseñar y construir.
          </p>
          <div className="landing-solution-grid">
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Librería Masiva y Centralizada</h4>
                <p>Respaldados por más de 50 Terabytes de información. Todo tipo de activos AEC disponibles en un único lugar.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Búsqueda Personalizada con IA</h4>
                <p>Habla en lenguaje técnico. El asistente entiende tu problema específico y te guía hacia el recurso exacto que lo soluciona.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Exclusivamente Recursos Premium</h4>
                <p>Nada de archivos gratuitos rotos. Todo nuestro catálogo está compuesto por recursos profesionales de altísima calidad.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Descarga al Instante</h4>
                <p>La rapidez es nuestro foco. Hablas, el asistente encuentra, compras y descargas inmediatamente sin trabas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. CATÁLOGO — Mira todo lo que hay ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Un universo de activos a tu disposición</h2>
          <p className="landing-section-sub">
            Nuestra base de datos de 50+ TB se expande constantemente con recursos de primer nivel.
          </p>
          <div className="landing-catalog-grid">
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🎓</div>
              <h3>Mega Pack +90 Cursos</h3>
              <p>Domina Revit, AutoCAD, Civil 3D, ETABS, CYPE, Dynamo, Navisworks, Photoshop, Illustrator y más con cursos profesionales.</p>
              <span className="landing-catalog-tag">Formación Pro</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🏗️</div>
              <h3>Familias Revit Premium</h3>
              <p>Librerías completas de puertas, ventanas, mobiliario, MEP y estructuras. Paramétricas, ligeras y listas para BIM.</p>
              <span className="landing-catalog-tag">Modelado BIM</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🎨</div>
              <h3>Escenas y Assets D5</h3>
              <p>Lleva tus renders al siguiente nivel con escenas preparadas, texturas PBR de alta resolución y vegetación realista.</p>
              <span className="landing-catalog-tag">Renderizado</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">📐</div>
              <h3>Plantillas Profesionales</h3>
              <p>Estandariza tu flujo de trabajo. Plantillas BIM, rutinas de Dynamo y configuraciones para no empezar nunca en blanco.</p>
              <span className="landing-catalog-tag">Productividad</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">✏️</div>
              <h3>Bloques AutoCAD</h3>
              <p>Miles de detalles constructivos, librerías de mobiliario e instalaciones categorizadas y depuradas al 100%.</p>
              <span className="landing-catalog-tag">Documentación</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🧩</div>
              <h3>Y muchísimo más...</h3>
              <p>Modelos 3D, plugins, guías, normativas. Constantemente subimos nuevo material curado a nuestra extensa red neuronal.</p>
              <span className="landing-catalog-tag">+50 Terabytes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. CÓMO FUNCIONA — 3 pasos ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Tu ayudante experto a un clic de distancia</h2>
          <p className="landing-section-sub">
            Un flujo rápido e intuitivo para que obtengas resultados sin demoras.
          </p>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3>Pregunta tu duda</h3>
              <p>Dile qué necesitas resolver: &quot;Busco familias paramétricas para un hospital&quot; o &quot;Necesito renders de vegetación&quot;.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3>El Asistente te guía</h3>
              <p>La IA comprende el contexto arquitectónico o de ingeniería y te ofrece las opciones premium perfectas para tu caso.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3>Descarga al instante</h3>
              <p>Con un par de clics obtienes el archivo en tu equipo. Ahorraste horas de búsqueda inútil.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. PARA QUIÉN — Esto es para ti ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Diseñado exclusivamente para el sector</h2>
          <p className="landing-section-sub">
            Recursos profesionales adaptados a las exigencias de tu disciplina.
          </p>
          <div className="landing-trust-grid">
            <div className="landing-trust-item">
              <div className="landing-trust-icon">🏛️</div>
              <h4>Arquitectura</h4>
              <p>Acelera el diseño interior y exterior con mobiliario de alta calidad, escenas D5 preconfiguradas y texturas realistas.</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">⚙️</div>
              <h4>Ingeniería</h4>
              <p>Respalda tus cálculos con modelos analíticos, detalles estructurales precisos, plantillas de MEP y cursos avanzados.</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">🏗️</div>
              <h4>Construcción y Gestión</h4>
              <p>Mejora tu coordinación BIM, automatiza flujos con Dynamo y capacita a tu equipo con los mejores recursos del mercado.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. DEMO — Mira cómo funciona ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Así se ve tu nuevo asistente</h2>
          <p className="landing-section-sub">
            Una interfaz diseñada para profesionales. Rápida, oscura, enfocada en los resultados.
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
                Interactuar con el Asistente
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
              No dejes que una mala búsqueda<br />
              <span className="landing-h1-gold">retrase tu próximo proyecto</span>
            </h2>
            <p className="landing-cta-sub">
              Eleva el nivel de tus entregas con recursos verdaderamente profesionales.<br />
              Habla con el Asistente AEC ahora mismo y descubre el poder de tener 50 Terabytes a tu disposición.
            </p>
            <Link href="/chat" className="landing-btn-primary landing-btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Comenzar búsqueda gratis
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
