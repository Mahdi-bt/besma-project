'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import LoginForm from "@/components/LoginForm"

export default function Connexion() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent"
            >
              Connexion
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 leading-relaxed mb-8"
            >
              Connectez-vous à votre compte pour accéder à tous nos services.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <Link
                href="/inscription"
                className="text-primary hover:text-primary-dark font-medium transition-colors"
              >
                Pas encore de compte ? S'inscrire
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <LoginForm />
          </motion.div>
        </div>
      </section>
    </div>
  )
} 