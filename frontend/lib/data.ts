import type { Product, User, Commande,RendezVous } from "./types"

const products: Product[] = [
  {
    id: 1,
    name: "T-shirt adapté",
    description: "T-shirt conçu avec des matériaux doux et hypoallergéniques, parfait pour les peaux sensibles.",
    price: 24.99,
    image: "/images/tshirt.jpg",
    category: "vetement",
    stock: 15,
    details: {
      taille: "S, M, L",
      type: "Haut",
    },
  },
  {
    id: 2,
    name: "Pantalon confort",
    description: "Pantalon avec élastique ajustable et sans coutures irritantes pour un confort optimal.",
    price: 34.99,
    image: "/images/pantalon.jpg",
    category: "vetement",
    stock: 10,
    details: {
      taille: "S, M, L",
      type: "Bas",
    },
  },
  {
    id: 3,
    name: "Chapeau protecteur",
    description: "Chapeau à large bord offrant une protection UV maximale pour les sorties en extérieur.",
    price: 19.99,
    image: "/images/chapeau.jpg",
    category: "vetement",
    stock: 20,
    details: {
      taille: "Unique",
      type: "Accessoire",
    },
  },
  {
    id: 4,
    name: "Complément alimentaire",
    description:
      "Complément riche en vitamines D et E, spécialement formulé pour les besoins nutritionnels spécifiques.",
    price: 29.99,
    image: "/images/complement.jpg",
    category: "nourriture",
    stock: 25,
    details: {
      dateExpiration: "2025-12-31",
    },
  },
  {
    id: 5,
    name: "Collation énergétique",
    description: "Collation saine et équilibrée, sans additifs ni conservateurs, idéale pour un apport énergétique.",
    price: 12.99,
    image: "/images/collation.jpg",
    category: "nourriture",
    stock: 30,
    details: {
      dateExpiration: "2025-06-30",
    },
  },
  {
    id: 6,
    name: "Séance de soutien",
    description: "Séance individuelle avec un spécialiste pour accompagner l'enfant dans son développement.",
    price: 45.0,
    image: "/images/seance.jpg",
    category: "seance",
    stock: 8,
    details: {
      specialiste: "Dr. Martin",
      duree: 60,
    },
  },
]

const users: User[] = [
  {
    id: 1,
    email: "admin@besma.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin",
    nom: "Admin",
    prenom: "System",
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: "2024-03-20T10:30:00Z"
  },
  {
    id: 2,
    email: "jean.dupont@example.com",
    password: "user123", // In a real app, this would be hashed
    role: "user",
    nom: "Dupont",
    prenom: "Jean",
    createdAt: "2024-02-15T14:20:00Z",
    lastLogin: "2024-03-19T15:45:00Z"
  },
  {
    id: 3,
    email: "marie.martin@example.com",
    password: "user456", // In a real app, this would be hashed
    role: "user",
    nom: "Martin",
    prenom: "Marie",
    createdAt: "2024-03-01T09:15:00Z",
    lastLogin: "2024-03-20T08:30:00Z"
  }
]

const commandes: Commande[] = [
  {
    id: 1,
    date: "2024-03-20T10:30:00Z",
    etat: "en attente",
    clientId: 2,
    produits: [
      { produitId: 1, quantite: 2 },
      { produitId: 3, quantite: 1 }
    ],
    total: 69.97,
    livraison: {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      telephone: "0612345678",
      adresse: "123 Rue de la Paix",
      ville: "Paris",
      codePostal: "75001",
      pays: "France"
    }
  },
  {
    id: 2,
    date: "2024-03-19T15:45:00Z",
    etat: "confirmée",
    clientId: 3,
    produits: [
      { produitId: 2, quantite: 1 },
      { produitId: 4, quantite: 3 }
    ],
    total: 129.96,
    livraison: {
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@example.com",
      telephone: "0623456789",
      adresse: "456 Avenue des Champs-Élysées",
      ville: "Paris",
      codePostal: "75008",
      pays: "France"
    }
  },
  {
    id: 3,
    date: "2024-03-18T09:15:00Z",
    etat: "expédiée",
    clientId: 2,
    produits: [
      { produitId: 5, quantite: 2 },
      { produitId: 6, quantite: 1 }
    ],
    total: 71.98,
    livraison: {
      nom: "Dupont",
      prenom: "Jean",
      email: "jean.dupont@example.com",
      telephone: "0612345678",
      adresse: "123 Rue de la Paix",
      ville: "Paris",
      codePostal: "75001",
      pays: "France"
    }
  }
]

