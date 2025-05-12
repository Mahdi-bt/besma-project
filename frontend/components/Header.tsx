"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart, User as UserIcon, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import CartDialog from "./CartDialog"
import { getCartUniqueItemsCount } from "@/lib/cart"
import { useAuth } from "../context/AuthContext"
import type { User } from "@/lib/types"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()
  const { user, setUser, isAuthenticated } = useAuth()

  useEffect(() => {
    // Update cart count when cart changes
    const updateCartCount = () => {
      setCartCount(getCartUniqueItemsCount())
    }

    // Initial count
    updateCartCount()

    // Listen for cart changes
    window.addEventListener('storage', updateCartCount)
    window.addEventListener('cartUpdate', updateCartCount)

    return () => {
      window.removeEventListener('storage', updateCartCount)
      window.removeEventListener('cartUpdate', updateCartCount)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setIsUserMenuOpen(false)
    router.push("/connexion")
  }

  const isRegularUser = user && user.role === "user"
  const isAdmin = user && (user.role === "admin" || user.role === "test")

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold">
              Au Coeur de la lune <span className="text-accent">.</span>
            </h1>
          </Link>

          {/* Mobile menu button - Only show for regular users */}
          {!isAdmin && (
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Desktop Navigation - Only show for regular users */}
          {!isAdmin && (
            <nav className="hidden md:flex items-center space-x-6">
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
              </ul>

              {/* Cart Icon - Only for regular users */}
              {isRegularUser && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative"
                >
                  <ShoppingCart className="w-6 h-6 hover:text-accent transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md transform hover:scale-110 transition-transform">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 hover:text-accent transition-colors"
                  >
                    <UserIcon className="w-6 h-6" />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium">{user!.nom} {user!.prenom}</p>
                        <p className="text-xs text-gray-500">{user!.email}</p>
                      </div>
                      {isRegularUser ? (
                        <Link
                          href="/commandes"
                          className="block px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Mes commandes
                        </Link>
                      ) : (
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Dashboard Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/connexion"
                  className="font-bold uppercase hover:text-accent transition-colors"
                >
                  Connexion
                </Link>
              )}
            </nav>
          )}

          {/* Admin User Menu - Always visible for admin users */}
          {isAdmin && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 hover:text-accent transition-colors"
              >
                <UserIcon className="w-6 h-6" />
              </button>

              {/* Admin User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium">{user!.nom} {user!.prenom}</p>
                    <p className="text-xs text-gray-500">{user!.email}</p>
                  </div>
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Dashboard Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation - Only show for regular users */}
        {!isAdmin && isMenuOpen && (
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
              {isAuthenticated ? (
                <>
                  {isRegularUser && (
                    <li>
                      <button
                        onClick={() => {
                          setIsCartOpen(true)
                          setIsMenuOpen(false)
                        }}
                        className="font-bold uppercase hover:text-accent transition-colors flex items-center"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Panier {cartCount > 0 && `(${cartCount})`}
                      </button>
                    </li>
                  )}
                  <li>
                    <Link
                      href={isRegularUser ? "/commandes" : "/admin/dashboard"}
                      className="font-bold uppercase hover:text-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {isRegularUser ? "Mes commandes" : "Dashboard Admin"}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="font-bold uppercase text-red-600 hover:text-red-700 transition-colors flex items-center"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/connexion"
                    className="font-bold uppercase hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Cart Dialog */}
      <CartDialog isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
