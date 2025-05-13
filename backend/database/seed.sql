-- Insert default users (admin and clients)
-- Password is 'admin123' for admin, 'user123' for clients (bcrypt hash)
INSERT INTO users (nom, email, tel, password, role) VALUES
('Administrateur', 'admin@bessma.com', NULL, '$2y$12$2rA8QpWWav7iwzA2qUpBieNC8bKES8Az4VblF.9iFQKGrttnv/sKG', 'admin'),
('Alice Dupont', 'alice@example.com', '0600000001', '$2y$12$7qTAg4DgNzeKGxvDXrjVu.NGWtmFlGPHkOlHB9jm9Ru1IVTkLwHfu', 'client'),
('Bob Martin', 'bob@example.com', '0600000002', '$2y$12$7qTAg4DgNzeKGxvDXrjVu.NGWtmFlGPHkOlHB9jm9Ru1IVTkLwHfu', 'client'),
('Claire Bernard', 'claire@example.com', '0600000003', '$2y$12$7qTAg4DgNzeKGxvDXrjVu.NGWtmFlGPHkOlHB9jm9Ru1IVTkLwHfu', 'client');

-- Insert default categories
INSERT INTO categorie (nom_categorie) VALUES ('Vêtements');
INSERT INTO categorie (nom_categorie) VALUES ('Nourriture');

-- Insert products
INSERT INTO produit (nom_prod, qte_prod, prix_prod, description_prod, categorie_id) VALUES
('T-shirt Premium', 100, 29.99, 'T-shirt en coton bio de haute qualité', 1),
('T-shirt Sport', 150, 24.99, 'T-shirt technique pour le sport', 1),
('T-shirt Casual', 200, 19.99, 'T-shirt confortable pour tous les jours', 1),
('T-shirt Design', 80, 34.99, 'T-shirt avec design unique', 1);

-- Insert product images
INSERT INTO product_images (product_id, image_path) VALUES
(1, 't-shirt-1.jpg'),
(1, 't-shirt-2.jpg'),
(2, 'new1.jpg'),
(2, 'new2.jpg'),
(3, 't-shirt-1.jpg'),
(4, 't-shirt-2.jpg');

-- Create sample orders for Alice (user_id = 2)
-- Order 1
INSERT INTO panier (total, prix, qte) VALUES (54.98, 54.98, 2);
INSERT INTO panier_produit (id_panier, id_prod, quantite) VALUES (1, 1, 1), (1, 2, 1);
INSERT INTO commande (etat_cmd, id_panier, id_user) VALUES ('en attente', 1, 2);
INSERT INTO shipping_info (commande_id, nom, prenom, email, telephone, adresse, ville, code_postal, pays) 
VALUES (1, 'Dupont', 'Alice', 'alice@example.com', '0600000001', '123 Rue de Paris', 'Paris', '75001', 'France');

-- Order 2
INSERT INTO panier (total, prix, qte) VALUES (79.98, 79.98, 3);
INSERT INTO panier_produit (id_panier, id_prod, quantite) VALUES (2, 3, 2), (2, 4, 1);
INSERT INTO commande (etat_cmd, id_panier, id_user) VALUES ('en cours', 2, 2);
INSERT INTO shipping_info (commande_id, nom, prenom, email, telephone, adresse, ville, code_postal, pays) 
VALUES (2, 'Dupont', 'Alice', 'alice@example.com', '0600000001', '123 Rue de Paris', 'Paris', '75001', 'France');

-- Create sample orders for Bob (user_id = 3)
-- Order 3
INSERT INTO panier (total, prix, qte) VALUES (29.99, 29.99, 1);
INSERT INTO panier_produit (id_panier, id_prod, quantite) VALUES (3, 1, 1);
INSERT INTO commande (etat_cmd, id_panier, id_user) VALUES ('livrée', 3, 3);
INSERT INTO shipping_info (commande_id, nom, prenom, email, telephone, adresse, ville, code_postal, pays) 
VALUES (3, 'Martin', 'Bob', 'bob@example.com', '0600000002', '456 Avenue des Champs-Élysées', 'Paris', '75008', 'France');

-- Order 4
INSERT INTO panier (total, prix, qte) VALUES (104.97, 104.97, 3);
INSERT INTO panier_produit (id_panier, id_prod, quantite) VALUES (4, 4, 3);
INSERT INTO commande (etat_cmd, id_panier, id_user) VALUES ('annulée', 4, 3);
INSERT INTO shipping_info (commande_id, nom, prenom, email, telephone, adresse, ville, code_postal, pays) 
VALUES (4, 'Martin', 'Bob', 'bob@example.com', '0600000002', '456 Avenue des Champs-Élysées', 'Paris', '75008', 'France');

-- Create sample orders for Claire (user_id = 4)
-- Order 5
INSERT INTO panier (total, prix, qte) VALUES (89.97, 89.97, 3);
INSERT INTO panier_produit (id_panier, id_prod, quantite) VALUES (5, 2, 2), (5, 3, 1);
INSERT INTO commande (etat_cmd, id_panier, id_user) VALUES ('en attente', 5, 4);
INSERT INTO shipping_info (commande_id, nom, prenom, email, telephone, adresse, ville, code_postal, pays) 
VALUES (5, 'Bernard', 'Claire', 'claire@example.com', '0600000003', '789 Boulevard Saint-Michel', 'Paris', '75005', 'France');

-- Insert status history for orders
INSERT INTO order_status_history (order_id, status, updated_by) VALUES
(1, 'en attente', 2),
(2, 'en attente', 2),
(2, 'en cours', 1),
(3, 'en attente', 3),
(3, 'en cours', 1),
(3, 'livrée', 1),
(4, 'en attente', 3),
(4, 'annulée', 3),
(5, 'en attente', 4); 