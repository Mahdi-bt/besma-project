"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X, Info } from "lucide-react"
import { addToCart } from "@/lib/cart"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const router = useRouter()

  const handleAddToCart = () => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/connexion')
      return
    }
    addToCart(product)
    // You might want to show a success message
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="relative">
          <img
            src={`http://localhost:8000/uploads/products/${product.image}`}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
          >
            <Info size={20} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-primary">
              {product.price.toFixed(2)} €
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              Commander
            </button>
          </div>
        </div>
      </motion.div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {isDetailsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsDetailsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                  <img
                    src={`http://localhost:8000/uploads/products/${product.image}`}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setIsDetailsOpen(false)}
                    className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Prix</span>
                      <span className="font-bold text-primary">
                        {product.price.toFixed(2)} €
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Catégorie</span>
                      <span className="capitalize">{product.category}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Stock</span>
                      <span>{product.stock} unités</span>
                    </div>

                    {product.details && (
                      <div className="border-t pt-4 mt-4">
                        <h3 className="font-bold mb-2">Détails</h3>
                        {Object.entries(product.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize">{key}</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-6 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
