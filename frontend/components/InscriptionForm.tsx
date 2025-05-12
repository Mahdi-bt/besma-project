"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function InscriptionForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8000/api/auth/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'inscription")
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token)
        // Redirect to dashboard or home page
        router.push("/")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="nom" className="block text-gray-700 font-medium mb-1">
          Nom complet
        </label>
        <input
          type="text"
          id="nom"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Votre nom complet"
          value={formData.nom}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Votre email"
          value={formData.email}
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
          placeholder="Votre numéro de téléphone"
          value={formData.telephone}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Votre mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </div>
    </form>
  )
}
