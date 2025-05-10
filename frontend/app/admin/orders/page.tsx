'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { getCommandes, updateCommande, deleteCommande, getProductById, getUserById, type Commande } from "@/lib/data"

export default function OrdersPage() {
  const router = useRouter()
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterEtat, setFilterEtat] = useState<"all" | "en attente" | "confirmée" | "expédiée" | "livrée">("all")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/connexion")
      return
    }

    const userData = JSON.parse(storedUser)
    if (userData.role !== "admin") {
      router.push("/connexion")
      return
    }

    // Load orders
    const loadCommandes = () => {
      const commandesData = getCommandes()
      setCommandes(commandesData)
      setIsLoading(false)
    }

    loadCommandes()
  }, [router])

  const handleOpenModal = (commande: Commande) => {
    setSelectedCommande(commande)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCommande(null)
  }

  const handleUpdateEtat = (id: number, newEtat: "en attente" | "confirmée" | "expédiée" | "livrée") => {
    const updatedCommande = updateCommande(id, { etat: newEtat })
    if (updatedCommande) {
      setCommandes(prev => prev.map(c => c.id === id ? updatedCommande : c))
      handleCloseModal()
    }
  }

  const handleDeleteCommande = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      const success = deleteCommande(id)
      if (success) {
        setCommandes(prev => prev.filter(c => c.id !== id))
      }
    }
  }

  const filteredCommandes = filterEtat === "all" 
    ? commandes 
    : commandes.filter(commande => commande.etat === filterEtat)

  const getProductDetails = (produitId: number) => {
    const product = getProductById(produitId)
    return product || { name: 'Produit non trouvé', price: 0 }
  }

  const getUserDetails = (userId: number) => {
    const user = getUserById(userId)
    return user || { nom: 'Utilisateur inconnu', prenom: '', email: 'N/A' }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
            <div className="flex items-center gap-4">
              <select
                value={filterEtat}
                onChange={(e) => setFilterEtat(e.target.value as any)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="all">Tous les états</option>
                <option value="en attente">En attente</option>
                <option value="confirmée">Confirmée</option>
                <option value="expédiée">Expédiée</option>
                <option value="livrée">Livrée</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCommandes.map((commande) => (
                  <motion.tr
                    key={commande.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{commande.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(commande.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${commande.etat === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${commande.etat === 'confirmée' ? 'bg-blue-100 text-blue-800' : ''}
                        ${commande.etat === 'expédiée' ? 'bg-purple-100 text-purple-800' : ''}
                        ${commande.etat === 'livrée' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {commande.etat}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {commande.total.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(commande)}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        Détails
                      </button>
                      <button
                        onClick={() => handleDeleteCommande(commande.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCommande && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Détails de la commande #{selectedCommande.id}
              </h2>

              <div className="space-y-6">
                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Informations Client</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const userDetails = getUserDetails(selectedCommande.clientId)
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nom</span>
                            <span className="font-medium">{userDetails.nom} {userDetails.prenom}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium">{userDetails.email}</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Order Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Détails de la Commande</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {new Date(selectedCommande.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">État</span>
                      <span className={`font-medium px-2 py-1 rounded-full text-sm
                        ${selectedCommande.etat === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${selectedCommande.etat === 'confirmée' ? 'bg-blue-100 text-blue-800' : ''}
                        ${selectedCommande.etat === 'expédiée' ? 'bg-purple-100 text-purple-800' : ''}
                        ${selectedCommande.etat === 'livrée' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {selectedCommande.etat}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Products List */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Produits</h3>
                  <div className="space-y-2">
                    {selectedCommande.produits.map((produit, index) => {
                      const productDetails = getProductDetails(produit.produitId)
                      return (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{productDetails.name}</span>
                            <span className="text-sm text-gray-500 ml-2">x{produit.quantite}</span>
                          </div>
                          <span className="text-gray-600">{(productDetails.price * produit.quantite).toFixed(2)} €</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total</span>
                      <span>{selectedCommande.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>

                {/* Status Update Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Mettre à jour l'état</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleUpdateEtat(selectedCommande.id, "en attente")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCommande.etat === "en attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800 hover:bg-yellow-50"
                      }`}
                    >
                      En attente
                    </button>
                    <button
                      onClick={() => handleUpdateEtat(selectedCommande.id, "confirmée")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCommande.etat === "confirmée"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                      }`}
                    >
                      Confirmée
                    </button>
                    <button
                      onClick={() => handleUpdateEtat(selectedCommande.id, "expédiée")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCommande.etat === "expédiée"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800 hover:bg-purple-50"
                      }`}
                    >
                      Expédiée
                    </button>
                    <button
                      onClick={() => handleUpdateEtat(selectedCommande.id, "livrée")}
                      className={`px-4 py-2 rounded-lg ${
                        selectedCommande.etat === "livrée"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800 hover:bg-green-50"
                      }`}
                    >
                      Livrée
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 