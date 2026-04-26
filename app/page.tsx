import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <>

      {/* HERO */}
      <section className="hero">
        {/* Chat Izquierdo (Desktop) */}
        <div className="hero-chat-col left desktop-only">
          <div className="chat-msg-w d1"><div className="chat-msg user">Necesito familias de puertas cortafuego en Revit.</div></div>
          <div className="chat-msg-w d2"><div className="chat-msg bot">Encontré 3 opciones. ¿De acero o madera?</div></div>
          <div className="chat-msg-w d3"><div className="chat-msg user">Acero, resistencia 90 min.</div></div>
          <div className="chat-msg-w d4"><div className="chat-msg bot">Filtrando opciones metálicas RF-90...</div></div>
          <div className="chat-msg-w d5"><div className="chat-msg user">Que incluya parámetros de certificación.</div></div>
          <div className="chat-msg-w d6">
            <div className="chat-msg bot">
              Aquí tienes. Familia paramétrica lista:
              <div className="chat-result-card">
                <div className="chat-card-img"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 22V2h12l4 4v16H4z"/><path d="M14 2v4h4"/><path d="M9 14h6"/><path d="M9 18h6"/></svg></div>
                <div className="chat-card-info">
                  <div className="chat-card-text">
                    <div className="chat-card-title">Puerta CF-90 Acero</div>
                    <div className="chat-card-tag">Revit 2024 • 1.2MB</div>
                  </div>
                  <div className="chat-card-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Derecho */}
        <div className="hero-chat-col right">
          <div className="chat-msg-w r1"><div className="chat-msg user">Busco bloque AutoCAD de rampa vehicular.</div></div>
          <div className="chat-msg-w r2"><div className="chat-msg bot">¿Qué pendiente normativa necesitas cumplir?</div></div>
          <div className="chat-msg-w r3"><div className="chat-msg user">Máximo 15%.</div></div>
          <div className="chat-msg-w r4"><div className="chat-msg bot">Ajustando bloque dinámico al 15%...</div></div>
          <div className="chat-msg-w r5"><div className="chat-msg user">Añádele señalización de pintura.</div></div>
          <div className="chat-msg-w r6">
            <div className="chat-msg bot">
              Listo. Bloque actualizado con flechas:
              <div className="chat-result-card">
                <div className="chat-card-img"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M3 15h6"/><path d="M3 9h12"/><path d="M3 21l18-18"/></svg></div>
                <div className="chat-card-info">
                  <div className="chat-card-text">
                    <div className="chat-card-title">Rampa 15% Dyn</div>
                    <div className="chat-card-tag">AutoCAD • 350KB</div>
                  </div>
                  <div className="chat-card-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-l">
          <div className="pill"><span className="pill-dot"></span>Asistente de Recursos AEC</div>
          <h1 className="hero-h">Deja de buscar.<br/><em>Solo pídelo.</em><br/>Descárgalo.</h1>
          <div className="hero-subtitle">El asistente que habla el idioma de la arquitectura, la ingeniería y la construcción.</div>
          <p className="hero-p">Escribe lo que necesitas — recursos, bloques, librerías, cursos — y lo tienes listo en <strong>segundos</strong>. Sin navegar plataformas de pago. Sin leer fichas técnicas. Solo escribe y descarga.</p>

          {/* Chat Izquierdo (En móvil se queda aquí) */}
          <div className="hero-chat-col left mobile-only">
            <div className="chat-msg-w d1"><div className="chat-msg user">Necesito familias de puertas cortafuego en Revit.</div></div>
            <div className="chat-msg-w d2"><div className="chat-msg bot">Encontré 3 opciones. ¿De acero o madera?</div></div>
            <div className="chat-msg-w d3"><div className="chat-msg user">Acero, resistencia 90 min.</div></div>
            <div className="chat-msg-w d4"><div className="chat-msg bot">Filtrando opciones metálicas RF-90...</div></div>
            <div className="chat-msg-w d5"><div className="chat-msg user">Que incluya parámetros de certificación.</div></div>
            <div className="chat-msg-w d6">
              <div className="chat-msg bot">
                Aquí tienes. Familia paramétrica lista:
                <div className="chat-result-card">
                  <div className="chat-card-img"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 22V2h12l4 4v16H4z"/><path d="M14 2v4h4"/><path d="M9 14h6"/><path d="M9 18h6"/></svg></div>
                  <div className="chat-card-info">
                    <div className="chat-card-text">
                      <div className="chat-card-title">Puerta CF-90 Acero</div>
                      <div className="chat-card-tag">Revit 2024 • 1.2MB</div>
                    </div>
                    <div className="chat-card-btn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-cta-row">
            <Link href="/chat" className="btn-gold">
              Probar el asistente gratis
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
            <div className="hero-trust">
              <div className="trust-avatars">
                <div className="trust-av"><Image src="/av1.jpg" alt="Usuario 1" width={26} height={26} /></div>
                <div className="trust-av"><Image src="/av2.jpg" alt="Usuario 2" width={26} height={26} /></div>
                <div className="trust-av"><Image src="/av3.jpg" alt="Usuario 3" width={26} height={26} /></div>
                <div className="trust-av">+</div>
              </div>
              Profesionales y estudios ya lo usan a diario
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
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
            <div className="pain-num">01</div>
            <span className="pain-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
            <div className="pain-title">Horas perdidas en plataformas de pago</div>
            <p className="pain-desc">Entras a Turbosquid, Evermotion… lees fichas, comparas previews, filtras versiones. <strong>Treinta minutos después</strong>, aún no descargaste nada útil.</p>
          </div>
          <div className="pain-card">
            <div className="pain-num">02</div>
            <span className="pain-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg></span>
            <div className="pain-title">Recursos que no cumplen lo que prometen</div>
            <p className="pain-desc">Pagas, descargas, abres el archivo — y <strong>la geometría está mal</strong>, las texturas no vienen o la versión del software no coincide. De vuelta a cero.</p>
          </div>
          <div className="pain-card">
            <div className="pain-num">03</div>
            <span className="pain-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></span>
            <div className="pain-title">Buscadores que no entienden tu contexto</div>
            <p className="pain-desc">Escribes "puerta corredera aluminio LOD 300" y <strong>recibes resultados genéricos</strong>. Las plataformas no hablan el idioma técnico del proyecto.</p>
          </div>
          <div className="pain-card">
            <div className="pain-num">04</div>
            <span className="pain-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg></span>
            <div className="pain-title">El recurso que usaste, perdido para siempre</div>
            <p className="pain-desc">Ese bloque perfecto que usaste hace dos meses <strong>está en alguna carpeta que ya no encuentras</strong>. Vuelves a buscarlo desde cero.</p>
          </div>
        </div>
      </section>

      {/* VERSUS */}
      <section className="sec light" id="versus">
        <div className="sec-head">
          <div className="overline">La diferencia</div>
          <h2 className="sec-title">Antes y <em>después</em> del Asistente</h2>
          <p className="sec-desc">El mismo profesional, el mismo proyecto —<br/> una experiencia completamente distinta.</p>
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
              <li><strong>Escribes lo que necesitas</strong> como se lo dirías a un colega</li>
              <li>El asistente entiende el contexto técnico y filtra por ti en <strong>milisegundos</strong></li>
              <li>Recibes los 5 resultados con mayor <strong>probabilidad de exactitud</strong> — sin ruido, sin scroll infinito</li>
              <li>Revisas, compras y descargas <strong>sin salir del chat</strong></li>
              <li>Historial <strong>organizado automáticamente</strong> — disponible en seis meses igual que hoy</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="sec dark" id="how">
        <div className="sec-head">
          <div className="overline">Cómo funciona</div>
          <h2 className="sec-title">De la idea al archivo listo<br/><em>en un solo chat</em></h2>
          <p className="sec-desc">Sin formularios, sin filtros, sin categorías. Solo describes lo que necesitas y el asistente hace el resto.</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-n">
              <span className="step-num">01</span>
              <svg className="step-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div className="step-t">Escribe en lenguaje natural</div>
            <p className="step-d">Sin palabras clave exactas. El asistente comprende terminología técnica real de arquitectura, estructuras, render y BIM.</p>
          </div>
          <div className="step">
            <div className="step-n">
              <span className="step-num">02</span>
              <svg className="step-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
            </div>
            <div className="step-t">El asistente escanea y filtra</div>
            <p className="step-d">Analiza el catálogo completo de recursos y cursos premium en milisegundos. Descarta todo lo que no encaja con tu petición.</p>
          </div>
          <div className="step">
            <div className="step-n">
              <span className="step-num">03</span>
              <svg className="step-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div className="step-t">Ordenado por probabilidad</div>
            <p className="step-d">Sin resultados irrelevantes. El sistema te muestra los 5 resultados con el mayor porcentaje de probabilidad de coincidir con tu especificación.</p>
          </div>
          <div className="step">
            <div className="step-n">
              <span className="step-num">04</span>
              <svg className="step-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </div>
            <div className="step-t">Descarga dentro del chat</div>
            <p className="step-d">Revisa, compra y descarga el archivo final sin abandonar la conversación. Listo para insertar en tu software al instante.</p>
          </div>
        </div>
      </section>

      {/* SOFTWARE */}
      <section className="sec light" id="software">
        <div className="sec-head">
          <div className="overline">Ecosistema compatible</div>
          <h2 className="sec-title">Recursos y cursos para los programas que<br/><em>los mejores profesionales usan</em></h2>
          <p className="sec-desc">Desde modelado BIM hasta render fotorrealista —<br/> cubrimos los flujos de trabajo reales de la industria AEC.</p>
        </div>
        <div className="sw-marquee-wrapper">
          <div className="sw-marquee-track">
            <div className="sw-chip" style={{ "--brand": "#0a9cf1" } as React.CSSProperties}><span className="sw-chip-dot"></span>Revit</div>
            <div className="sw-chip" style={{ "--brand": "#ff2a2a" } as React.CSSProperties}><span className="sw-chip-dot"></span>AutoCAD</div>
            <div className="sw-chip" style={{ "--brand": "#005cff" } as React.CSSProperties}><span className="sw-chip-dot"></span>SketchUp</div>
            <div className="sw-chip" style={{ "--brand": "#ffffff" } as React.CSSProperties}><span className="sw-chip-dot"></span>D5 Render</div>
            <div className="sw-chip" style={{ "--brand": "#2ba1df" } as React.CSSProperties}><span className="sw-chip-dot"></span>V-Ray</div>
            <div className="sw-chip" style={{ "--brand": "#00e5ff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Enscape</div>
            <div className="sw-chip" style={{ "--brand": "#8b0000" } as React.CSSProperties}><span className="sw-chip-dot"></span>Rhino</div>
            <div className="sw-chip" style={{ "--brand": "#a2d149" } as React.CSSProperties}><span className="sw-chip-dot"></span>Lumion</div>
            <div className="sw-chip" style={{ "--brand": "#00549f" } as React.CSSProperties}><span className="sw-chip-dot"></span>ArchiCAD</div>
            <div className="sw-chip" style={{ "--brand": "#1f8599" } as React.CSSProperties}><span className="sw-chip-dot"></span>3ds Max</div>
            <div className="sw-chip" style={{ "--brand": "#c4261d" } as React.CSSProperties}><span className="sw-chip-dot"></span>Civil 3D</div>
            
            {/* Duplicado para loop continuo */}
            <div className="sw-chip" style={{ "--brand": "#0a9cf1" } as React.CSSProperties}><span className="sw-chip-dot"></span>Revit</div>
            <div className="sw-chip" style={{ "--brand": "#ff2a2a" } as React.CSSProperties}><span className="sw-chip-dot"></span>AutoCAD</div>
            <div className="sw-chip" style={{ "--brand": "#005cff" } as React.CSSProperties}><span className="sw-chip-dot"></span>SketchUp</div>
            <div className="sw-chip" style={{ "--brand": "#ffffff" } as React.CSSProperties}><span className="sw-chip-dot"></span>D5 Render</div>
            <div className="sw-chip" style={{ "--brand": "#2ba1df" } as React.CSSProperties}><span className="sw-chip-dot"></span>V-Ray</div>
            <div className="sw-chip" style={{ "--brand": "#00e5ff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Enscape</div>
            <div className="sw-chip" style={{ "--brand": "#8b0000" } as React.CSSProperties}><span className="sw-chip-dot"></span>Rhino</div>
            <div className="sw-chip" style={{ "--brand": "#a2d149" } as React.CSSProperties}><span className="sw-chip-dot"></span>Lumion</div>
            <div className="sw-chip" style={{ "--brand": "#00549f" } as React.CSSProperties}><span className="sw-chip-dot"></span>ArchiCAD</div>
            <div className="sw-chip" style={{ "--brand": "#1f8599" } as React.CSSProperties}><span className="sw-chip-dot"></span>3ds Max</div>
            <div className="sw-chip" style={{ "--brand": "#c4261d" } as React.CSSProperties}><span className="sw-chip-dot"></span>Civil 3D</div>
          </div>
          
          <div className="sw-marquee-track reverse">
            <div className="sw-chip" style={{ "--brand": "#308226" } as React.CSSProperties}><span className="sw-chip-dot"></span>Navisworks</div>
            <div className="sw-chip" style={{ "--brand": "#ea7600" } as React.CSSProperties}><span className="sw-chip-dot"></span>Blender</div>
            <div className="sw-chip" style={{ "--brand": "#e25822" } as React.CSSProperties}><span className="sw-chip-dot"></span>Corona</div>
            <div className="sw-chip" style={{ "--brand": "#cc2b28" } as React.CSSProperties}><span className="sw-chip-dot"></span>Dynamo</div>
            <div className="sw-chip" style={{ "--brand": "#31a8ff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Photoshop</div>
            <div className="sw-chip" style={{ "--brand": "#ff9a00" } as React.CSSProperties}><span className="sw-chip-dot"></span>Illustrator</div>
            <div className="sw-chip" style={{ "--brand": "#ffffff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Twinmotion</div>
            <div className="sw-chip" style={{ "--brand": "#ffffff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Unreal Engine</div>
            <div className="sw-chip" style={{ "--brand": "#004b87" } as React.CSSProperties}><span className="sw-chip-dot"></span>ETABS</div>
            <div className="sw-chip" style={{ "--brand": "#0072bc" } as React.CSSProperties}><span className="sw-chip-dot"></span>CYPE</div>

            {/* Duplicado para loop continuo */}
            <div className="sw-chip" style={{ "--brand": "#308226" } as React.CSSProperties}><span className="sw-chip-dot"></span>Navisworks</div>
            <div className="sw-chip" style={{ "--brand": "#ea7600" } as React.CSSProperties}><span className="sw-chip-dot"></span>Blender</div>
            <div className="sw-chip" style={{ "--brand": "#e25822" } as React.CSSProperties}><span className="sw-chip-dot"></span>Corona</div>
            <div className="sw-chip" style={{ "--brand": "#cc2b28" } as React.CSSProperties}><span className="sw-chip-dot"></span>Dynamo</div>
            <div className="sw-chip" style={{ "--brand": "#31a8ff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Photoshop</div>
            <div className="sw-chip" style={{ "--brand": "#ff9a00" } as React.CSSProperties}><span className="sw-chip-dot"></span>Illustrator</div>
            <div className="sw-chip" style={{ "--brand": "#ffffff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Twinmotion</div>
            <div className="sw-chip" style={{ "--brand": "#ffffff" } as React.CSSProperties}><span className="sw-chip-dot"></span>Unreal Engine</div>
            <div className="sw-chip" style={{ "--brand": "#004b87" } as React.CSSProperties}><span className="sw-chip-dot"></span>ETABS</div>
            <div className="sw-chip" style={{ "--brand": "#0072bc" } as React.CSSProperties}><span className="sw-chip-dot"></span>CYPE</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="sec dark" id="features">
        <div className="sec-head">
          <div className="overline">Plataforma completa</div>
          <h2 className="sec-title">Todo lo que necesitas,<br/><em>integrado en un chat</em></h2>
          <p className="sec-desc">Cada función diseñada para eliminar una fricción real del flujo de trabajo profesional.</p>
        </div>
        <div className="feat-grid">
          <div className="feat">
            <div className="feat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
            <div className="feat-t">Historial siempre disponible</div>
            <p className="feat-d">Cada búsqueda queda guardada automáticamente. Retoma cualquier proyecto exactamente donde lo dejaste — sin volver a buscar lo que ya encontraste.</p>
          </div>
          <div className="feat">
            <div className="feat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
            <div className="feat-t">Buzón de solicitudes</div>
            <p className="feat-d">¿No encontraste el recurso exacto? Lo pides directamente y el equipo lo consigue o lo crea. Nunca te quedas sin salida.</p>
          </div>
          <div className="feat">
            <div className="feat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg></div>
            <div className="feat-t">Cursos especializados incluidos</div>
            <p className="feat-d">Además de recursos, accede a formación especializada en los programas líderes del sector. Aprende y descarga desde el mismo lugar.</p>
          </div>
          <div className="feat">
            <div className="feat-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></div>
            <div className="feat-t">Alertas de nuevos recursos</div>
            <p className="feat-d">Cada vez que se sube una colección nueva al catálogo, recibes una notificación. Siempre al día con las herramientas más actuales del mercado.</p>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="sec light" id="proof">
        <div className="sec-head">
          <div className="overline">Casos reales</div>
          <h2 className="sec-title">Profesionales reales,<br/><em>tiempo real recuperado</em></h2>
          <p className="sec-desc">Arquitectos, ingenieros y estudiantes que ya cambiaron su flujo de trabajo.</p>
        </div>
        <div className="proof-marquee-wrapper">
          <div className="proof-marquee-track">
            {/* ORIGINAL SET */}
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Lo que antes me tomaba 40 minutos buscando en tres plataformas distintas ahora lo resuelvo en un mensaje. El asistente entiende exactamente de qué le hablo.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos" className="proof-av" />
                <div><div className="proof-name">Carlos R.</div><div className="proof-role">Arquitecto BIM &middot; Estudio Propio</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Nuestro equipo lo usa a diario. La calidad de los recursos es otra categoría — nada que ver con lo que encuentras en catálogos genéricos de pago.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Maria" className="proof-av" />
                <div><div className="proof-name">María L.</div><div className="proof-role">Directora de Diseño &middot; Constructora</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Como estudiante no tenía acceso a recursos de nivel profesional. El asistente me pone al nivel de los mejores sin navegar veinte plataformas distintas.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Diego" className="proof-av" />
                <div><div className="proof-name">Diego S.</div><div className="proof-role">Estudiante &middot; Arquitectura 5to año</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Conseguir bloques precisos y normativas para ETABS ahorraba horas a la semana. La IA organiza el caos de una forma que no imaginaba.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Elena" className="proof-av" />
                <div><div className="proof-name">Elena G.</div><div className="proof-role">Ingeniera Estructural &middot; Consultora</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Los assets para V-Ray y Corona son espectaculares. Ya no pierdo tiempo configurando materiales, el asistente me da la escena base exacta.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Roberto" className="proof-av" />
                <div><div className="proof-name">Roberto M.</div><div className="proof-role">Visualizador 3D &middot; Freelance</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Encontrar vegetación específica para Lumion era un dolor de cabeza. Ahora solo lo pido por chat y tengo opciones perfectas optimizadas.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Andrea" className="proof-av" />
                <div><div className="proof-name">Andrea V.</div><div className="proof-role">Paisajista &middot; Arquitectura</div></div>
              </div>
            </div>

            {/* DUPLICATE SET FOR SEAMLESS LOOP */}
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Lo que antes me tomaba 40 minutos buscando en tres plataformas distintas ahora lo resuelvo en un mensaje. El asistente entiende exactamente de qué le hablo.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Carlos" className="proof-av" />
                <div><div className="proof-name">Carlos R.</div><div className="proof-role">Arquitecto BIM &middot; Estudio Propio</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Nuestro equipo lo usa a diario. La calidad de los recursos es otra categoría — nada que ver con lo que encuentras en catálogos genéricos de pago.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Maria" className="proof-av" />
                <div><div className="proof-name">María L.</div><div className="proof-role">Directora de Diseño &middot; Constructora</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Como estudiante no tenía acceso a recursos de nivel profesional. El asistente me pone al nivel de los mejores sin navegar veinte plataformas distintas.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="Diego" className="proof-av" />
                <div><div className="proof-name">Diego S.</div><div className="proof-role">Estudiante &middot; Arquitectura 5to año</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Conseguir bloques precisos y normativas para ETABS ahorraba horas a la semana. La IA organiza el caos de una forma que no imaginaba.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Elena" className="proof-av" />
                <div><div className="proof-name">Elena G.</div><div className="proof-role">Ingeniera Estructural &middot; Consultora</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Los assets para V-Ray y Corona son espectaculares. Ya no pierdo tiempo configurando materiales, el asistente me da la escena base exacta.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="Roberto" className="proof-av" />
                <div><div className="proof-name">Roberto M.</div><div className="proof-role">Visualizador 3D &middot; Freelance</div></div>
              </div>
            </div>
            <div className="proof-card">
              <svg className="proof-quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              <div className="proof-stars">{Array(5).fill(0).map((_, i) => (<svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>))}</div>
              <p className="proof-text">&quot;Encontrar vegetación específica para Lumion era un dolor de cabeza. Ahora solo lo pido por chat y tengo opciones perfectas optimizadas.&quot;</p>
              <div className="proof-author">
                <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Andrea" className="proof-av" />
                <div><div className="proof-name">Andrea V.</div><div className="proof-role">Paisajista &middot; Arquitectura</div></div>
              </div>
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
          <Link href="/chat" className="btn-gold">
            Probar el asistente ahora
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
        <div className="cta-note">
          <span className="cta-note-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Gratis para comenzar</span>
          <span className="cta-note-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Sin tarjeta de crédito</span>
          <span className="cta-note-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Listo en segundos</span>
        </div>
      </section>

      <footer className="landing-footer" style={{ justifyContent: "center" }}>
        <div className="foot-copy">&copy; {new Date().getFullYear()} Asistente de Recursos AEC — Recursos premium para la industria</div>
      </footer>
    </>
  );
}