// Product CRUD operations
export function addProduct(product: Omit<Product, 'id'>): Product {
  const products = getProducts()
  const newProduct: Product = {
    ...product,
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
  }
  const updatedProducts = [...products, newProduct]
  localStorage.setItem('products', JSON.stringify(updatedProducts))
  return newProduct
}

export function updateProduct(id: number, updatedProduct: Partial<Product>): Product | null {
  const products = getProducts()
  const index = products.findIndex(p => p.id === id)
  
  if (index === -1) return null
  
  const updatedProducts = [...products]
  updatedProducts[index] = { ...updatedProducts[index], ...updatedProduct }
  localStorage.setItem('products', JSON.stringify(updatedProducts))
  return updatedProducts[index]
}

export function deleteProduct(id: number): boolean {
  const products = getProducts()
  const updatedProducts = products.filter(p => p.id !== id)
  
  if (updatedProducts.length === products.length) return false
  
  localStorage.setItem('products', JSON.stringify(updatedProducts))
  return true
}

// Modified getProducts to use localStorage
export function getProducts(): Product[] {
  const storedProducts = localStorage.getItem('products')
  if (storedProducts) {
    return JSON.parse(storedProducts)
  }
  
  // Initialize with mock data if no products in localStorage
  localStorage.setItem('products', JSON.stringify(products))
  return products
}

export function getProductById(id: number): Product | null {
  return products.find((product) => product.id === id) || null
}

export function getProductsByCategory(category: "vetement" | "nourriture" | "seance"): Product[] {
  return products.filter((product) => product.category === category)
}

export function getUsers(): User[] {
  const storedUsers = localStorage.getItem('users')
  if (storedUsers) {
    return JSON.parse(storedUsers)
  }
  
  // Initialize with mock data if no users in localStorage
  localStorage.setItem('users', JSON.stringify(users))
  return users
}

export function getUserById(id: number): User | null {
  return getUsers().find((user) => user.id === id) || null
}

export function getUserByEmail(email: string): User | null {
  return getUsers().find((user) => user.email === email) || null
}

export function getUsersByRole(role: "admin" | "user"): User[] {
  return getUsers().filter((user) => user.role === role)
}

export function getCommandes(): Commande[] {
  const storedCommandes = localStorage.getItem('commandes')
  if (storedCommandes) {
    return JSON.parse(storedCommandes)
  }
  
  // Initialize with mock data if no commandes in localStorage
  localStorage.setItem('commandes', JSON.stringify(commandes))
  return commandes
}

export function getCommandeById(id: number): Commande | undefined {
  return getCommandes().find((commande) => commande.id === id)
}

export function getCommandesByEtat(etat: "en attente" | "confirmée" | "expédiée" | "livrée"): Commande[] {
  return getCommandes().filter((commande) => commande.etat === etat)
}

export function getCommandesByClient(clientId: number): Commande[] {
  return getCommandes().filter((commande) => commande.clientId === clientId)
}

// Order CRUD operations
export function addCommande(commande: Omit<Commande, 'id'>): Commande {
  const commandes = getCommandes()
  const newCommande: Commande = {
    ...commande,
    id: commandes.length > 0 ? Math.max(...commandes.map(c => c.id)) + 1 : 1
  }
  const updatedCommandes = [...commandes, newCommande]
  localStorage.setItem('commandes', JSON.stringify(updatedCommandes))
  return newCommande
}

