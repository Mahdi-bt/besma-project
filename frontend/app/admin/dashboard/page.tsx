'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getProducts, getUsers, getCommandes, getCommandesByEtat } from '@/lib/data'

interface AdminData {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalUsers: 0
  })

  useEffect(() => {
    // Check if user is logged in and is an admin
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/connexion')
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== 'admin') {
      router.push('/connexion')
      return
    }

    setAdminData(user)

    // Load stats
    const products = getProducts()
    const users = getUsers()
    const pendingOrders = getCommandesByEtat('en attente')

    setStats({
      totalProducts: products.length,
      pendingOrders: pendingOrders.length,
      totalUsers: users.length
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/connexion')
  }

  if (!adminData) {
    return null // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord administrateur</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Bienvenue, {adminData.prenom} {adminData.nom}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestion des Produits</h2>
              <p className="text-gray-600 mb-6">
                Gérez votre catalogue de produits, ajoutez de nouveaux articles et mettez à jour les informations existantes.
              </p>
              <Link
                href="/admin/products"
                className="inline-flex items-center text-primary hover:text-primary-dark"
              >
                Voir tous les produits
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Orders Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Gestion des Commandes</h2>
              <p className="text-gray-600 mb-6">
                Suivez et gérez les commandes de vos clients, mettez à jour leur statut et consultez les détails.
              </p>
              <Link
                href="/admin/orders"
                className="inline-flex items-center text-primary hover:text-primary-dark"
              >
                Voir toutes les commandes
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Users Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Utilisateurs</h2>
              <p className="text-gray-600 mb-6">
                Gérez les comptes utilisateurs, leurs permissions et leurs informations.
              </p>
              <Link
                href="/admin/users"
                className="inline-flex items-center text-primary hover:text-primary-dark"
              >
                Voir les utilisateurs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
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
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalProducts}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Commandes en attente</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total des utilisateurs</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalUsers}</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
} 