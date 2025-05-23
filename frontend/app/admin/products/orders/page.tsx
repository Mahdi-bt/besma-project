'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCommandesByClient, getOrderDetails } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Order {
  id_cmd: number
  date_cmd: string
  etat_cmd: string
  id_panier: number
  total: number
  qte: number
  shipping_nom?: string
  shipping_prenom?: string
  shipping_ville?: string
}

interface OrderWithDetails extends Order {
  productDetails?: {
    id_prod: number
    nom_prod: string
    prix_prod: number
    quantite: number
    image?: string
  }[]
}

export default function UserOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const userData = localStorage.getItem('user')
      if (!userData) {
        router.push('/connexion')
        return
      }
      
      const user = JSON.parse(userData)
      
      try {
        const userOrders = await getCommandesByClient(user.id)
        setOrders(userOrders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      }
      
      setIsLoading(false)
    }

    fetchOrders()
  }, [router])

  const handleShowOrderDetails = async (order: OrderWithDetails) => {
    setIsLoading(true)
    try {
      const details = await getOrderDetails(order.id_cmd)
      setSelectedOrder({ ...order, productDetails: details.products })
    } catch (error) {
      console.error('Failed to fetch order details:', error)
      setSelectedOrder(order)
    }
    setIsLoading(false)
  }

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
                key={order.id_cmd}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Commande #{order.id_cmd}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.date_cmd)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.etat_cmd)}`}>
                        {order.etat_cmd}
                      </span>
                      <button
                        onClick={() => handleShowOrderDetails(order)}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Commande #{selectedOrder.id_cmd}
                    </h2>
                    <p className="text-gray-500">{formatDate(selectedOrder.date_cmd)}</p>
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

                {/* Order Status Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">État de la commande</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.etat_cmd)}`}>
                        {selectedOrder.etat_cmd}
                      </span>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.etat_cmd === 'en attente' && 'Votre commande est en cours de traitement'}
                        {selectedOrder.etat_cmd === 'en cours' && 'Votre commande est en cours de préparation'}
                        {selectedOrder.etat_cmd === 'livrée' && 'Votre commande a été livrée'}
                        {selectedOrder.etat_cmd === 'annulée' && 'Votre commande a été annulée'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                {selectedOrder.productDetails && selectedOrder.productDetails.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Produits commandés</h3>
                    <div className="space-y-4">
                      {selectedOrder.productDetails.map((product, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{product.nom_prod}</h3>
                            <p className="text-gray-600">
                              {Number(product.prix_prod).toFixed(2)} € x {product.quantite}
                            </p>
                          </div>
                          <div className="font-bold">
                            {(Number(product.prix_prod) * product.quantite).toFixed(2)} €
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary Section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{Number(selectedOrder.total).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{Number(selectedOrder.total).toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}