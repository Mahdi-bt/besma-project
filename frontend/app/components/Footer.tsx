'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-orange-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-orange-600 font-bold text-lg">
          <span>Au Coeur de la lune</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-orange-500" aria-label="Facebook"><FaFacebook size={22} /></a>
          <a href="#" className="text-gray-400 hover:text-orange-500" aria-label="Instagram"><FaInstagram size={22} /></a>
          <a href="#" className="text-gray-400 hover:text-orange-500" aria-label="Whatsapp"><FaWhatsapp size={22} /></a>
        </div>
        <div className="text-gray-500 text-sm text-center">
          © {year} Au Coeur de la lune. Tous droits réservés.<br />
          <span className="text-xs">Site web préparé par LTAIFI Besma, CIN 13512155</span>
        </div>
      </div>
    </footer>
  );
} 