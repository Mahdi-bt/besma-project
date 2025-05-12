'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { getProducts } from "@/lib/api"
import type { Product } from "@/lib/types"
import ProductCard from "@/components/ProductCard"
import { motion } from "framer-motion"

export default function Produits() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiProducts = await getProducts()
        // Map API products to frontend Product type
        const mappedProducts: Product[] = apiProducts.map((p: any) => ({
          id: p.id,
          name: p.nom_prod,
          description: p.description_prod,
          price: p.prix_prod,
          stock: p.qte_prod,
          category: p.categorie_id,
          image: p.images?.[0]?.url || '/placeholder.jpg', // Use first image URL or placeholder
          details: p.features || {},
          images: Array.isArray(p.images) ? p.images : []
        }))
        setProducts(mappedProducts)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Nos Produits
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Découvrez notre sélection de produits spécialement conçus pour les enfants de la lune.
              Des solutions adaptées pour un quotidien plus serein.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            <motion.div variants={itemVariants}>
              <Link
                href="/produits/vetements"
                className="group relative bg-white hover:bg-primary text-primary hover:text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="relative z-10">Vêtements</span>
                <div className="absolute inset-0 bg-primary/10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href="/produits/nourritures"
                className="group relative bg-white hover:bg-primary text-primary hover:text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="relative z-10">Nourritures</span>
                <div className="absolute inset-0 bg-primary/10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link
                href="/produits/rendez-vous"
                className="group relative bg-white hover:bg-primary text-primary hover:text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-xl transition-all duration-300 inline-flex items-center"
              >
                <span className="relative z-10">Rendez-vous</span>
                <div className="absolute inset-0 bg-primary/10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </Link>
            </motion.div>

            
          </motion.div>

          {/* Products Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              products.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
