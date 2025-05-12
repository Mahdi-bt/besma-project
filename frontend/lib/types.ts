export interface Product {
  id: number
  nom_prod: string
  description_prod: string
  prix_prod: number
  qte_prod: number
  categorie_id: number
  images: {
    id: number
    url: string
  }[]
  details: null | {
    taille?: string
    type?: string
    dateExpiration?: string
    specialiste?: string
    duree?: number
  }
}

export interface Client {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
}

export interface Commande {
  id: number
  date: string
  etat: "en attente" | "confirmée" | "expédiée" | "livrée"
  clientId: number
  produits: {
    produitId: number
    quantite: number
  }[]
  total: number
  livraison: {
    nom: string
    prenom: string
    email: string
    telephone: string
    adresse: string
    ville: string
    codePostal: string
    pays: string
  }
}

export interface User {
  id: number
  email: string
  password: string
  role: "admin" | "user"
  nom: string
  prenom: string
  createdAt: string
  lastLogin?: string
}
export interface RendezVous {
  id: number
  date: string
  heure: string
  clientId: number
  specialiste: string
  type: "consultation" | "suivi" | "urgence"
  etat: "en attente" | "confirmé" | "annulé" | "terminé"
  notes?: string
  duree: number // in minutes
}