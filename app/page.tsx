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
            Tu experto en Arquitectura, Ingeniería y Modelado 3D
          </div>
          <h1 className="landing-h1">
            Encuentra modelos, bloques y familias<br />
            <span className="landing-h1-gold">sin perder horas buscando</span>
          </h1>
          <p className="landing-subtitle">
            Dile adiós a las búsquedas frustrantes. Pídele al asistente lo que necesitas en lenguaje natural y obtén 
            familias Revit, bloques AutoCAD, modelos 3D y escenas D5 Render exactas para tu proyecto.
          </p>
          <div className="landing-tags">
            <span className="landing-tag">Familias Revit</span>
            <span className="landing-tag">Bloques AutoCAD</span>
            <span className="landing-tag">Modelos Sketchup</span>
            <span className="landing-tag">Assets D5 Render</span>
            <span className="landing-tag">Cursos Arquitectura</span>
            <span className="landing-tag">Texturas V-Ray</span>
            <span className="landing-tag">3ds Max</span>
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
              <span className="landing-stat-number">+ Miles</span>
              <span className="landing-stat-label">Modelos 3D y Bloques</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">95%</span>
              <span className="landing-stat-label">Precisión de búsqueda</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-number">IA</span>
              <span className="landing-stat-label">Render y Modelado</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. DOLOR — ¿Te suena familiar? ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Buscar recursos no debería ser un dolor de cabeza</h2>
          <div className="landing-pain-grid">
            <div className="landing-pain-card">
              <div className="landing-pain-icon">😩</div>
              <p>Pasas <strong>horas buscando familias o modelos 3D</strong> en foros gratuitos y terminas descargando archivos que están rotos o mal modelados.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🔍</div>
              <p>Incluso en páginas de pago, tienes que poner palabras clave exactas, <strong>pasar página tras página</strong> y ver resultados que no encajan.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">⏳</div>
              <p>El tiempo apremia en la entrega de tu proyecto y <strong>perder tiempo buscando</strong> te obliga a empezar desde cero por no hallar la solución correcta.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🤖</div>
              <p>Preguntarle a buscadores genéricos es frustrante porque <strong>no entienden de arquitectura, ingeniería ni términos técnicos.</strong></p>
            </div>
          </div>
          <p className="landing-pain-conclusion">
            Imagina pedir un recurso con tus propias palabras y que alguien experto te lo entregue al instante.
          </p>
        </div>
      </section>

      {/* ===== 3. SOLUCIÓN — Nosotros lo resolvimos ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">La precisión de la Inteligencia Artificial</h2>
          <p className="landing-section-sub">
            Con una simple descripción de lo que quieres, el asistente te da un 95% de precisión en lo que buscas.
          </p>
          <div className="landing-solution-grid">
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Asistente Experto en la Materia</h4>
                <p>No es un buscador de palabras. Es una IA que entiende la diferencia entre un muro cortina en Revit y un bloque 2D en AutoCAD.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Catálogo Inmenso y Profesional</h4>
                <p>Acceso a toneladas de librerías, cursos, modelos 3D y herramientas de renderizado que utilizan los verdaderos profesionales.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Soluciones Exactas, Sin Paginar</h4>
                <p>Adiós a revisar 20 páginas de resultados. El asistente filtra la basura y te entrega las 2 o 3 opciones premium perfectas para ti.</p>
              </div>
            </div>
            <div className="landing-solution-item">
              <div className="landing-solution-check">✓</div>
              <div>
                <h4>Descarga Inmediata</h4>
                <p>Hablas, el asistente lo encuentra, confirmas y lo descargas directamente para insertarlo en tu modelo BIM o CAD.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 4. CATÁLOGO — Mira todo lo que hay ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">El ecosistema definitivo de Arquitectura e Ingeniería</h2>
          <p className="landing-section-sub">
            Desde planos en 2D hasta renders fotorrealistas. Soporte para todos los programas líderes.
          </p>
          <div className="landing-catalog-grid">
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🏗️</div>
              <h3>Familias Revit y BIM</h3>
              <p>Librerías completas de arquitectura, estructura y MEP. Paramétricas, optimizadas y listas para integrar en tus modelos Revit.</p>
              <span className="landing-catalog-tag">Autodesk Revit</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🎨</div>
              <h3>Escenas D5 Render y V-Ray</h3>
              <p>Texturas PBR, materiales, modelos de vegetación y escenas completas para D5 Render, V-Ray y Corona Renderer.</p>
              <span className="landing-catalog-tag">Render IA</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">📐</div>
              <h3>Bloques AutoCAD</h3>
              <p>Miles de bloques DWG, detalles constructivos y plantillas para planimetría, organizados y limpios de errores.</p>
              <span className="landing-catalog-tag">AutoCAD</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🧊</div>
              <h3>Modelos 3D Premium</h3>
              <p>Mobiliario y decoración en alta resolución para Sketchup, 3ds Max y Blender. Listos para tus recorridos virtuales.</p>
              <span className="landing-catalog-tag">Sketchup / 3ds Max</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🎓</div>
              <h3>Cursos Especializados</h3>
              <p>Aprende de los mejores con cursos de AutoCAD, Civil 3D, Revit, ETABS, CYPECAD, Sketchup y herramientas de renderizado.</p>
              <span className="landing-catalog-tag">Formación Continua</span>
            </div>
            <div className="landing-catalog-card">
              <div className="landing-catalog-icon">🧩</div>
              <h3>Plantillas y Utilidades</h3>
              <p>Hojas de título, rutinas de automatización, scripts y configuraciones base para acelerar el inicio de cualquier proyecto.</p>
              <span className="landing-catalog-tag">Productividad</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. CÓMO FUNCIONA — 3 pasos ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Dialoga con un experto, no con un buscador</h2>
          <p className="landing-section-sub">
            En un par de chats, el asistente entiende lo que tienes en mente y te lo entrega.
          </p>
          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <h3>Interactúa</h3>
              <p>Háblale de forma humana. Por ejemplo: &quot;Necesito descargar modelos 3D de sofás modernos para Sketchup&quot;.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <h3>El Asistente Analiza</h3>
              <p>Usando su experiencia técnica, evalúa nuestro inmenso catálogo y selecciona únicamente los recursos premium que coinciden al 95%.</p>
            </div>
            <div className="landing-step-arrow">→</div>
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <h3>Descarga al instante</h3>
              <p>Te muestra las mejores opciones directamente en la conversación. Lo eliges, lo descargas y vuelves a tu proyecto.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. PARA QUIÉN — Esto es para ti ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Diseñado para la industria de la Construcción y el Diseño</h2>
          <p className="landing-section-sub">
            Recursos profesionales adaptados a las exigencias de tu disciplina.
          </p>
          <div className="landing-trust-grid">
            <div className="landing-trust-item">
              <div className="landing-trust-icon">🏛️</div>
              <h4>Arquitectura y Diseño Interior</h4>
              <p>Mobiliario Sketchup, escenas D5 Render, familias Revit paramétricas y texturas fotorrealistas de alta calidad.</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">⚙️</div>
              <h4>Ingeniería y Obras Civiles</h4>
              <p>Bloques AutoCAD de detalles constructivos, modelos estructurales, y cursos avanzados de ETABS o Civil 3D.</p>
            </div>
            <div className="landing-trust-item">
              <div className="landing-trust-icon">📚</div>
              <h4>Estudiantes y Modeladores BIM</h4>
              <p>Cursos completos para dominar el software, plantillas base y familias para aprender a modelar sin errores.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. DEMO — Mira cómo funciona ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">Así se ve tu nuevo experto a la medida</h2>
          <p className="landing-section-sub">
            Una interfaz diseñada para que fluya la conversación y encuentres lo que necesitas en tiempo récord.
          </p>
          <div className="landing-demo-wrapper">
            <Image
              src="/chat-preview.png"
              alt="Vista previa del asistente mostrando una conversación con resultados de modelos 3D y familias Revit"
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
              <span className="landing-h1-gold">retrase la entrega de tu proyecto</span>
            </h2>
            <p className="landing-cta-sub">
              Ahorra horas de trabajo integrando recursos profesionales desde el primer minuto.<br />
              Habla con el Asistente ahora mismo y soluciona ese problema que te tiene estancado.
            </p>
            <Link href="/chat" className="landing-btn-primary landing-btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Comenzar a dialogar gratis
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
              <span>Asistente Arquitectura e Ingeniería</span>
            </div>
            <p className="landing-copyright">© {new Date().getFullYear()} Asistente Inteligente. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
