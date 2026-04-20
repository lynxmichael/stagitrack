# StagiTrack – Backend API

API REST Node.js / Express / MySQL pour la gestion des stagiaires.

## Prérequis

- Node.js 18+
- MySQL 8.0+

## Installation

```bash
cd backend
npm install
cp .env.example .env
# Éditez .env avec vos infos MySQL
```

## Base de données

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p stagitrack < database/seed.sql
```

## Démarrage

```bash
npm run dev    # développement (nodemon)
npm start      # production
```

## Comptes de test (mot de passe : password123)

| Email | Rôle | Accès |
|-------|------|-------|
| admin@stagitrack.fr | Admin | Tous les stages |
| conseiller1@stagitrack.fr | Conseiller | École & Validation |
| conseiller2@stagitrack.fr | Conseiller | Qualification |
| conseiller3@stagitrack.fr | Conseiller | Tous les stages |

## Endpoints principaux

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/login | Connexion |
| GET | /api/auth/me | Profil connecté |
| GET | /api/stagiaires | Liste des stagiaires |
| POST | /api/stagiaires | Créer un stagiaire |
| PUT | /api/stagiaires/:id | Modifier un stagiaire |
| DELETE | /api/stagiaires/:id | Supprimer |
| GET | /api/stagiaires/export/excel | Export CSV/Excel |
| GET | /api/alertes | Liste des alertes |
| PATCH | /api/alertes/:id/resolve | Résoudre une alerte |
| GET | /api/dashboard/stats | Statistiques |
| GET | /api/dashboard/alertes | Alertes du dashboard |
| GET | /api/users | Liste conseillers (admin) |
| POST | /api/users | Créer conseiller (admin) |
