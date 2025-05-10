import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
      </div>

      <div className="p-6 flex flex-col">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 flex-1">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">{product.price.toFixed(2)} €</span>
          <Link
            href={`/produits/commande?product=${product.id}`}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Commander
          </Link>
        </div>
      </div>
    </div>
  )
}
