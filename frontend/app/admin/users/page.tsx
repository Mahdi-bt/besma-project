'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { getUsers, type User } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import ReturnButton from "@/components/ReturnButton"

export default function UsersPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "client">("all")

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/connexion')
      return
    }

    // Load users
    const loadUsers = async () => {
      try {
        const usersData = await getUsers()
        setUsers(usersData)
      } catch (err) {
        console.error('Failed to load users:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [router, isAuthenticated, user])

  const handleOpenModal = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const filteredUsers = filterRole === "all" 
    ? users 
    : users.filter(user => user.role === filterRole)

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
            <div className="flex items-center gap-4">
              <ReturnButton href="/admin/dashboard" />
              <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as any)}
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="client">Utilisateurs</option>
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
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                      `}>
                        {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Détails
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
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
                Détails de l'utilisateur
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                    <p className="mt-1 text-lg text-gray-900">{selectedUser.nom}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                    <p className="mt-1 text-lg text-gray-900">{selectedUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                  </div>
                 
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
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