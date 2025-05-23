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
    features JSON,
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
    quantite INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (id_panier, id_prod)
);

-- Table COMMANDE
CREATE TABLE commande (
    id_cmd SERIAL PRIMARY KEY,
    date_cmd TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    etat_cmd VARCHAR(50) NOT NULL CHECK (etat_cmd IN ('en attente', 'en cours', 'livrée', 'annulée')),
    id_panier INTEGER REFERENCES panier(id_panier),
    id_user INTEGER REFERENCES users(id)
);

-- Table PRODUCT_IMAGES (for multiple images per product)
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES produit(id_prod) ON DELETE CASCADE,
    image_path VARCHAR(255) NOT NULL
);

-- Table CONTACT_MESSAGES
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied'))
);

-- Create index for contact_messages user_id
CREATE INDEX idx_contact_messages_user_id ON contact_messages(user_id);

-- Table RENDEZ_VOUS
CREATE TABLE rendez_vous (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date_rdv DATE NOT NULL,
    heure_rdv TIME NOT NULL,
    type_rdv VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'confirme', 'annule')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table SHIPPING_INFO
CREATE TABLE shipping_info (
    id SERIAL PRIMARY KEY,
    commande_id INTEGER REFERENCES commande(id_cmd) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    adresse TEXT NOT NULL,
    ville VARCHAR(100) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    pays VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table ORDER_STATUS_HISTORY
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES commande(id_cmd) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('en attente', 'en cours', 'livrée', 'annulée')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER REFERENCES users(id)
);

-- Add trigger to automatically record status changes
CREATE OR REPLACE FUNCTION record_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.etat_cmd IS NULL OR NEW.etat_cmd != OLD.etat_cmd THEN
        INSERT INTO order_status_history (order_id, status, updated_by)
        VALUES (NEW.id_cmd, NEW.etat_cmd, NEW.id_user);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
AFTER INSERT OR UPDATE ON commande
FOR EACH ROW
EXECUTE FUNCTION record_order_status_change();
