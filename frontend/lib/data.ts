import type { Product } from "./types"

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

export function getProducts(): Product[] {
  return products
}

export function getProductById(id: number): Product | null {
  return products.find((product) => product.id === id) || null
}

export function getProductsByCategory(category: "vetement" | "nourriture" | "seance"): Product[] {
  return products.filter((product) => product.category === category)
}