export function updateCommande(id: number, updatedCommande: Partial<Commande>): Commande | null {
  const commandes = getCommandes()
  const index = commandes.findIndex(c => c.id === id)
  
  if (index === -1) return null
  
  const updatedCommandes = [...commandes]
  updatedCommandes[index] = { ...updatedCommandes[index], ...updatedCommande }
  localStorage.setItem('commandes', JSON.stringify(updatedCommandes))
  return updatedCommandes[index]
}

export function deleteCommande(id: number): boolean {
  const commandes = getCommandes()
  const updatedCommandes = commandes.filter(c => c.id !== id)
  
  if (updatedCommandes.length === commandes.length) return false
  
  localStorage.setItem('commandes', JSON.stringify(updatedCommandes))
  return true
}
const rendezVous: RendezVous[] = [
  {
    id: 1,
    date: "2024-03-25",
    heure: "14:30",
    clientId: 2,
    specialiste: "Dr. Martin",
    type: "consultation",
    etat: "confirmé",
    notes: "Première consultation pour évaluation",
    duree: 60
  },
  {
    id: 2,
    date: "2024-03-26",
    heure: "10:00",
    clientId: 3,
    specialiste: "Dr. Dubois",
    type: "suivi",
    etat: "en attente",
    notes: "Suivi mensuel",
    duree: 45
  },
  {
    id: 3,
    date: "2024-03-27",
    heure: "16:00",
    clientId: 2,
    specialiste: "Dr. Martin",
    type: "urgence",
    etat: "confirmé",
    notes: "Consultation urgente",
    duree: 30
  }
]

// RendezVous CRUD operations
export function getRendezVous(): RendezVous[] {
  const storedRendezVous = localStorage.getItem('rendezVous')
  if (storedRendezVous) {
    return JSON.parse(storedRendezVous)
  }
  localStorage.setItem('rendezVous', JSON.stringify(rendezVous))
  return rendezVous
}

export function getRendezVousById(id: number): RendezVous | undefined {
  return getRendezVous().find((rdv) => rdv.id === id)
}

export function getRendezVousByClient(clientId: number): RendezVous[] {
  return getRendezVous().filter((rdv) => rdv.clientId === clientId)
}

export function getRendezVousByEtat(etat: "en attente" | "confirmé" | "annulé" | "terminé"): RendezVous[] {
  return getRendezVous().filter((rdv) => rdv.etat === etat)
}

export function addRendezVous(rendezVous: Omit<RendezVous, 'id'>): RendezVous {
  const rendezVousList = getRendezVous()
  const newRendezVous: RendezVous = {
    ...rendezVous,
    id: rendezVousList.length > 0 ? Math.max(...rendezVousList.map(r => r.id)) + 1 : 1
  }
  const updatedRendezVous = [...rendezVousList, newRendezVous]
  localStorage.setItem('rendezVous', JSON.stringify(updatedRendezVous))
  return newRendezVous
}

export function updateRendezVous(id: number, updatedRendezVous: Partial<RendezVous>): RendezVous | null {
  const rendezVousList = getRendezVous()
  const index = rendezVousList.findIndex(r => r.id === id)
  
  if (index === -1) return null
  
  const updatedRendezVousList = [...rendezVousList]
  updatedRendezVousList[index] = { ...updatedRendezVousList[index], ...updatedRendezVous }
  localStorage.setItem('rendezVous', JSON.stringify(updatedRendezVousList))
  return updatedRendezVousList[index]
}

export function deleteRendezVous(id: number): boolean {
  const rendezVousList = getRendezVous()
  const updatedRendezVous = rendezVousList.filter(r => r.id !== id)
  
  if (updatedRendezVous.length === rendezVousList.length) return false
  
  localStorage.setItem('rendezVous', JSON.stringify(updatedRendezVous))
  return true
}

export type { Product, User, Commande, RendezVous }
