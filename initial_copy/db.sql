-- Table CLIENT
CREATE TABLE client (
    id_clt INT PRIMARY KEY,
    nom_clt VARCHAR(100),
    adresse_email_clt VARCHAR(100),
    tel_clt VARCHAR(20)
);

-- Table ADMINISTRATEUR
CREATE TABLE administrateur (
    id_admin INT PRIMARY KEY,
    nom_admin VARCHAR(100),
    adresse_email_admin VARCHAR(100)
);

-- Table PRODUIT
CREATE TABLE produit (
    id_prod INT PRIMARY KEY,
    nom_prod VARCHAR(100),
    qte_prod INT,
    prix_prod FLOAT,
    description_prod TEXT
);

-- Table PANIER
CREATE TABLE panier (
    id_panier INT PRIMARY KEY,
    total FLOAT,
    prix FLOAT,
    qte INT
);

-- Table PANIER_PRODUIT (table d’association)
CREATE TABLE panier_produit (
    id_panier INT,
    id_prod INT,
    PRIMARY KEY (id_panier, id_prod),
    FOREIGN KEY (id_panier) REFERENCES panier(id_panier) ON DELETE CASCADE,
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod) ON DELETE CASCADE
);

-- Table COMMANDE
CREATE TABLE commande (
    id_cmd INT PRIMARY KEY,
    date_cmd DATE,
    etat_cmd VARCHAR(50),
    id_panier INT,
    id_clt INT,
    FOREIGN KEY (id_panier) REFERENCES panier(id_panier),
    FOREIGN KEY (id_clt) REFERENCES client(id_clt)
);

-- Table VETEMENT (hérite de PRODUIT)
CREATE TABLE vetement (
    id_prod INT PRIMARY KEY,
    taille VARCHAR(20),
    type VARCHAR(50),
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod)
);

-- Table PRODUITNOURRITURES (hérite de PRODUIT)
CREATE TABLE produitnourritures (
    id_prod INT PRIMARY KEY,
    date_expiration DATE,
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod)
);

-- Table SEANCESOUTIEN (hérite de PRODUIT)
CREATE TABLE seancesoutien (
    id_prod INT PRIMARY KEY,
    heure INT,
    specialiste VARCHAR(100),
    date DATE,
    FOREIGN KEY (id_prod) REFERENCES produit(id_prod)
);