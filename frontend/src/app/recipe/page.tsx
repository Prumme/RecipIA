"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function RecipePage() {
  return (
    <ProtectedRoute>
      <div>
        {/* Votre contenu de page ici */}
        <h1>Mes Recettes</h1>
      </div>
    </ProtectedRoute>
  );
}
