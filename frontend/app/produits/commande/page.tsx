'use client'

import Link from "next/link"
import { use } from "react"
import { motion } from "framer-motion"
import CommandeForm from "@/components/CommandeForm"
import { getProductById } from "@/lib/data"

export default function Commande({
  searchParams,
}: {
  searchParams: { product?: string }
}) {
  const params = use(Promise.resolve(searchParams))
  const productId = params.product
  const selectedProduct = productId ? getProductById(Number.parseInt(productId)) : null

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
              Commande
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 leading-relaxed mb-8"
            >
              Complétez le formulaire ci-dessous pour passer votre commande.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/produits"
                className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition-colors group"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
                  initial={{ x: 0 }}
                  whileHover={{ x: -4 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </motion.svg>
                Retour aux catégories
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
            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8 p-4 bg-primary/5 rounded-lg border border-primary/10"
              >
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Produit sélectionné
                </h3>
                <p className="text-gray-600">
                  {selectedProduct.name} - {selectedProduct.price}€
                </p>
              </motion.div>
            )}
            <CommandeForm selectedProduct={selectedProduct} />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
