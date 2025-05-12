'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getUsers, getRendezVous } from '@/lib/data'
import Link from 'next/link'

interface Stats {
  users: number
  products: number
  orders: number
  rendezVous: number
  category: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    users: 0,
    products: 0,
    orders: 0,
    rendezVous: 0,
    category: 0
  })

  useEffect(() => {
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

    // Load stats
    const users = getUsers()
    const products = []
    const orders = []
    const rendezVous = getRendezVous()
    

    setStats({
      users: users.length,
      products: 0,
      orders: 0,
      rendezVous: rendezVous.length,
      category: 0 // Assuming category is not available in the current data
    })
  }, [router])

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
      title: 'Category',
      value: stats.category,
      icon: '📁',
      color: 'bg-purple-500',
      link: '/admin/categories'
    },
    {
      title: 'Rendez-vous',
      value: stats.rendezVous,
      icon: '📅',
      color: 'bg-yellow-500',
      link: '/admin/rendez-vous'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>

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