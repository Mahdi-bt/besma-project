-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table CLIENT
CREATE TABLE client (
    id_clt SERIAL PRIMARY KEY,
    nom_clt VARCHAR(100) NOT NULL,
    adresse_email_clt VARCHAR(100) UNIQUE NOT NULL,
    tel_clt VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table ADMINISTRATEUR
CREATE TABLE administrateur (
    id_admin SERIAL PRIMARY KEY,
    nom_admin VARCHAR(100) NOT NULL,
    adresse_email_admin VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table PRODUIT
CREATE TABLE produit (
    id_prod SERIAL PRIMARY KEY,
    nom_prod VARCHAR(100) NOT NULL,
    qte_prod INTEGER NOT NULL,
    prix_prod DECIMAL(10,2) NOT NULL,
    description_prod TEXT
);

-- Table PANIER
CREATE TABLE panier (
    id_panier SERIAL PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    qte INTEGER NOT NULL
);

-- Table PANIER_PRODUIT (table d'association)
CREATE TABLE panier_produit (
    id_panier INTEGER REFERENCES panier(id_panier) ON DELETE CASCADE,
    id_prod INTEGER REFERENCES produit(id_prod) ON DELETE CASCADE,
    PRIMARY KEY (id_panier, id_prod)
);

-- Table COMMANDE
CREATE TABLE commande (
    id_cmd SERIAL PRIMARY KEY,
    date_cmd TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    etat_cmd VARCHAR(50) NOT NULL,
    id_panier INTEGER REFERENCES panier(id_panier),
    id_clt INTEGER REFERENCES client(id_clt)
);

-- Table VETEMENT (hérite de PRODUIT)
CREATE TABLE vetement (
    id_prod INTEGER PRIMARY KEY REFERENCES produit(id_prod) ON DELETE CASCADE,
    taille VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL
);

-- Table PRODUITNOURRITURES (hérite de PRODUIT)
CREATE TABLE produitnourritures (
    id_prod INTEGER PRIMARY KEY REFERENCES produit(id_prod) ON DELETE CASCADE,
    date_expiration DATE NOT NULL
);

-- Table SEANCESOUTIEN (hérite de PRODUIT)
CREATE TABLE seancesoutien (
    id_prod INTEGER PRIMARY KEY REFERENCES produit(id_prod) ON DELETE CASCADE,
    heure INTEGER NOT NULL,
    specialiste VARCHAR(100) NOT NULL,
    date DATE NOT NULL
);

-- Insert default administrator account
-- Password is 'admin123' hashed with bcrypt
INSERT INTO administrateur (nom_admin, adresse_email_admin, password)
VALUES (
    'Administrateur',
    'admin@bessma.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
); 