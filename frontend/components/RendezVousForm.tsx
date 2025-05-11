'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { addRendezVous } from '@/lib/data'

export default function RendezVousForm() {
  const [formData, setFormData] = useState({
    date: '',
    heure: '',
    specialiste: '',
    type: 'consultation' as const,
    notes: '',
    duree: 60
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

      const user = JSON.parse(userData)
      const newRendezVous = addRendezVous({
        ...formData,
        clientId: user.id,
        etat: 'en attente'
      })

      if (newRendezVous) {
        setSuccess(true)
        setFormData({
          date: '',
          heure: '',
          specialiste: '',
          type: 'consultation',
          notes: '',
          duree: 60
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date souhaitée
        </label>
        <input
          type="date"
          id="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="heure" className="block text-sm font-medium text-gray-700">
          Heure souhaitée
        </label>
        <input
          type="time"
          id="heure"
          required
          value={formData.heure}
          onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="specialiste" className="block text-sm font-medium text-gray-700">
          Spécialiste
        </label>
        <select
          id="specialiste"
          required
          value={formData.specialiste}
          onChange={(e) => setFormData({ ...formData, specialiste: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="">Sélectionnez un spécialiste</option>
          <option value="Dr. Martin">Dr. Martin</option>
          <option value="Dr. Dubois">Dr. Dubois</option>
          <option value="Dr. Petit">Dr. Petit</option>
        </select>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type de rendez-vous
        </label>
        <select
          id="type"
          required
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="consultation">Consultation</option>
          <option value="suivi">Suivi</option>
          <option value="urgence">Urgence</option>
        </select>
      </div>

      <div>
        <label htmlFor="duree" className="block text-sm font-medium text-gray-700">
          Durée (minutes)
        </label>
        <select
          id="duree"
          required
          value={formData.duree}
          onChange={(e) => setFormData({ ...formData, duree: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="30">30 minutes</option>
          <option value="45">45 minutes</option>
          <option value="60">1 heure</option>
          <option value="90">1 heure 30</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes additionnelles
        </label>
        <textarea
          id="notes"
          rows={4}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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