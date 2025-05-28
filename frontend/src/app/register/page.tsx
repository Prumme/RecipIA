"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register({ email, password, username });
      router.push("/recipe"); // Redirection vers la page des recettes après inscription réussie
    } catch (error: any) {
      setError(
        error.message ||
          "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
      );
      console.error("Erreur d'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full m-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                connectez-vous à votre compte
              </Link>
            </p>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md text-sm">
              {error}
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Nom d'utilisateur
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary/90 focus:border-primary/90 focus:z-10 sm:text-sm"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary/90 focus:border-primary/90 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary/90 focus:border-primary/90 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover transition duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
