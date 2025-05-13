-- Add description column to order_status_history table
ALTER TABLE order_status_history ADD COLUMN description TEXT;

-- Update existing records with default descriptions based on status
UPDATE order_status_history 
SET description = CASE 
    WHEN status = 'en attente' THEN 'Votre commande est en cours de traitement'
    WHEN status = 'en cours' THEN 'Votre commande est en cours de préparation'
    WHEN status = 'livrée' THEN 'Votre commande a été livrée'
    WHEN status = 'annulée' THEN 'Votre commande a été annulée'
    ELSE 'Statut inconnu'
END; 