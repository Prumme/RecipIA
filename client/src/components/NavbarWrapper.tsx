"use client";

import Navbar from "./Navbar";

export default function NavbarWrapper() {
  // TODO: Implémenter la logique d'authentification réelle
  const isAuthenticated = false;
  const handleLogout = () => {
    // TODO: Implémenter la logique de déconnexion
    console.log("Déconnexion");
  };

  return <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />;
}
