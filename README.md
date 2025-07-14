# RecipIA 🍳
Projet ESGI - Airtable - 5IW3

FAUCHERY Robin - PRUDHOMME Aurelien - GODEFROY Axel - DUPUIS Ilyam

Une application web moderne de génération et gestion de recettes alimentée par l'intelligence artificielle.

## 📖 À propos

RecipIA est une plateforme innovante qui permet aux utilisateurs de créer, découvrir et partager des recettes de cuisine. Grâce à l'intégration de l'IA (Google Gemini), l'application peut générer automatiquement des recettes personnalisées basées sur les ingrédients disponibles, les préférences alimentaires et les restrictions diététiques.

## ✨ Fonctionnalités principales

- 🤖 **Génération de recettes par IA** : Création automatique de recettes basées sur vos ingrédients et préférences
- 🔍 **Recherche avancée** : Trouvez des recettes par nom, ingrédients
- 👨‍🍳 **Gestion des profils** : Création de compte, authentification sécurisée
- 📱 **Interface moderne** : Design responsive avec Tailwind CSS et composants Radix UI
- 🏷️ **Gestion des intolérances** : Filtrage des recettes selon les allergies et restrictions
- 📸 **Images automatiques** : Recherche d'images pour illustrer les recettes
- 🔒 **Recettes privées/publiques** : Contrôle de la visibilité de vos créations

## 🛠️ Technologies utilisées

### Backend
- **Runtime** : Node.js avec TypeScript
- **Framework** : Express.js
- **Base de données** : Airtable
- **IA** : Google Gemini API
- **Authentification** : JWT + Express Sessions
- **Validation** : Zod
- **Sécurité** : bcrypt, CORS
- **Recherche d'images** : Brave Search API

### Frontend
- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4
- **Composants UI** : Radix UI
- **Icônes** : Lucide React
- **Outils** : ESLint, Turbopack

## 🚀 Installation et démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Comptes API pour :
  - Airtable
  - Google Gemini
  - Brave Search

### Configuration des variables d'environnement

#### Backend (.env)
Créez un fichier `.env` dans le dossier `backend/` :

```env
# Airtable Configuration
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Authentication
APP_SECRET=your_jwt_secret_key

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key
BRAVE_SEARCH_API_KEY=your_brave_search_api_key

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env.local)
Créez un fichier `.env.local` dans le dossier `frontend/` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/
```

### Installation des dépendances

```bash
# Installation des dépendances du backend
cd backend
npm install

# Installation des dépendances du frontend
cd ../frontend
npm install
```

### Démarrage du projet

#### Option 1 : Démarrage manuel

