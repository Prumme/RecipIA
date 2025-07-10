"use client";

import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from "../types/user.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Échec de la connexion");
    }

    const data = await response.json();

    // Stocker le token dans localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return { user: data.user, token: data.token };
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Échec de l'inscription");
    }

    const data = await response.json();

    // Stocker le token dans localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return { user: data.user, token: data.token };
  },

  async getCurrentUser(): Promise<User> {
    const token = this.getToken();

    if (!token) {
      throw new Error("Aucun token d'authentification trouvé");
    }

    const response = await fetch(`${API_URL}user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Impossible de récupérer l'utilisateur");
    }

    return await response.json();
  },

  logout(): void {
    localStorage.removeItem("token");
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
