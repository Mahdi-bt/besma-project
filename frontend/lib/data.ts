import type { Product, User, Commande,RendezVous } from "./types"



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
