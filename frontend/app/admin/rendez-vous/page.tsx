 'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getRendezVous, updateRendezVous, deleteRendezVous, getUserById } from '@/lib/data'
import type { RendezVous } from '@/lib/types'

export default function RendezVousPage() {
  const router = useRouter()
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterEtat, setFilterEtat] = useState<"all" | "en attente" | "confirmé" | "annulé" | "terminé">("all")

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

    // Load rendez-vous
    const loadRendezVous = () => {
      const rendezVousData = getRendezVous()
      setRendezVous(rendezVousData)
      setIsLoading(false)
    }

    loadRendezVous()
  }, [router])

  const handleOpenModal = (rdv: RendezVous) => {
    setSelectedRendezVous(rdv)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRendezVous(null)
  }

  const handleUpdateEtat = (id: number, newEtat: "en attente" | "confirmé" | "annulé" | "terminé") => {
    const updatedRendezVous = updateRendezVous(id, { etat: newEtat })
    if (updatedRendezVous) {
      setRendezVous(prev => prev.map(r => r.id === id ? updatedRendezVous : r))
      handleCloseModal()
    }
  }

  const handleDeleteRendezVous = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      const success = deleteRendezVous(id)
      if (success) {
        setRendezVous(prev => prev.filter(r => r.id !== id))
      }
    }
  }

  const filteredRendezVous = filterEtat === "all" 
    ? rendezVous 
    : rendezVous.filter(rdv => rdv.etat === filterEtat)

  const getClientDetails = (clientId: number) => {
    const user = getUserById(clientId)
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
            <h1 className="text-2xl font-bold text-gray-800">Gestion des Rendez-vous</h1>
            <div className="flex items-center gap-4">
              <select
                value={filterEtat}
                onChange={(e) => setFilterEtat(e.target.value as any)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="all">Tous les états</option>
                <option value="en attente">En attente</option>
                <option value="confirmé">Confirmé</option>
                <option value="annulé">Annulé</option>
                <option value="terminé">Terminé</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
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
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Spécialiste
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRendezVous.map((rdv) => {
                  const clientDetails = getClientDetails(rdv.clientId)
                  return (
                    <motion.tr
                      key={rdv.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{rdv.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(rdv.date).toLocaleDateString('fr-FR')} {rdv.heure}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {clientDetails.prenom} {clientDetails.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rdv.specialiste}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {rdv.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${rdv.etat === 'en attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${rdv.etat === 'confirmé' ? 'bg-green-100 text-green-800' : ''}
                          ${rdv.etat === 'annulé' ? 'bg-red-100 text-red-800' : ''}
                          ${rdv.etat === 'terminé' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {rdv.etat}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(rdv)}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteRendezVous(rdv.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedRendezVous && (
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
                Modifier le rendez-vous #{selectedRendezVous.id}
              </h2>

              <div className="space-y-6">
                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Informations Client</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const clientDetails = getClientDetails(selectedRendezVous.clientId)
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nom</span>
                            <span className="font-medium">{clientDetails.nom} {clientDetails.prenom}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium">{clientDetails.email}</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                {/* Rendez-vous Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Détails du Rendez-vous</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {new Date(selectedRendezVous.date).toLocaleDateString('fr-FR')} {selectedRendezVous.heure}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spécialiste</span>
                      <span className="font-medium">{selectedRendezVous.specialiste}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium">{selectedRendezVous.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-medium">{selectedRendezVous.duree} minutes</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Mettre à jour l'état</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleUpdateEtat(selectedRendezVous.id, 'confirmé')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleUpdateEtat(selectedRendezVous.id, 'annulé')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => handleUpdateEtat(selectedRendezVous.id, 'terminé')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Terminer
                    </button>
                    <button
                      onClick={() => handleUpdateEtat(selectedRendezVous.id, 'en attente')}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Remettre en attente
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}