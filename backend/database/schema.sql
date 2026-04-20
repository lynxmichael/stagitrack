-- ============================================================
--  StagiTrack – Schéma de base de données
--  MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS stage
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stage;

-- ─── USERS (conseillers & admins) ────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom              VARCHAR(100)  NOT NULL,
  prenom           VARCHAR(100)  NOT NULL,
  email            VARCHAR(255)  NOT NULL UNIQUE,
  password_hash    VARCHAR(255)  NOT NULL,
  role             ENUM('admin','conseiller') NOT NULL DEFAULT 'conseiller',
  type_conseiller  ENUM('ecole_validation','qualification','les_deux') NOT NULL DEFAULT 'les_deux',
  actif            TINYINT(1)    NOT NULL DEFAULT 1,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email  (email),
  INDEX idx_role   (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── STAGIAIRES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stagiaires (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom              VARCHAR(100)  NOT NULL,
  prenom           VARCHAR(100)  NOT NULL,
  email            VARCHAR(255),
  telephone        VARCHAR(30),
  date_naissance   DATE,
  date_debut       DATE          NOT NULL,
  date_fin         DATE          NOT NULL,
  entreprise       VARCHAR(255),
  tuteur           VARCHAR(200),
  type_stage       ENUM('ecole','validation','qualification') NOT NULL,
  statut           ENUM('en_cours','termine','abandonne','valide') NOT NULL DEFAULT 'en_cours',
  observations     TEXT,
  conseiller_id    INT UNSIGNED,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (conseiller_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_type_stage   (type_stage),
  INDEX idx_statut       (statut),
  INDEX idx_date_fin     (date_fin),
  INDEX idx_conseiller   (conseiller_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ALERTES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alertes (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stagiaire_id     INT UNSIGNED,
  type             ENUM('fin_stage','absence','document','autre') NOT NULL DEFAULT 'autre',
  titre            VARCHAR(255)  NOT NULL,
  description      TEXT,
  resolved         TINYINT(1)    NOT NULL DEFAULT 0,
  resolved_at      DATETIME,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (stagiaire_id) REFERENCES stagiaires(id) ON DELETE CASCADE,
  INDEX idx_resolved     (resolved),
  INDEX idx_type         (type),
  INDEX idx_stagiaire    (stagiaire_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
