import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <>
      {/* NAV */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
            <rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
            <rect x="10" y="10" width="10" height="10" stroke="var(--accent-gold)" strokeWidth="2.5" />
          </svg>
          Asistente de Recursos AEC
        </div>
        <div className="nav-r">
          <a className="nav-link" href="#pain">El problema</a>
          <a className="nav-link" href="#how">Cómo funciona</a>
          <a className="nav-link" href="#software">Programas</a>
          <a className="nav-link" href="#features">Funciones</a>
          <Link href="/chat" className="nav-btn">Probar el asistente &rarr;</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-l">
          <div className="pill"><span className="pill-dot"></span>Asistente para AEC</div>
          <h1 className="hero-h">Deja de buscar.<br /><em>Solo pídelo.</em><br />Descárgalo.</h1>
          <p className="hero-p">
            Un asistente inteligente que entiende el lenguaje de la arquitectura, la ingeniería y la construcción. Escribe lo que necesitas — recursos, bloques, librerías, cursos — y lo tienes listo para usar en <strong>segundos</strong>, sin navegar plataformas de pago ni leer fichas técnicas interminables.
          </p>
          <div className="hero-cta-row">
            <Link href="/chat" className="btn-main">Probar el asistente gratis <span className="btn-main-arrow">&rarr;</span></Link>
            <div className="hero-trust">
              <div className="trust-avatars">
                <div className="trust-av">MR</div>
                <div className="trust-av">JL</div>
                <div className="trust-av">CA</div>
                <div className="trust-av">+</div>
              </div>
              Profesionales y estudios ya lo usan a diario
            </div>
          </div>
        </div>

        <div className="hero-r">
          <div className="logos-strip">
            <div className="logos-label">Compatible con los softwares que ya usas</div>
            <div className="logos-grid">
              <div className="logo-chip">Revit</div>
              <div className="logo-chip">AutoCAD</div>
              <div className="logo-chip">SketchUp</div>
              <div className="logo-chip">D5 Render</div>
              <div className="logo-chip">V-Ray</div>
              <div className="logo-chip">Enscape</div>
              <div className="logo-chip">Rhino</div>
              <div className="logo-chip">Lumion</div>
              <div className="logo-chip">ArchiCAD</div>
            </div>
          </div>

          <div className="hero-img-wrap">
            <Image
              src="/chat-preview.png"
              alt="Vista previa del asistente mostrando una conversación"
              width={900}
              height={560}
              priority={false}
            />
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section className="pain" id="pain">
        <div className="pain-top">
          <h2 className="pain-h">El flujo de trabajo roto que <em>todos conocen</em> pero nadie resolvía</h2>
          <p className="pain-sub">Cada hora buscando en Turbosquid, Evermotion o CGAxis es una hora que no estás diseñando ni entregando.</p>
        </div>
        <div className="pain-grid">
          <div className="pain-card">
            <span className="pain-icon">&#x23F1;</span>
            <div className="pain-num">01</div>
            <div className="pain-title">Horas perdidas en plataformas de pago</div>
            <p className="pain-desc">Entras a Turbosquid, Evermotion, CGAxis&hellip; lees fichas, comparas previews, filtras versiones. Treinta minutos después, aún no descargaste nada útil.</p>
          </div>
          <div className="pain-card">
            <span className="pain-icon">&#x1F5D1;</span>
            <div className="pain-num">02</div>
            <div className="pain-title">Recursos que no cumplen lo que prometen</div>
            <p className="pain-desc">Pagas, descargas, abres el archivo — y la geometría está mal, las texturas no vienen o la versión del software no coincide. De vuelta a cero.</p>
          </div>
          <div className="pain-card">
            <span className="pain-icon">&#x1F50D;</span>
            <div className="pain-num">03</div>
            <div className="pain-title">Buscadores que no entienden tu contexto</div>
            <p className="pain-desc">Escribes &quot;familia Revit puerta corredera aluminio LOD 300&quot; y recibes resultados genéricos. Las plataformas de pago no hablan el idioma técnico del proyecto.</p>
          </div>
          <div className="pain-card">
            <span className="pain-icon">&#x1F4C1;</span>
            <div className="pain-num">04</div>
            <div className="pain-title">El recurso que ya usaste, perdido</div>
            <p className="pain-desc">Ese bloque perfecto que usaste hace dos meses está en alguna carpeta que ya no encuentras. Vuelves a buscarlo desde cero, como si nunca lo hubieras comprado.</p>
          </div>
        </div>
      </section>

      {/* VERSUS */}
      <section className="versus" id="versus">
        <div className="sec-label">La diferencia</div>
        <h2 className="sec-h">Antes y <em>después</em> del Asistente</h2>
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
              <div className="vs-badge good">Con el Asistente</div>
            </div>
            <ul className="vs-list">
              <li>Escribes lo que necesitas exactamente como se lo dirías a un colega</li>
              <li>El asistente entiende el contexto técnico del proyecto y filtra por ti</li>
              <li>Recibes las 2 mejores opciones curadas — sin ruido, sin scroll</li>
              <li>Revisas, compras y descargas sin salir del chat</li>
              <li>Historial organizado automáticamente — lo que buscaste hoy sigue disponible en seis meses</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="sec-label">Cómo funciona</div>
        <h2 className="sec-h">De la idea al archivo listo<br /><em>en un solo chat</em></h2>
        <div className="steps">
          <div className="step">
            <div className="step-n">01</div>
            <div className="step-t">Escribe en lenguaje natural</div>
            <p className="step-d">Sin palabras clave exactas. El asistente comprende terminología técnica real de arquitectura, estructuras, render y BIM.</p>
          </div>
          <div className="step">
            <div className="step-n">02</div>
            <div className="step-t">El asistente escanea y filtra</div>
            <p className="step-d">Analiza el catálogo completo de recursos y cursos premium en milisegundos. Descarta todo lo que no encaja con tu petición.</p>
          </div>
          <div className="step">
            <div className="step-n">03</div>
            <div className="step-t">Recibes solo las mejores opciones</div>
            <p className="step-d">Sin resultados irrelevantes. Solo las 2 o 3 opciones que realmente cumplen con tu especificación de programa, formato y calidad.</p>
          </div>
          <div className="step">
            <div className="step-n">04</div>
            <div className="step-t">Descarga dentro del chat</div>
            <p className="step-d">Revisa la ficha, compra y descarga el archivo final sin abandonar la conversación. Listo para insertar en tu software al instante.</p>
          </div>
        </div>
      </section>

      {/* SOFTWARE */}
      <section className="software" id="software">
        <div className="sw-label">Ecosistema compatible</div>
        <h2 className="sw-h">Recursos y cursos para los programas que<br /><em>los mejores profesionales usan</em></h2>
        <div className="sw-row">
          <div className="sw-chip"><span className="sw-chip-dot"></span>Revit</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>AutoCAD</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>SketchUp</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>D5 Render</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>V-Ray</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>Enscape</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>Rhino</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>Lumion</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>ArchiCAD</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>3ds Max</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>Civil 3D</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>Navisworks</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>Blender</div>
          <div className="sw-chip"><span className="sw-chip-dot"></span>Corona Renderer</div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="sec-label">Plataforma completa</div>
        <h2 className="sec-h">Todo lo que necesitas,<br /><em>integrado en un chat</em></h2>
        <div className="feat-grid">
          <div className="feat">
            <div className="feat-icon">&#x1F4AC;</div>
            <div className="feat-t">Historial siempre disponible</div>
            <p className="feat-d">Cada búsqueda queda guardada automáticamente. Retoma cualquier proyecto exactamente donde lo dejaste — sin volver a buscar lo que ya encontraste.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">&#x1F4E5;</div>
            <div className="feat-t">Buzón de solicitudes</div>
            <p className="feat-d">¿No encontraste el recurso exacto? Lo pides directamente y el equipo lo consigue o lo crea. Nunca te quedas sin salida.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">&#x1F393;</div>
            <div className="feat-t">Cursos y formación incluidos</div>
            <p className="feat-d">Además de recursos, accede a cursos especializados de los programas líderes del sector. Aprende y descarga desde el mismo lugar.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">&#x1F514;</div>
            <div className="feat-t">Alertas de nuevos recursos</div>
            <p className="feat-d">Cada vez que se sube una colección nueva al catálogo, recibes una notificación. Siempre al día con las herramientas más actuales del mercado.</p>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="proof" id="proof">
        <div className="sec-label">Lo que dicen quienes ya lo usan</div>
        <h2 className="sec-h">Profesionales reales,<br /><em>tiempo real recuperado</em></h2>
        <div className="proof-grid">
          <div className="proof-card">
            <div className="proof-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <p className="proof-text">&quot;Lo que antes me tomaba 40 minutos buscando en tres plataformas distintas ahora lo resuelvo en un mensaje. El asistente entiende exactamente de qué le hablo.&quot;</p>
            <div className="proof-author">
              <div className="proof-av">CR</div>
              <div>
                <div className="proof-name">Carlos R.</div>
                <div className="proof-role">Arquitecto BIM &middot; Estudio Propio</div>
              </div>
            </div>
          </div>
          <div className="proof-card">
            <div className="proof-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <p className="proof-text">&quot;Nuestro equipo lo usa a diario. La calidad de los recursos es otra categoría — nada que ver con lo que encuentras gratis o en catálogos genéricos.&quot;</p>
            <div className="proof-author">
              <div className="proof-av">ML</div>
              <div>
                <div className="proof-name">María L.</div>
                <div className="proof-role">Directora de Diseño &middot; Constructora</div>
              </div>
            </div>
          </div>
          <div className="proof-card">
            <div className="proof-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <p className="proof-text">&quot;Como estudiante no tenía acceso a recursos premium. ArchVault me pone al nivel de los profesionales sin tener que navegar veinte páginas distintas.&quot;</p>
            <div className="proof-author">
              <div className="proof-av">DS</div>
              <div>
                <div className="proof-name">Diego S.</div>
                <div className="proof-role">Estudiante &middot; Arquitectura 5to año</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta">
        <h2 className="cta-h">Tu próximo recurso está<br />a <em>un mensaje</em> de distancia</h2>
        <p className="cta-p">Sin abrir plataformas. Sin leer fichas técnicas. Sin descargas que no sirven. Solo escribe lo que necesitas.</p>
        <div className="cta-btns">
          <Link href="/chat" className="btn-gold">Probar el asistente ahora <span style={{marginLeft: "8px"}}>&rarr;</span></Link>
          <a href="#how" className="btn-ghost-w">Ver cómo funciona</a>
        </div>
        <p className="cta-note">Gratis para comenzar &middot; Sin tarjeta de crédito</p>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="foot-logo" style={{display: 'flex', alignItems: 'center'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '8px'}}>
            <rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
            <rect x="10" y="10" width="10" height="10" stroke="var(--accent-gold)" strokeWidth="2.5" />
          </svg>
          Asistente de Recursos AEC
        </div>
        <div className="foot-copy">&copy; {new Date().getFullYear()} Asistente de Recursos AEC — Recursos premium para la industria</div>
      </footer>
    </>
  );
}
