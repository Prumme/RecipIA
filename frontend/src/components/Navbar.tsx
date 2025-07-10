"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, Book, ChefHat, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-gray-600"
            >
              <ChefHat className="h-8 w-8" />
              <span>RecipIA</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link
                href="/recipe/create"
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                  pathname === "/recipe/create"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Plus className="h-5 w-5" />
                <span>Create Recipe</span>
              </Link>
            )}

            {isAuthenticated && (
              <Link
                href="/mes-recettes"
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium ${
                  pathname === "/mes-recettes"
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Book className="h-5 w-5" />
                <span>My Recipes</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-colors duration-200"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
