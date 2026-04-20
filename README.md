# 🎓 StagiTrack — Gestion des Stagiaires

Application complète de suivi des stagiaires avec gestion des accès par rôle.

## Stack technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CDN + Framer Motion + react-icons |
| Backend | Node.js + Express 4 + MySQL 8 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Cron | node-cron (alertes automatiques à 08h00) |

---

## 🚀 Démarrage rapide

### 1. Base de données MySQL

```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p stagitrack < backend/database/seed.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Éditez .env : DB_PASSWORD, JWT_SECRET
npm run dev
# → API sur http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → App sur http://localhost:5173
```

---

## 👤 Comptes de démonstration

Mot de passe universel : **`password123`**

| Email | Rôle | Accès stages |
|-------|------|-------------|
| admin@stagitrack.fr | **Admin** | Tous + gestion conseillers |
| conseiller1@stagitrack.fr | Conseiller | École & Validation uniquement |
| conseiller2@stagitrack.fr | Conseiller | Qualification uniquement |
| conseiller3@stagitrack.fr | Conseiller | Tous les types |

---

## 🔐 Logique des accès

```
Admin
  └─ Accès complet + gestion des comptes conseillers

Conseiller "ecole_validation"
  └─ Voit uniquement les stages École et Validation

Conseiller "qualification"
  └─ Voit uniquement les stages de Qualification

Conseiller "les_deux"
  └─ Voit tous les types de stages (mais pas la gestion des users)
```

Le middleware `stageScopeMiddleware` filtre automatiquement toutes les
requêtes SQL selon le `type_conseiller` extrait du JWT.

---

## 📁 Structure

```
stagiaire/
├── frontend/          # React + Vite
│   └── src/
│       ├── api/       # Appels HTTP (axios)
│       ├── components/ # UI réutilisables + layout
│       ├── context/   # AuthContext (JWT)
│       ├── hooks/     # useStagiaires, useDashboard…
│       ├── pages/     # Login, Dashboard, Stagiaires, Alertes, Users
│       └── routes/    # AppRouter + ProtectedRoute
│
└── backend/           # Node.js + Express
    └── src/
        ├── config/    # MySQL pool + Logger
        ├── models/    # User, Stagiaire, Alerte
        ├── services/  # Logique métier
        ├── controllers/ # Handlers Express
        ├── routes/    # /api/auth|users|stagiaires|alertes|dashboard
        ├── middlewares/ # JWT + rôle + scopeStage + rateLimiter
        └── jobs/      # Cron alertes quotidiennes
```

---

## ⚙️ Variables d'environnement

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=stagitrack
DB_USER=root
DB_PASSWORD=VotreMotDePasse
JWT_SECRET=une_chaine_tres_longue_et_aleatoire
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```
