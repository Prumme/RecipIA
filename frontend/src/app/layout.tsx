import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecipIA - Vos recettes intelligentes",
  description:
    "Application de gestion de recettes avec intelligence artificielle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: Implémenter la logique d'authentification réelle
  const isAuthenticated = false;
  const handleLogout = () => {
    // TODO: Implémenter la logique de déconnexion
    console.log("Déconnexion");
  };

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <NavbarWrapper />
        <main className="w-screen h-screen absolute top-0">{children}</main>
      </body>
    </html>
  );
}
