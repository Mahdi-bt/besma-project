"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getRendezVous, updateRendezVousStatus } from '@/lib/api'
import type { RendezVous } from '@/lib/api'

export default function RendezVousPage() {
  const router = useRouter()
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "en_attente" | "confirme" | "annule">("all")

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
    const loadRendezVous = async () => {
      try {
        const data = await getRendezVous()
        setRendezVous(data)
      } catch (error) {
        console.error('Failed to load rendez-vous:', error)
      } finally {
        setIsLoading(false)
      }
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

  const handleUpdateStatus = async (id: number, newStatus: "en_attente" | "confirme" | "annule") => {
    try {
      await updateRendezVousStatus(id, newStatus)
      setRendezVous(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
      handleCloseModal()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const filteredRendezVous = filterStatus === "all" 
    ? rendezVous 
    : rendezVous.filter(rdv => rdv.status === filterStatus)

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
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="all">Tous les états</option>
                <option value="en_attente">En attente</option>
                <option value="confirme">Confirmé</option>
                <option value="annule">Annulé</option>
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
                {filteredRendezVous.map((rdv) => (
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
                      {rdv.date_rdv} {rdv.heure_rdv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rdv.user_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rdv.type_rdv}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${rdv.status === 'en_attente' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${rdv.status === 'confirme' ? 'bg-green-100 text-green-800' : ''}
                        ${rdv.status === 'annule' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {rdv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(rdv)}
                        className="text-primary hover:text-primary-dark mr-4"
                      >
                        Modifier
                      </button>
                    </td>
                  </motion.tr>
                ))}
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
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom</span>
                        <span className="font-medium">{selectedRendezVous.user_name || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium">{selectedRendezVous.user_email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rendez-vous Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Détails du Rendez-vous</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">
                        {selectedRendezVous.date_rdv} {selectedRendezVous.heure_rdv}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium">{selectedRendezVous.type_rdv}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description</span>
                      <span className="font-medium">{selectedRendezVous.description || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Mettre à jour le statut</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleUpdateStatus(selectedRendezVous.id, 'en_attente')}
                      className={`px-4 py-2 rounded-lg ${
                        selectedRendezVous.status === 'en_attente'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      En attente
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRendezVous.id, 'confirme')}
                      className={`px-4 py-2 rounded-lg ${
                        selectedRendezVous.status === 'confirme'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Confirmé
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRendezVous.id, 'annule')}
                      className={`px-4 py-2 rounded-lg ${
                        selectedRendezVous.status === 'annule'
                          ? 'bg-red-500 text-white'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      Annulé
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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