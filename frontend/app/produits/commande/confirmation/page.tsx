'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { getOrderDetails } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface OrderDetails {
  order: {
    id_cmd: number
    date_cmd: string
    etat_cmd: string
    total: number
  }
  products: {
    id_prod: number
    nom_prod: string
    prix_prod: number
    quantite: number
    images: string
  }[]
  shipping: {
    nom: string
    prenom: string
    email: string
    telephone: string
    adresse: string
    ville: string
    code_postal: string
    pays: string
  }
}

export default function OrderConfirmation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const orderId = searchParams.get('id')
    if (!orderId) {
      router.push('/produits')
      return
    }

    getOrderDetails(parseInt(orderId))
      .then(details => {
        setOrderDetails(details)
        setIsLoading(false)
      })
      .catch(() => {
        router.push('/produits')
      })
  }, [router, searchParams])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!orderDetails) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Confirmation de commande</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Commande #{orderDetails.order.id_cmd}
                </h2>
                <p className="text-gray-500">{formatDate(orderDetails.order.date_cmd)}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {orderDetails.order.etat_cmd}
              </span>
            </div>

            {/* Products List */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Produits commandés</h3>
              {orderDetails.products.map((product) => (
                <div key={product.id_prod} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={product.images || '/placeholder.png'}
                    alt={product.nom_prod}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{product.nom_prod}</h4>
                    <p className="text-gray-600">
                      {product.prix_prod.toFixed(2)} € x {product.quantite}
                    </p>
                  </div>
                  <div className="font-bold">
                    {(product.prix_prod * product.quantite).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Adresse de livraison</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">
                  {orderDetails.shipping.prenom} {orderDetails.shipping.nom}
                </p>
                <p className="text-gray-600">{orderDetails.shipping.adresse}</p>
                <p className="text-gray-600">
                  {orderDetails.shipping.code_postal} {orderDetails.shipping.ville}
                </p>
                <p className="text-gray-600">{orderDetails.shipping.pays}</p>
                <p className="text-gray-600 mt-2">
                  Tél: {orderDetails.shipping.telephone}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{orderDetails.order.total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Frais de livraison</span>
                  <span className="font-medium">Gratuit</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">{orderDetails.order.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => router.push('/produits')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    </div>
  )
}