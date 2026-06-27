import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { config } from "@/lib/config";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: config.institut.nom,
  description: `Bienvenue à ${config.institut.nom} — ${config.institut.adresse}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Couleurs dynamiques issues des variables d'environnement */}
        <style>{`
          :root {
            --color-primary: ${config.branding.couleurPrincipale};
            --color-secondary: ${config.branding.couleurSecondaire};
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
