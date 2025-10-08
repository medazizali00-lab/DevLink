import type { Metadata } from "next";
// Assurez-vous d'avoir installé 'geist' et 'next-themes'
// npm install next-themes @geist-ui/core (si vous utilisez le package officiel Geist)
// Le code ci-dessous suppose que vous utilisez la méthode d'intégration next/font pour Geist.
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import "./globals.css";

// --- 1. METADATA (Une seule déclaration) ---
export const metadata: Metadata = {
  title: "DevLink | Votre Profil Tech", // Mettez à jour le titre
  description: "Profil développé avec Next.js, Tailwind, et shadcn/ui.",
};

// --- 2. FONCTION ROOTLAYOUT FUSIONNÉE (Une seule exportation par défaut) ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Langue en français, nécessaire pour Next.js/Tailwind
    <html lang="fr" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* Intégration du ThemeProvider pour le Dark Mode */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light" 
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}