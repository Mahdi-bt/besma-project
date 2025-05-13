"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getContactMessages, updateMessageStatus, ContactMessage } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ReturnButton from '@/components/ReturnButton'
import { Loader2, Check, X, Mail } from 'lucide-react'

export default function ContactMessagesPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/connexion')
      return
    }

    const fetchMessages = async () => {
      try {
        const data = await getContactMessages()
        setMessages(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [router, isAuthenticated, user])

  const handleOpenModal = (message: ContactMessage) => {
    setSelectedMessage(message)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMessage(null)
  }

  const handleStatusUpdate = async (messageId: number, newStatus: ContactMessage['status']) => {
    try {
      await updateMessageStatus(messageId, newStatus)
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, status: newStatus } : msg
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut')
    }
  }

  const filteredMessages = messages.filter(message => 
    statusFilter === 'all' || message.status === statusFilter
  )

  if (!user || user.role !== 'admin') {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ReturnButton href="/admin/dashboard" />
                <h1 className="text-2xl font-semibold text-gray-900">Messages de contact</h1>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="unread">Non lus</option>
                <option value="read">Lus</option>
                <option value="replied">Répondus</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="divide-y divide-gray-200">
            {filteredMessages.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                Aucun message trouvé.
              </div>
            ) : (
              filteredMessages.map((message) => (
                <div key={message.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{message.subject}</h3>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>De: {message.name} ({message.email})</p>
                        {message.user_name && (
                          <p>Utilisateur: {message.user_name} ({message.user_email})</p>
                        )}
                        <p>Envoyé le {format(new Date(message.created_at), 'PPP', { locale: fr })}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(message.id, 'read')}
                        className={`p-2 rounded-full ${
                          message.status === 'read' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-600'
                        }`}
                        title="Marquer comme lu"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(message.id, 'replied')}
                        className={`p-2 rounded-full ${
                          message.status === 'replied' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-600'
                        }`}
                        title="Marquer comme répondu"
                      >
                        <Mail className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{message.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Message Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedMessage && (
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
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Détails du message
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                    <p className="mt-1 text-lg text-gray-900">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg text-gray-900">{selectedMessage.email}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Sujet</h3>
                    <p className="mt-1 text-lg text-gray-900">{selectedMessage.subject}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Message</h3>
                    <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Statut</h3>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id, 'unread')}
                        className={`px-4 py-2 rounded-lg ${
                          selectedMessage.status === 'unread'
                            ? 'bg-red-500 text-white'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        Non lu
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                        className={`px-4 py-2 rounded-lg ${
                          selectedMessage.status === 'read'
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        Lu
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                        className={`px-4 py-2 rounded-lg ${
                          selectedMessage.status === 'replied'
                            ? 'bg-green-500 text-white'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        Répondu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}