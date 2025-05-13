'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getCommandesByClient, getOrderDetails, updateOrderStatus } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import ReturnButton from "@/components/ReturnButton"

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
  user_nom?: string
  user_email?: string
}

interface OrderWithDetails extends Order {
  productDetails?: {
    id_prod: number
    nom_prod: string
    prix_prod: number
    stock_quantity: number
    cart_quantity: number
  }[]
  status_history?: {
    status: string
    created_at: string
    description: string
  }[]
  status_description?: string
}

export default function AdminOrders() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/connexion')
      return
    }

    const fetchOrders = async () => {
      try {
        const userOrders = await getCommandesByClient(0) // 0 for admin to get all orders
        setOrders(userOrders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [router, isAuthenticated, user])

  const handleShowOrderDetails = async (order: Order) => {
    setIsLoading(true)
    try {
      const details = await getOrderDetails(order.id_cmd)
      setSelectedOrder({ 
        ...order, 
        productDetails: details.products,
        status_history: details.status_history,
        status_description: details.order.status_description,
        user_nom: details.order.user_nom,
        user_email: details.order.user_email
      })
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    }
    setIsLoading(false)
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder || isUpdating) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const result = await updateOrderStatus(selectedOrder.id_cmd, newStatus);
      
      // Update local state
      setSelectedOrder(prev => prev ? {
        ...prev,
        etat_cmd: newStatus,
        status_history: [
          {
            status: newStatus,
            created_at: new Date().toISOString(),
            description: `Status updated to ${newStatus}`
          },
          ...(prev.status_history || [])
        ]
      } : null);

      // Update orders list
      setOrders(prev => prev.map(order => 
        order.id_cmd === selectedOrder.id_cmd 
          ? { ...order, etat_cmd: newStatus }
          : order
      ));
    } catch (error) {
      setUpdateError(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id_cmd.toString().includes(searchTerm) ||
      (order.user_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    
    const matchesStatus = statusFilter === 'all' || order.etat_cmd === statusFilter

    return matchesSearch && matchesStatus
  })

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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <ReturnButton href="/admin/dashboard" />
            <h1 className="text-3xl font-bold text-gray-800">Gestion des commandes</h1>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Rechercher une commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="en cours">En cours</option>
              <option value="livrée">Livrée</option>
              <option value="annulée">Annulée</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aucune commande trouvée.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
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
                      {order.user_nom && (
                        <p className="text-sm text-gray-600 mt-1">
                          Client: {order.user_nom} ({order.user_email})
                        </p>
                      )}
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
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total</span>
                      <span className="font-bold text-lg">{Number(order.total).toFixed(2)} €</span>
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
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
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
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.etat_cmd)}`}>
                      {selectedOrder.etat_cmd}
                    </span>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.status_description}
                    </p>
                  </div>

                  {/* Status Update Controls */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Mettre à jour le statut</h4>
                    <div className="flex flex-wrap gap-2">
                      {['en attente', 'en cours', 'livrée', 'annulée'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          disabled={isUpdating || status === selectedOrder.etat_cmd}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                            ${status === selectedOrder.etat_cmd 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : getStatusColor(status) + ' hover:opacity-80'
                            }`}
                        >
                          {isUpdating && status === selectedOrder.etat_cmd ? (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          ) : (
                            status
                          )}
                        </button>
                      ))}
                    </div>
                    {updateError && (
                      <p className="mt-2 text-sm text-red-600">{updateError}</p>
                    )}
                  </div>
                </div>

                {/* Status History */}
                {selectedOrder.status_history && selectedOrder.status_history.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Historique des statuts</h4>
                    <div className="space-y-2">
                      {selectedOrder.status_history.map((status, index) => (
                        <div key={index} className="flex items-start gap-3 text-sm">
                          <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(status.status)}`} />
                          <div>
                            <p className="font-medium">{status.status}</p>
                            <p className="text-gray-600">{status.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(status.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Informations client</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom</span>
                    <span className="font-medium">{selectedOrder.user_nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{selectedOrder.user_email}</span>
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
                            {Number(product.prix_prod).toFixed(2)} € x {product.cart_quantity}
                          </p>
                        </div>
                        <div className="font-bold">
                          {(Number(product.prix_prod) * product.cart_quantity).toFixed(2)} €
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary Section */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{Number(selectedOrder.total).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Frais de livraison</span>
                    <span className="font-medium">Gratuit</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-2xl font-bold">{Number(selectedOrder.total).toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Informations supplémentaires</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Numéro de commande</span>
                    <span className="font-medium">#{selectedOrder.id_cmd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de commande</span>
                    <span className="font-medium">{formatDate(selectedOrder.date_cmd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Méthode de paiement</span>
                    <span className="font-medium">Carte bancaire</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} 