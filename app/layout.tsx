import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Asistente de Recursos AEC',
  description: 'Tu consultor especializado en recursos BIM. Encuentra familias, plantillas y modelos de Revit para arquitectura, ingeniería y construcción.',
  keywords: 'BIM, Revit, familias Revit, arquitectura, ingeniería, construcción, AEC, recursos BIM, plantillas Revit',
  openGraph: {
    title: 'Asistente de Recursos AEC',
    description: 'Consultor IA especializado en recursos BIM para Revit. +23 packs profesionales de familias paramátricas.',
    type: 'website',
  },
  metadataBase: new URL('https://asistenteaec.com'),
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
