"use client";

import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "../types/user.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Échec de la connexion");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Échec de l'inscription");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
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
