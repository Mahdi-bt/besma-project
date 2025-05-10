"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            Au Coeur de la lune <span className="text-accent">.</span>
          </h1>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="font-bold uppercase hover:text-accent transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/produits" className="font-bold uppercase hover:text-accent transition-colors">
                Produits
              </Link>
            </li>
            <li>
              <Link href="/contact" className="font-bold uppercase hover:text-accent transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/inscription" className="font-bold uppercase hover:text-accent transition-colors">
                Inscription
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 shadow-md">
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                href="/"
                className="font-bold uppercase hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link
                href="/produits"
                className="font-bold uppercase hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Produits
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="font-bold uppercase hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/inscription"
                className="font-bold uppercase hover:text-accent transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
