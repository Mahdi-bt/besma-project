-- Insert default administrator account
-- Password is 'admin123' hashed with bcrypt
INSERT INTO administrateur (nom_admin, adresse_email_admin, password)
VALUES (
    'Administrateur',
    'admin@bessma.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
); 