# Plio — Frontend

Interface web de **Plio**, un gestionnaire de projets et de tâches. Construit avec React 19, Vite 8, et TypeScript.

---

## Stack technique

| Élément | Librairie | Version |
|---------|-----------|---------|
| Framework UI | React | 19 |
| Build tool | Vite | 8 |
| Langage | TypeScript | 6 |
| Styles | Tailwind CSS | 4 |
| Routing | React Router | 7 |
| Requêtes API | TanStack Query | 5 |
| Client HTTP | Axios | 1 |
| État global | Zustand | 5 |
| Formulaires | React Hook Form | 7 |
| Validation | Zod | 3 |
| Icônes | Lucide React | — |
| Notifications | Sonner | — |

---

## Prérequis

- Node.js **18+**
- npm **9+**
- L'API backend Plio déployée (voir le repo `task-manager`)

---

## Installation

```bash
# 1. Cloner le repo
git clone <url-du-repo>
cd task-manager-frontend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
```

Édite `.env` et renseigne l'URL de ton API :

```env
VITE_API_URL=https://ton-api.railway.app/api
```

---

## Démarrer en développement

```bash
npm run dev
```

L'app est accessible sur `http://localhost:5173`.

---

## Build de production

```bash
npm run build
```

Les fichiers sont générés dans le dossier `dist/`.

Pour prévisualiser le build en local :

```bash
npm run preview
```

---

## Déploiement

### Vercel (recommandé)

1. Importe le repo sur [vercel.com](https://vercel.com)
2. Dans les paramètres du projet, ajoute la variable d'environnement :
   ```
   VITE_API_URL = https://ton-api.railway.app/api
   ```
3. Framework preset : **Vite**
4. Build command : `npm run build`
5. Output directory : `dist`

### Netlify

1. Importe le repo sur [netlify.com](https://netlify.com)
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Ajoute la variable d'environnement `VITE_API_URL` dans Site settings → Environment variables

### Railway

1. Crée un nouveau service depuis le repo GitHub
2. Ajoute la variable `VITE_API_URL`
3. Start command : `npm run preview -- --host 0.0.0.0 --port $PORT`

### Important — CORS

L'API Laravel doit autoriser le domaine de ton frontend. Dans le `.env` de l'API :

```env
SANCTUM_STATEFUL_DOMAINS=ton-frontend.vercel.app
FRONTEND_URL=https://ton-frontend.vercel.app
```

---

## Structure du projet

```
src/
├── api/                   Fonctions d'appel à l'API
│   ├── auth.ts            register, login, logout
│   ├── projects.ts        CRUD projets
│   └── tasks.ts           CRUD tâches
│
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx   Guards de navigation
│   ├── layout/
│   │   ├── AppLayout.tsx        Layout avec sidebar
│   │   ├── Sidebar.tsx          Sidebar dégradée Plio
│   │   └── Navbar.tsx           (legacy, remplacé par Sidebar)
│   ├── projects/
│   │   ├── ProjectCard.tsx      Carte projet dans la grille
│   │   └── ProjectForm.tsx      Formulaire création/édition
│   ├── tasks/
│   │   ├── TaskCard.tsx         Carte tâche avec actions
│   │   └── TaskForm.tsx         Formulaire création/édition
│   └── ui/
│       ├── Button.tsx           Bouton avec variantes
│       ├── Input.tsx            Input avec label et erreur
│       ├── Modal.tsx            Modale accessible
│       └── Badge.tsx            Badge de statut
│
├── lib/
│   ├── axios.ts           Instance Axios + intercepteurs
│   └── utils.ts           cn(), formatDate(), statusConfig()
│
├── pages/
│   ├── Login.tsx          Page de connexion (split screen)
│   ├── Register.tsx       Page d'inscription (split screen)
│   ├── Dashboard.tsx      Liste des projets paginée
│   └── ProjectDetail.tsx  Détail projet + tâches + filtres
│
├── store/
│   └── authStore.ts       Store Zustand (user + token)
│
├── types/
│   └── index.ts           Types TypeScript partagés
│
├── App.tsx                Routing principal
├── main.tsx               Point d'entrée
└── index.css              Styles globaux + thème Tailwind
```

---

## Pages et fonctionnalités

### `/login` — Connexion
- Formulaire email + mot de passe
- Validation Zod côté client
- Redirige vers `/dashboard` si déjà connecté
- Design split screen avec panneau Plio à gauche

### `/register` — Inscription
- Formulaire nom, email, mot de passe, confirmation
- Validation que les deux mots de passe correspondent
- Connexion automatique après création du compte

### `/dashboard` — Tableau de bord
- Message d'accueil personnalisé selon l'heure
- Compteur de projets
- Grille de cartes projets (9 par page)
- Pagination
- Modale de création de projet
- État vide avec call-to-action

### `/projects/:id` — Détail d'un projet
- En-tête avec titre, description, compteurs de tâches
- Filtres par statut : Toutes / À faire / En cours / Terminées
- Liste de tâches paginée (10 par page)
- Création, modification, suppression de tâches en modale
- Modification et suppression du projet
- Indicateur "En retard" si la date d'échéance est dépassée

---

## Authentification

L'app utilise les tokens **Sanctum** (Bearer token).

Le token est stocké dans `localStorage` sous la clé `auth_token`. L'utilisateur est stocké sous `auth_user`.

**Comportement automatique :**
- Toute requête API inclut automatiquement le header `Authorization: Bearer {token}` via un intercepteur Axios
- Si l'API retourne `401`, l'app efface le localStorage et redirige vers `/login`
- Les routes protégées redirigent vers `/login` si aucun token n'est présent
- Les routes `/login` et `/register` redirigent vers `/dashboard` si déjà connecté

---

## Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de base de l'API (sans slash final) | `https://phpapi-production.up.railway.app/api` |

> Les variables Vite doivent commencer par `VITE_` pour être accessibles dans le code via `import.meta.env.VITE_*`.

---

## Thème Plio

Le design suit la palette **Plio** définie dans `src/index.css` :

| Rôle | Couleur | Usage |
|------|---------|-------|
| Primaire | Indigo `#4f46e5` | Boutons, accents, sidebar |
| Accent | Violet `#a855f7` | Highlights, dégradés |
| Surface | `#f8f9ff` | Fond principal |
| Succès | Emerald `#10b981` | Tâches terminées |
| Danger | Rose `#ef4444` | Suppressions, erreurs |
| Texte principal | `#1e1b4b` | Titres |
| Texte secondaire | Slate `#94a3b8` | Descriptions |

La sidebar utilise un dégradé `from-indigo-900 via-indigo-800 to-violet-900`.

---

## Commandes disponibles

```bash
npm run dev        # Démarrage en développement (hot reload)
npm run build      # Build de production
npm run preview    # Prévisualisation du build
npm run lint       # Linting avec Oxlint
```
