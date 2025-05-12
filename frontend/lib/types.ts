export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: number
  image: string
  details?: {
    [key: string]: any
  }
  images: {
    id: number
    url: string
  }[]
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
  role: "admin" | "user" | "client" | "test"
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