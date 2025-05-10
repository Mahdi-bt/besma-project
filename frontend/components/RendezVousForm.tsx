"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function RendezVousForm() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    date: "",
    heure: "",
    specialiste: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
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

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 }
    }
  }

  const labelVariants = {
    focus: {
      y: -5,
      color: "#4F46E5",
      transition: { duration: 0.2 }
    },
    blur: {
      y: 0,
      color: "#374151",
      transition: { duration: 0.2 }
    }
  }

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-10 h-10 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-green-600 mb-3"
        >
          Rendez-vous confirmé !
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          Votre rendez-vous a été enregistré avec succès. Nous vous contacterons bientôt pour confirmer les détails.
        </motion.p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.label
              htmlFor="nom"
              variants={labelVariants}
              animate={focusedField === "nom" ? "focus" : "blur"}
              className="block text-gray-700 font-medium mb-2"
            >
              Nom
            </motion.label>
            <motion.input
              type="text"
              id="nom"
              variants={inputVariants}
              animate={focusedField === "nom" ? "focus" : "blur"}
              onFocus={() => setFocusedField("nom")}
              onBlur={() => setFocusedField(null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder="Votre nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.label
              htmlFor="prenom"
              variants={labelVariants}
              animate={focusedField === "prenom" ? "focus" : "blur"}
              className="block text-gray-700 font-medium mb-2"
            >
              Prénom
            </motion.label>
            <motion.input
              type="text"
              id="prenom"
              variants={inputVariants}
              animate={focusedField === "prenom" ? "focus" : "blur"}
              onFocus={() => setFocusedField("prenom")}
              onBlur={() => setFocusedField(null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder="Votre prénom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.label
            htmlFor="telephone"
            variants={labelVariants}
            animate={focusedField === "telephone" ? "focus" : "blur"}
            className="block text-gray-700 font-medium mb-2"
          >
            Téléphone
          </motion.label>
          <motion.input
            type="tel"
            id="telephone"
            variants={inputVariants}
            animate={focusedField === "telephone" ? "focus" : "blur"}
            onFocus={() => setFocusedField("telephone")}
            onBlur={() => setFocusedField(null)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
            placeholder="Votre numéro"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.label
              htmlFor="date"
              variants={labelVariants}
              animate={focusedField === "date" ? "focus" : "blur"}
              className="block text-gray-700 font-medium mb-2"
            >
              Date
            </motion.label>
            <motion.input
              type="date"
              id="date"
              variants={inputVariants}
              animate={focusedField === "date" ? "focus" : "blur"}
              onFocus={() => setFocusedField("date")}
              onBlur={() => setFocusedField(null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.label
              htmlFor="heure"
              variants={labelVariants}
              animate={focusedField === "heure" ? "focus" : "blur"}
              className="block text-gray-700 font-medium mb-2"
            >
              Heure
            </motion.label>
            <motion.input
              type="time"
              id="heure"
              variants={inputVariants}
              animate={focusedField === "heure" ? "focus" : "blur"}
              onFocus={() => setFocusedField("heure")}
              onBlur={() => setFocusedField(null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              value={formData.heure}
              onChange={handleChange}
              required
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.label
            htmlFor="specialiste"
            variants={labelVariants}
            animate={focusedField === "specialiste" ? "focus" : "blur"}
            className="block text-gray-700 font-medium mb-2"
          >
            Nom du Spécialiste
          </motion.label>
          <motion.textarea
            id="specialiste"
            variants={inputVariants}
            animate={focusedField === "specialiste" ? "focus" : "blur"}
            onFocus={() => setFocusedField("specialiste")}
            onBlur={() => setFocusedField(null)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[120px] resize-none"
            placeholder="Nom du spécialiste souhaité"
            value={formData.specialiste}
            onChange={handleChange}
            required
          ></motion.textarea>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Envoi en cours...</span>
                </motion.div>
              ) : (
                <motion.span
                  key="submit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Envoyer
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  )
}
