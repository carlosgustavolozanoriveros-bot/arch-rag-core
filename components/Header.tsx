'use client';

import { useTheme } from './ThemeProvider';

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">A</div>
        <div>
          <div className="header-title">AEC Expert</div>
          <div className="header-subtitle">Asistente de Activos BIM</div>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={toggle}
          aria-label="Cambiar tema"
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
