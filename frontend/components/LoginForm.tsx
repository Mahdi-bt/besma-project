"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"

export default function LoginForm() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
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
      const response = await fetch("http://localhost:8000/api/auth/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de la connexion")
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem("jwt_token", data.token)
        // Store user data in localStorage and context
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        
        // Force a refresh and redirect
        router.refresh()
        
        // Redirect based on user role
        if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard"
        } else {
          window.location.href = "/"
        }
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
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </button>
      </div>
    </form>
  )
} 