"use client"

import type React from "react"

import { useState } from "react"
import type { Product } from "@/lib/types"

interface CommandeFormProps {
  selectedProduct: Product | null
}

export default function CommandeForm({ selectedProduct }: CommandeFormProps) {
  const [formData, setFormData] = useState({
    fullname: "",
    telephone: "",
    address: "",
    city: "",
    postalcode: "",
    payment: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target

    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        payment: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock success
    setSubmitSuccess(true)
    setIsSubmitting(false)
  }

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-600 mb-2">Commande confirmée !</h3>
        <p className="text-gray-600 mb-4">Votre commande a été enregistrée avec succès.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-bold mb-3">Résumé de la commande</h2>

        {selectedProduct ? (
          <div className="flex justify-between items-center">
            <span>{selectedProduct.name} (x1)</span>
            <span className="font-bold">{selectedProduct.price.toFixed(2)} €</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <span>Produit A (x2)</span>
              <span>40,00 €</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Produit B (x1)</span>
              <span>25,00 €</span>
            </div>
          </>
        )}

        <div className="border-t border-gray-200 mt-4 pt-3 text-right">
          <span className="font-bold text-lg">
            Total : {selectedProduct ? selectedProduct.price.toFixed(2) : "65,00"} €
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullname" className="block text-gray-700 font-medium mb-1">
            Nom complet
          </label>
          <input
            type="text"
            id="fullname"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Votre nom complet"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="telephone" className="block text-gray-700 font-medium mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            id="telephone"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Votre numéro"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
            Adresse de livraison
          </label>
          <input
            type="text"
            id="address"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Adresse complète"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-gray-700 font-medium mb-1">
              Ville
            </label>
            <input
              type="text"
              id="city"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Ville"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="postalcode" className="block text-gray-700 font-medium mb-1">
              Code postal
            </label>
            <input
              type="text"
              id="postalcode"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Code postal"
              value={formData.postalcode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Mode de paiement</label>
          <div className="space-y-2 mt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="creditcard"
                className="w-4 h-4 text-primary focus:ring-primary"
                onChange={handleChange}
                required
              />
              <span>Carte bancaire</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="banktransfer"
                className="w-4 h-4 text-primary focus:ring-primary"
                onChange={handleChange}
              />
              <span>Virement bancaire</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 text-lg rounded transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Traitement en cours..." : "Valider ma commande"}
        </button>
      </form>
    </div>
  )
}
