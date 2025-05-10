'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface AdminData {
  id: number
  name: string
  email: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)

  useEffect(() => {
    // Check if user is logged in and is an admin
    const userType = localStorage.getItem('userType')
    const userData = localStorage.getItem('user')

    if (!userData || userType !== 'admin') {
      router.push('/connexion')
      return
    }

    setAdminData(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    router.push('/connexion')
  }

  if (!adminData) {
    return null // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord administrateur</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Management Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des produits</h2>
            <div className="space-y-4">
              <Link
                href="/admin/products"
                className="block w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
              >
                Voir tous les produits
              </Link>
              <Link
                href="/admin/products/new"
                className="block w-full px-4 py-2 text-sm font-medium text-primary border border-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Ajouter un produit
              </Link>
            </div>
          </motion.div>

          {/* Orders Management Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des commandes</h2>
            <div className="space-y-4">
              <Link
                href="/admin/orders"
                className="block w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
              >
                Voir toutes les commandes
              </Link>
              <Link
                href="/admin/orders/pending"
                className="block w-full px-4 py-2 text-sm font-medium text-primary border border-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Commandes en attente
              </Link>
            </div>
          </motion.div>

          {/* Users Management Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestion des utilisateurs</h2>
            <div className="space-y-4">
              <Link
                href="/admin/users"
                className="block w-full px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors"
              >
                Voir tous les utilisateurs
              </Link>
              <Link
                href="/admin/users/new"
                className="block w-full px-4 py-2 text-sm font-medium text-primary border border-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                Ajouter un utilisateur
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total des produits</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Commandes en attente</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total des utilisateurs</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
} 