```bash
# Terminal 1 - Backend (port 3000)
cd backend
npm run start

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

## 🔧 Architecture du Backend

### Structure des dossiers

```
backend/src/
├── ai/                     # Services d'intelligence artificielle
│   ├── interfaces/         # Interfaces pour les services IA
│   ├── providers/          # Implémentations des providers (Gemini)
│   └── services/           # Services métier IA
├── airtable/              # Couche d'accès aux données Airtable
├── entities/              # Modèles de données TypeScript
├── events/                # Système d'événements (cache clearing)
├── express/               # Configuration Express et routes
│   ├── requests/          # Validation des requêtes (Zod schemas)
│   └── utils/             # Utilitaires (JWT, auth)
├── repositories/          # Interfaces des repositories
├── services/              # Services métier
├── types/                 # Types TypeScript partagés
└── utils/                 # Utilitaires généraux
```

### Structure de la base de données Airtable

RecipIA utilise **Airtable** comme base de données avec 4 tables principales reliées entre elles :

#### 📋 **Table Users**
- **Username** : Nom d'utilisateur unique
- **Email** : Adresse email unique (string, format email)
- **Password** : Mot de passe haché avec bcrypt

#### 🥘 **Table Recipes**
- **Name** : Nom de la recette
- **Slug** : Identifiant URL unique (string, généré automatiquement)
- **Instructions** : Étapes de préparation (text, format markdown)
- **Servings** : Nombre de portions (number, entier positif)
- **DishType** : Type de plat (`Appetizer`, `Main Course`, `Dessert`, `Snack`)
- **Ingredients** : Relations vers les ingrédients (array of IDs)
- **IngredientsName** : Noms des ingrédients (array of strings, calculé)
- **PrepTime** : Temps de préparation en minutes (number)
- **Difficulty** : Difficulté (`Easy`, `Medium`, `Hard`)
- **Tags** : Étiquettes de la recette (array: `Vegan`, `Gluten Free`, etc.)
- **CreatedAt** : Date de création (date, format ISO)
- **Intolerances** : Allergènes présents (array of strings, calculé)
- **Image** : Images de la recette (array d'attachments)
- **Compositions** : Relations vers les compositions (array of IDs)
- **IngredientsQuantity** : Quantités par ingrédient (array of numbers, calculé)
- **IngredientsUnit** : Unités de mesure (array of strings, calculé)
- **NutritionalValues** : Valeurs nutritionnelles JSON (array of strings, calculé)
- **Private** : Visibilité de la recette (boolean, défaut false)
- **Author** : Relation vers l'utilisateur créateur (ID)
- **AuthorName** : Nom de l'auteur (string, calculé)
- **IngredientsImages** : Images des ingrédients (array, calculé)

#### 🥬 **Table Ingredients**
- **Name** : Nom de l'ingrédient
- **Slug** : Identifiant unique (string, format kebab-case)
- **Category** : Catégorie d'ingrédient (enum: `Fruits`, `Vegetables`, `Meat & Poultry`, etc.)
- **NutritionalValues** : Valeurs nutritionnelles (JSON string) :
  ```json
  {
    "calories": 18,
    "protein": 0.9,
    "carbohydrates": 3.9,
    "fat": 0.2,
    "vitamins": {"Vitamin C": 12.5, "Vitamin K": 7.2},
    "minerals": {"Potassium": 215.7}
  }
  ```
- **Intolerances** : Allergènes associés (array: `Gluten`, `Lactose`, `Nuts`, etc.)
- **Image** : Image de l'ingrédient (array d'attachments)

#### 🔗 **Table Compositions**
Table de liaison entre Recipes et Ingredients avec les quantités :
- **Identity** : Identifiant unique (number, auto-increment)
- **Recipe** : Relation vers la recette (ID)
- **Ingredient** : Relation vers l'ingrédient (ID)
- **Quantity** : Quantité utilisée (number, positif)
- **Unit** : Unité de mesure (string: `g`, `ml`, `item`, `cup`, `tablespoon`, `teaspoon`)

#### 🔄 **Relations entre tables**
- **Users** ← (1:n) → **Recipes** : Un utilisateur peut créer plusieurs recettes
- **Recipes** ← (n:m) → **Ingredients** via **Compositions** : Une recette contient plusieurs ingrédients, un ingrédient peut être dans plusieurs recettes
- **Compositions** relie Recipes et Ingredients avec les quantités précises

#### 📊 **Champs calculés automatiquement**
- **IngredientsName, IngredientsQuantity, IngredientsUnit** : Dénormalisés depuis Compositions
- **Intolerances** : Agrégé depuis les ingrédients utilisés
- **NutritionalValues** : Calculé selon les compositions et quantités
- **AuthorName** : Récupéré depuis la relation User

### Composants clés

#### 1. Authentification
- **JWT** : Tokens d'authentification avec expiration de 7 jours
- **Sessions** : Stockage des sessions dans des fichiers locaux
- **Middleware** : Protection des routes sensibles
- **Chiffrement** : Mots de passe hachés avec bcrypt

#### 2. Services IA
- **AIRecipeService** : Interface pour la génération de recettes
- **GeminiProvider** : Intégration avec l'API Google Gemini
- **RecipeGenerationService** : Orchestration de la génération complète

#### 3. Repositories Airtable
- **AirtableUserRepository** : Gestion des utilisateurs
- **AirtableRecipeRepository** : CRUD des recettes
- **AirtableIngredientRepository** : Gestion des ingrédients
- **AirtableCompositionRepository** : Relations ingrédients-recettes

#### 4. Système de cache
- **EventObserver** : Pattern Observer pour invalidation du cache
- **ClearCacheEvent** : Événement de nettoyage du cache
- Cache automatique des requêtes Airtable pour optimiser les performances

### Routes API principales

```
POST   /login                          # Connexion utilisateur
POST   /register                       # Inscription utilisateur
GET    /user                          # Profil utilisateur (protégé)

GET    /recipes                       # Liste des recettes (avec pagination/recherche)
GET    /recipes/author/:username      # Recettes d'un auteur spécifique
GET    /recipes/:slug                 # Détails d'une recette
POST   /recipes                       # Création d'une recette
PUT    /recipes/:slug/privacy         # Modification de la visibilité

GET    /ingredients                   # Liste des ingrédients
GET    /ingredients/:name             # Détails d'un ingrédient
POST   /ingredients                   # Création d'un ingrédient

POST   /compositions                  # Création d'une composition (ingrédient + recette)

POST   /generate-recipe              # Génération IA d'une recette (protégé)
POST   /reset-cache                  # Nettoyage du cache (protégé)
```

### Validation des données
Toutes les entrées API sont validées avec **Zod** :
- `loginRequest` : Validation email + mot de passe
- `registerRequest` : Validation inscription (username, email, password)
- `generateRecipeRequest` : Validation des paramètres de génération IA
- `ingredientRequest` : Validation des données d'ingrédients

### Gestion des erreurs
- Middleware de gestion d'erreurs centralisé
- Logs détaillés pour le debugging
- Responses HTTP standardisées
- Validation et sanitisation des entrées

## 📝 Utilisation

1. **Inscription/Connexion** : Créez un compte ou connectez-vous
2. **Génération de recette** : Créez vos propres recettes en sélectionnant vos ingrédients, type de plat et restrictions
3. **Découverte et recherche** : Parcourez les recettes publiques d'autres utilisateurs
