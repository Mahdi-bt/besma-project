'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getDashboardStats, type DashboardStats } from '@/lib/api'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    products: 0,
    orders: 0,
    rendezVous: 0,
    categories: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/connexion')
      return
    }

    // Load stats
    const loadStats = async () => {
      try {
        const statsData = await getDashboardStats()
        setStats(statsData)
      } catch (err) {
        console.error('Failed to load stats:', err)
        setError('Failed to load dashboard statistics')
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [router, isAuthenticated, user])

  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.users,
      icon: '👥',
      color: 'bg-blue-500',
      link: '/admin/users'
    },
    {
      title: 'Produits',
      value: stats.products,
      icon: '📦',
      color: 'bg-green-500',
      link: '/admin/products'
    },
    {
      title: 'Commandes',
      value: stats.orders,
      icon: '🛒',
      color: 'bg-purple-500',
      link: '/admin/orders'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: '📁',
      color: 'bg-yellow-500',
      link: '/admin/categories'
    },
    {
      title: 'Rendez-vous',
      value: stats.rendezVous,
      icon: '📅',
      color: 'bg-pink-500',
      link: '/admin/rendez-vous'
    }
  ]

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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>

        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Link href={stat.link} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}