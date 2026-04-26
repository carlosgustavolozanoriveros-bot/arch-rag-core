import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <>

      {/* HERO */}
      <section className="hero">
        <div className="hero-l">
          <div className="pill"><span className="pill-dot"></span>Asistente de Recursos AEC</div>
          <h1 className="hero-h">Deja de buscar.<br/><em>Solo pídelo.</em><br/>Descárgalo.</h1>
          <div className="hero-subtitle">El asistente que habla el idioma de la arquitectura, la ingeniería y la construcción.</div>
          <p className="hero-p">Escribe lo que necesitas — recursos, bloques, librerías, cursos — y lo tienes listo en <strong>segundos</strong>. Sin navegar plataformas de pago. Sin leer fichas técnicas. Solo escribe y descarga.</p>
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
      </section>

      {/* PAIN */}
      <section className="sec dark" id="pain">
        <div className="sec-head">
          <div className="overline">El problema real</div>
          <h2 className="sec-title">El flujo de trabajo roto que <em>todos conocen</em><br/>pero nadie había resuelto</h2>
          <p className="sec-desc">Cada hora buscando en Turbosquid, Evermotion o CGAxis es una hora que no estás diseñando. Cuatro problemas, una sola solución.</p>
        </div>
        <div className="pain-grid">
          <div className="pain-card">
            <span className="pain-icon">&#x23F1;</span>
            <div className="pain-num">01</div>
            <div className="pain-title">Horas perdidas en plataformas de pago</div>
            <p className="pain-desc">Entras a Turbosquid, Evermotion, CGAxis… lees fichas, comparas previews, filtras versiones. Treinta minutos después, aún no descargaste nada útil.</p>
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
            <p className="pain-desc">Escribes &quot;familia Revit puerta corredera aluminio LOD 300&quot; y recibes resultados genéricos. Las plataformas no hablan el idioma técnico del proyecto.</p>
          </div>
          <div className="pain-card">
            <span className="pain-icon">&#x1F4C1;</span>
            <div className="pain-num">04</div>
            <div className="pain-title">El recurso que usaste, perdido para siempre</div>
            <p className="pain-desc">Ese bloque perfecto que usaste hace dos meses está en alguna carpeta que ya no encuentras. Vuelves a buscarlo desde cero, como si nunca lo hubieras comprado.</p>
          </div>
        </div>
      </section>

      {/* VERSUS */}
      <section className="sec light" id="versus">
        <div className="sec-head">
          <div className="overline">La diferencia</div>
          <h2 className="sec-title">Antes y <em>después</em> del Asistente</h2>
          <p className="sec-desc">El mismo profesional, el mismo proyecto — una experiencia completamente distinta.</p>
        </div>
        <div className="versus-grid">
          <div className="vs-card bad">
            <div className="vs-card-head"><div className="vs-badge bad">Sin el asistente</div></div>
            <ul className="vs-list">
              <li>Abres 4 plataformas distintas y comparas resultados manualmente</li>
              <li>Lees fichas técnicas completas para saber si el archivo sirve</li>
              <li>Descargas, abres, verificas compatibilidad — y muchas veces vuelves atrás</li>
              <li>Guardas en alguna carpeta sin nombre que no vas a encontrar luego</li>
              <li>La próxima vez, empiezas el mismo proceso desde cero</li>
            </ul>
          </div>
          <div className="vs-card good">
            <div className="vs-card-head"><div className="vs-badge good">Con el Asistente</div></div>
            <ul className="vs-list">
              <li>Escribes lo que necesitas como se lo dirías a un colega</li>
              <li>El asistente entiende el contexto técnico y filtra por ti en milisegundos</li>
              <li>Recibes las 2 mejores opciones curadas — sin ruido, sin scroll infinito</li>
              <li>Revisas, compras y descargas sin salir del chat</li>
              <li>Historial organizado automáticamente — disponible en seis meses igual que hoy</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="sec white" id="how">
        <div className="sec-head">
          <div className="overline">Cómo funciona</div>
          <h2 className="sec-title">De la idea al archivo listo<br/><em>en un solo chat</em></h2>
          <p className="sec-desc">Sin formularios, sin filtros, sin categorías. Solo describes lo que necesitas y el asistente hace el resto.</p>
        </div>
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
            <div className="step-t">Solo las mejores opciones</div>
            <p className="step-d">Sin resultados irrelevantes. Solo las 2 o 3 opciones que cumplen exactamente con tu especificación de programa, formato y calidad.</p>
          </div>
          <div className="step">
            <div className="step-n">04</div>
            <div className="step-t">Descarga dentro del chat</div>
            <p className="step-d">Revisa, compra y descarga el archivo final sin abandonar la conversación. Listo para insertar en tu software al instante.</p>
          </div>
        </div>
      </section>

      {/* SOFTWARE */}
      <section className="sec dark" id="software">
        <div className="sec-head">
          <div className="overline">Ecosistema compatible</div>
          <h2 className="sec-title">Recursos y cursos para los programas que<br/><em>los mejores profesionales usan</em></h2>
          <p className="sec-desc">Desde modelado BIM hasta render fotorrealista — cubrimos los flujos de trabajo reales de la industria AEC.</p>
        </div>
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
      <section className="sec light" id="features">
        <div className="sec-head">
          <div className="overline">Plataforma completa</div>
          <h2 className="sec-title">Todo lo que necesitas,<br/><em>integrado en un chat</em></h2>
          <p className="sec-desc">Cada función diseñada para eliminar una fricción real del flujo de trabajo profesional.</p>
        </div>
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
            <div className="feat-t">Cursos especializados incluidos</div>
            <p className="feat-d">Además de recursos, accede a formación especializada en los programas líderes del sector. Aprende y descarga desde el mismo lugar.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">&#x1F514;</div>
            <div className="feat-t">Alertas de nuevos recursos</div>
            <p className="feat-d">Cada vez que se sube una colección nueva al catálogo, recibes una notificación. Siempre al día con las herramientas más actuales del mercado.</p>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="sec white" id="proof">
        <div className="sec-head">
          <div className="overline">Casos reales</div>
          <h2 className="sec-title">Profesionales reales,<br/><em>tiempo real recuperado</em></h2>
          <p className="sec-desc">Arquitectos, ingenieros y estudiantes que ya cambiaron su flujo de trabajo.</p>
        </div>
        <div className="proof-grid">
          <div className="proof-card">
            <div className="proof-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <p className="proof-text">&quot;Lo que antes me tomaba 40 minutos buscando en tres plataformas distintas ahora lo resuelvo en un mensaje. El asistente entiende exactamente de qué le hablo.&quot;</p>
            <div className="proof-author">
              <div className="proof-av">CR</div>
              <div><div className="proof-name">Carlos R.</div><div className="proof-role">Arquitecto BIM &middot; Estudio Propio</div></div>
            </div>
          </div>
          <div className="proof-card">
            <div className="proof-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <p className="proof-text">&quot;Nuestro equipo lo usa a diario. La calidad de los recursos es otra categoría — nada que ver con lo que encuentras en catálogos genéricos de pago.&quot;</p>
            <div className="proof-author">
              <div className="proof-av">ML</div>
              <div><div className="proof-name">María L.</div><div className="proof-role">Directora de Diseño &middot; Constructora</div></div>
            </div>
          </div>
          <div className="proof-card">
            <div className="proof-stars">&#x2605;&#x2605;&#x2605;&#x2605;&#x2605;</div>
            <p className="proof-text">&quot;Como estudiante no tenía acceso a recursos de nivel profesional. El asistente me pone al nivel de los mejores sin navegar veinte plataformas distintas.&quot;</p>
            <div className="proof-author">
              <div className="proof-av">DS</div>
              <div><div className="proof-name">Diego S.</div><div className="proof-role">Estudiante &middot; Arquitectura 5to año</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta">
        <div className="sec-head" style={{position:"relative"}}>
          <div className="overline" style={{color:"var(--accent-gold)"}}>Empieza hoy</div>
          <h2 className="sec-title" style={{color:"var(--text-primary)"}}>Tu próximo recurso está<br/>a <em>un mensaje</em> de distancia</h2>
          <p className="sec-desc" style={{color:"var(--text-secondary)"}}>Sin abrir plataformas. Sin leer fichas. Solo escribe lo que necesitas.</p>
        </div>
        <div className="cta-btns">
          <Link href="/chat" className="btn-gold">Probar el asistente ahora &rarr;</Link>
          <button className="btn-ghost-w">Ver cómo funciona</button>
        </div>
        <p className="cta-note">Gratis para comenzar &middot; Sin tarjeta de crédito &middot; Listo en segundos</p>
      </section>

      <footer className="landing-footer" style={{ justifyContent: "center" }}>
        <div className="foot-copy">&copy; {new Date().getFullYear()} Asistente de Recursos AEC — Recursos premium para la industria</div>
      </footer>
    </>
  );
}
