-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table USERS (unified for clients and admins)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    tel VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client'
);

-- Table CATEGORIE
CREATE TABLE categorie (
    id_categorie SERIAL PRIMARY KEY,
    nom_categorie VARCHAR(100) NOT NULL
);

-- Table PRODUIT
CREATE TABLE produit (
    id_prod SERIAL PRIMARY KEY,
    nom_prod VARCHAR(100) NOT NULL,
    qte_prod INTEGER NOT NULL,
    prix_prod DECIMAL(10,2) NOT NULL,
    description_prod TEXT,
    categorie_id INTEGER REFERENCES categorie(id_categorie) ON DELETE SET NULL
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
    id_user INTEGER REFERENCES users(id)
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

-- Table PRODUCT_IMAGES (for multiple images per product)
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES produit(id_prod) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL
);
