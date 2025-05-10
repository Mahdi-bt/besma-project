'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCommandesByClient, getProductById } from '@/lib/data'
import { formatDate } from '@/lib/utils'

interface Order {
  id: number
  date: string
  etat: string
  total: number
  produits: {
    produitId: number
    quantite: number
  }[]
}

interface OrderWithDetails extends Order {
  productDetails: {
    name: string
    price: number
    image: string
  }[]
}

export default function UserOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/connexion')
      return
    }

    const user = JSON.parse(userData)
    const userOrders = getCommandesByClient(user.id)

    // Enrich orders with product details
    const ordersWithDetails = userOrders.map(order => ({
      ...order,
      productDetails: order.produits.map(item => {
        const product = getProductById(item.produitId)
        return {
          name: product?.name || 'Produit inconnu',
          price: product?.price || 0,
          image: product?.image || '/placeholder.png'
        }
      })
    }))

    setOrders(ordersWithDetails)
    setIsLoading(false)
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800'
      case 'en cours':
        return 'bg-blue-100 text-blue-800'
      case 'livrée':
        return 'bg-green-100 text-green-800'
      case 'annulée':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes commandes</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Vous n'avez pas encore de commandes.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Commande #{order.id}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.etat)}`}>
                        {order.etat}
                      </span>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="font-bold text-lg">{order.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Commande #{selectedOrder.id}
                  </h2>
                  <p className="text-gray-500">{formatDate(selectedOrder.date)}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {selectedOrder.productDetails.map((product, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-gray-600">
                        {product.price.toFixed(2)} € x {selectedOrder.produits[index].quantite}
                      </p>
                    </div>
                    <div className="font-bold">
                      {(product.price * selectedOrder.produits[index].quantite).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">{selectedOrder.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 