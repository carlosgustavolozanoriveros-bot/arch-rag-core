import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'AEC Expert — Asistente de Activos BIM para Revit',
  description: 'Tu consultor especializado en recursos BIM. Encuentra familias, plantillas y modelos de Revit para arquitectura, ingeniería y construcción. Compra individual $8 USD o PRO $20/mes.',
  keywords: 'BIM, Revit, familias Revit, arquitectura, ingeniería, construcción, AEC, recursos BIM, plantillas Revit',
  openGraph: {
    title: 'AEC Expert — Asistente de Activos BIM para Revit',
    description: 'Consultor IA especializado en recursos BIM para Revit. +23 packs profesionales de familias paramátricas.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
