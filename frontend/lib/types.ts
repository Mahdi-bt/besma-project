export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: "vetement" | "nourriture" | "seance"
  stock: number
  details?: {
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
