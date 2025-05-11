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