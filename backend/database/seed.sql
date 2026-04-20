-- ============================================================
--  StagiTrack – Données de test
--  Mot de passe de tous les comptes : password123
--  Hash bcrypt généré avec saltRounds=12
-- ============================================================

USE stage;

-- ─── USERS ────────────────────────────────────────────────────
INSERT INTO users (nom, prenom, email, password_hash, role, type_conseiller, actif) VALUES
('Admin', 'Super',
 'admin@stagitrack.fr',
 '$2a$12$C.7Lw3PA5RO/f5j.P.RC2eLdMJSXj2nwCzYEzEMDprUXUG7DryXj6',
 'admin', 'les_deux', 1),

('Dupont', 'Marie',
 'conseiller1@stagitrack.fr',
 '$2a$12$C.7Lw3PA5RO/f5j.P.RC2eLdMJSXj2nwCzYEzEMDprUXUG7DryXj6',
 'conseiller', 'ecole_validation', 1),

('Martin', 'Paul',
 'conseiller2@stagitrack.fr',
 '$2a$12$C.7Lw3PA5RO/f5j.P.RC2eLdMJSXj2nwCzYEzEMDprUXUG7DryXj6',
 'conseiller', 'qualification', 1),

('Koné', 'Awa',
 'conseiller3@stagitrack.fr',
 '$2a$12$C.7Lw3PA5RO/f5j.P.RC2eLdMJSXj2nwCzYEzEMDprUXUG7DryXj6',
 'conseiller', 'les_deux', 1);

-- ─── STAGIAIRES ───────────────────────────────────────────────
INSERT INTO stagiaires (nom, prenom, email, telephone, date_debut, date_fin, entreprise, tuteur, type_stage, statut, conseiller_id) VALUES
('Coulibaly', 'Aminata', 'aminata.c@email.com', '07 01 02 03', '2025-01-15', '2025-07-15', 'SODECI Abidjan', 'M. Traoré', 'ecole', 'en_cours', 2),
('Ouattara', 'Koffi',   'koffi.o@email.com',   '07 04 05 06', '2025-02-01', '2025-05-01', 'Orange CI',      'Mme Bah',   'validation', 'en_cours', 2),
('Diallo',   'Fatou',   'fatou.d@email.com',   '07 07 08 09', '2024-10-01', '2025-04-01', 'MTN CI',         'M. Camara', 'qualification', 'en_cours', 3),
('Yao',      'Serge',   'serge.y@email.com',   '07 10 11 12', '2024-09-01', '2025-03-01', 'CFPA Abidjan',   'M. N\'Guessan', 'ecole', 'termine', 2),
('Bamba',    'Mariam',  'mariam.b@email.com',  '07 13 14 15', '2025-03-01', '2025-09-01', 'BNI',            'Mme Koné',  'qualification', 'en_cours', 3),
('Touré',    'Ibrahim', 'ibrahim.t@email.com', '07 16 17 18', '2025-01-10', '2025-04-30', 'Moov Africa',    'M. Diaby',  'ecole', 'en_cours', 2),
('Gbagbo',   'Chantal', 'chantal.g@email.com', '07 19 20 21', '2024-11-01', '2025-02-28', 'ANADER',         'M. Ettien', 'validation', 'valide', 2),
('Kra',      'Éric',    'eric.k@email.com',    '07 22 23 24', '2025-02-15', '2025-08-15', 'LONACI',         'Mme Soro',  'qualification', 'en_cours', 3),
('Konaté',   'Nadia',   'nadia.k@email.com',   '07 25 26 27', '2025-01-20', '2025-07-20', 'SIB',            'M. Fofana', 'ecole', 'en_cours', 2),
('Traoré',   'Moussa',  'moussa.t@email.com',  '07 28 29 30', '2024-12-01', '2025-06-01', 'Ecobank CI',     'Mme Yapi',  'qualification', 'en_cours', 3);

-- ─── ALERTES ──────────────────────────────────────────────────
INSERT INTO alertes (stagiaire_id, type, titre, description, resolved) VALUES
(3, 'fin_stage', 'Fin de stage imminente – Fatou Diallo',
 'Le stage se termine le 01/04/2025. Penser à préparer le rapport.', 0),
(6, 'fin_stage', 'Fin de stage dans 7 jours – Ibrahim Touré',
 'Le stage se termine le 30/04/2025.', 0),
(2, 'document',  'Document manquant – Koffi Ouattara',
 'Convention de stage non retournée signée.', 0),
(1, 'absence',   'Absence injustifiée – Aminata Coulibaly',
 '3 jours d\'absence non justifiés en mars.', 0);