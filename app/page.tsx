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
            <span>Asistente de Recursos AEC</span>
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
          <div className="landing-hero-actions" style={{ marginTop: '36px' }}>
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

      {/* ===== INFINITE MARQUEE (SEO KEYWORDS) ===== */}
      <div className="landing-marquee-wrapper">
        <div className="landing-marquee">
          {/* Group 1 */}
          <span>Autodesk Revit</span>
          <span>Bloques AutoCAD DWG</span>
          <span>Sketchup</span>
          <span>D5 Render</span>
          <span>V-Ray</span>
          <span>Corona Renderer</span>
          <span>3ds Max</span>
          <span>Blender</span>
          <span>Familias Paramétricas</span>
          <span>Cursos Arquitectura</span>
          <span>Ingeniería Civil</span>
          <span>Modelos 3D Premium</span>
          <span>Texturas PBR</span>
          {/* Group 2 (Duplicate for infinite loop) */}
          <span>Autodesk Revit</span>
          <span>Bloques AutoCAD DWG</span>
          <span>Sketchup</span>
          <span>D5 Render</span>
          <span>V-Ray</span>
          <span>Corona Renderer</span>
          <span>3ds Max</span>
          <span>Blender</span>
          <span>Familias Paramétricas</span>
          <span>Cursos Arquitectura</span>
          <span>Ingeniería Civil</span>
          <span>Modelos 3D Premium</span>
          <span>Texturas PBR</span>
        </div>
      </div>

      {/* ===== 2. DOLOR — ¿Te suena familiar? ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Buscar recursos no debería ser un dolor de cabeza</h2>
          <div className="landing-pain-grid">
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🗂️</div>
              <p>¿Luchas contra gigas de <strong>archivos desorganizados</strong>? Pierdes horas tratando de recordar en qué carpeta guardaste ese modelo o familia que necesitas.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🔍</div>
              <p>En páginas de catálogos tienes que poner palabras clave exactas, <strong>pasar página tras página</strong> y conformarte con resultados genéricos que no encajan.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">⏳</div>
              <p>El tiempo apremia en la entrega de tu proyecto y <strong>perder tiempo buscando</strong> te obliga a modelar desde cero, retrasando tu trabajo.</p>
            </div>
            <div className="landing-pain-card">
              <div className="landing-pain-icon">🤖</div>
              <p>Preguntarle a buscadores tradicionales es frustrante porque <strong>no entienden de arquitectura, ingeniería ni términos técnicos.</strong></p>
            </div>
          </div>
          <p className="landing-pain-conclusion">
            Imagina pedir un recurso con tus propias palabras y que un experto te entregue opciones premium al instante.
          </p>
        </div>
      </section>

      {/* ===== 2.1 VERSUS — Antes y después ===== */}
      <section className="landing-section landing-section-alt">
        <div className="landing-container">
          <h2 className="landing-h2">La diferencia: Antes y después</h2>
          <div className="versus-grid">
            <div className="vs-card bad">
              <div className="vs-card-head">
                <div className="vs-badge bad">Sin el asistente</div>
              </div>
              <ul className="vs-list">
                <li>Abres 4 plataformas distintas y comparas resultados manualmente</li>
                <li>Lees fichas técnicas completas para entender si el archivo sirve</li>
                <li>Descargas, abres, compruebas la compatibilidad, y muchas veces vuelves atrás</li>
                <li>Guardas el archivo en alguna carpeta sin nombre que no vas a encontrar luego</li>
                <li>Cuando termina el proyecto, empiezas el mismo proceso desde cero</li>
              </ul>
            </div>
            <div className="vs-card good">
              <div className="vs-card-head">
                <div className="vs-badge good">Con Asistente</div>
              </div>
              <ul className="vs-list">
                <li>Escribes lo que necesitas exactamente como se lo dirías a un colega</li>
                <li>El asistente entiende el contexto técnico del proyecto y filtra por ti</li>
                <li>Recibes las mejores opciones curadas — sin ruido, sin scroll</li>
                <li>Revisas, compras y descargas sin salir del chat</li>
                <li>Historial organizado automáticamente — lo que buscaste hoy sigue ahí mañana</li>
              </ul>
            </div>
          </div>
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

      {/* ===== 5.1 FEATURES — Plataforma completa ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Todo lo que necesitas, integrado en un chat</h2>
          <p className="landing-section-sub">
            Una plataforma completa que evoluciona contigo.
          </p>
          <div className="feat-grid">
            <div className="feat">
              <div className="feat-icon">💬</div>
              <div className="feat-t">Historial siempre disponible</div>
              <p className="feat-d">Cada búsqueda queda guardada automáticamente. Retoma cualquier proyecto exactamente donde lo dejaste — sin volver a buscar lo que ya encontraste.</p>
            </div>
            <div className="feat">
              <div className="feat-icon">📥</div>
              <div className="feat-t">Buzón de solicitudes</div>
              <p className="feat-d">¿No encontraste el recurso exacto? Lo pides directamente y el equipo lo consigue o lo crea. Nunca te quedas sin salida.</p>
            </div>
            <div className="feat">
              <div className="feat-icon">🎓</div>
              <div className="feat-t">Cursos y formación incluidos</div>
              <p className="feat-d">Además de recursos, accede a cursos especializados de los programas líderes del sector. Aprende y descarga desde el mismo lugar.</p>
            </div>
            <div className="feat">
              <div className="feat-icon">🔔</div>
              <div className="feat-t">Alertas de nuevos recursos</div>
              <p className="feat-d">Cada vez que se sube una colección nueva al catálogo, recibes una notificación. Siempre al día con las herramientas más actuales.</p>
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

      {/* ===== 7.1 SOCIAL PROOF — Testimonios ===== */}
      <section className="landing-section">
        <div className="landing-container">
          <h2 className="landing-h2">Profesionales reales, tiempo recuperado</h2>
          <div className="proof-grid">
            <div className="proof-card">
              <div className="proof-stars">★★★★★</div>
              <p className="proof-text">&quot;Lo que antes me tomaba 40 minutos buscando en tres plataformas distintas ahora lo resuelvo en un mensaje. El asistente entiende exactamente de qué le hablo.&quot;</p>
              <div className="proof-author">
                <div className="proof-av">CR</div>
                <div>
                  <div className="proof-name">Carlos R.</div>
                  <div className="proof-role">Arquitecto BIM · Estudio Propio</div>
                </div>
              </div>
            </div>
            <div className="proof-card">
              <div className="proof-stars">★★★★★</div>
              <p className="proof-text">&quot;Nuestro equipo lo usa a diario. La calidad de los recursos es otra categoría — nada que ver con lo que encuentras gratis o en catálogos genéricos.&quot;</p>
              <div className="proof-author">
                <div className="proof-av">ML</div>
                <div>
                  <div className="proof-name">María L.</div>
                  <div className="proof-role">Directora de Diseño · Constructora</div>
                </div>
              </div>
            </div>
            <div className="proof-card">
              <div className="proof-stars">★★★★★</div>
              <p className="proof-text">&quot;Como estudiante no tenía acceso a recursos premium. Esto me pone al nivel de los profesionales sin tener que navegar veinte páginas distintas.&quot;</p>
              <div className="proof-author">
                <div className="proof-av">DS</div>
                <div>
                  <div className="proof-name">Diego S.</div>
                  <div className="proof-role">Estudiante · Arquitectura 5to año</div>
                </div>
              </div>
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
              <span>Asistente de Recursos AEC</span>
            </div>
            <p className="landing-copyright">© {new Date().getFullYear()} Asistente Inteligente. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
