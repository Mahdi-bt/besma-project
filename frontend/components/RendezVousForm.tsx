'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createRendezVous } from '@/lib/api'

export default function RendezVousForm() {
  const [formData, setFormData] = useState({
    date_rdv: '',
    heure_rdv: '',
    type_rdv: 'consultation' as const,
    description: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        throw new Error('Vous devez être connecté pour prendre rendez-vous')
      }

      await createRendezVous(formData)
      setSuccess(true)
      setFormData({
        date_rdv: '',
        heure_rdv: '',
        type_rdv: 'consultation',
        description: ''
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date_rdv" className="block text-sm font-medium text-gray-700">
          Date souhaitée
        </label>
        <input
          type="date"
          id="date_rdv"
          required
          value={formData.date_rdv}
          onChange={(e) => setFormData({ ...formData, date_rdv: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="heure_rdv" className="block text-sm font-medium text-gray-700">
          Heure souhaitée
        </label>
        <input
          type="time"
          id="heure_rdv"
          required
          value={formData.heure_rdv}
          onChange={(e) => setFormData({ ...formData, heure_rdv: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="type_rdv" className="block text-sm font-medium text-gray-700">
          Type de rendez-vous
        </label>
        <select
          id="type_rdv"
          required
          value={formData.type_rdv}
          onChange={(e) => setFormData({ ...formData, type_rdv: e.target.value as any })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="consultation">Consultation</option>
          <option value="suivi">Suivi</option>
          <option value="urgence">Urgence</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Décrivez brièvement la raison de votre rendez-vous..."
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg">
          Votre rendez-vous a été enregistré avec succès !
        </div>
      )}

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enregistrement...' : 'Prendre rendez-vous'}
        </motion.button>
      </div>
    </form>
  )
}