'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaMoon, FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/produit', label: 'Produit' },
  { href: '/contact', label: 'Contact' },
  { href: '/inscription', label: 'Inscription' },
  { href: '/commande', label: 'Commande' },
  { href: '/rendez-vous', label: 'Rendez-vous' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-white/70 backdrop-blur border-b border-orange-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-orange-600">
          <FaMoon className="text-2xl" />
          <span>Au Coeur de la lune</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <FaTimes className="text-2xl text-orange-600" /> : <FaBars className="text-2xl text-orange-600" />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-white border-t border-orange-100 px-4 py-2 flex flex-col gap-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-gray-700 hover:text-orange-600 font-medium transition"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
} 