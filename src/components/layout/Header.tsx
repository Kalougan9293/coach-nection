"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#F3F0EB] text-[#1F2957] py-4 px-6 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Gauche : Texte */}
        <div className="w-1/3 flex justify-start">
          <span className="font-bold text-xl tracking-tight">Coach-Nection</span>
        </div>

        {/* Centre : Logo */}
        <div className="w-1/3 flex justify-center">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="Logo Coach-Nection" 
              className="h-16 w-16 object-cover rounded-full mix-blend-multiply"
            />
          </Link>
        </div>

        {/* Droite : Menu Hamburger */}
        <div className="w-1/3 flex justify-end relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#1F2957] hover:text-[#003399] transition-colors"
            aria-label="Menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Menu déroulant */}
          {isMenuOpen && (
            <div className="absolute top-12 right-0 w-56 bg-white rounded-lg shadow-xl py-2 border border-gray-100 flex flex-col text-left">
              <Link 
                href="#concept" 
                className="px-4 py-3 hover:bg-[#F3F0EB] hover:text-[#003399] transition-colors font-medium border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Concept
              </Link>
              <Link 
                href="/formulaire/coach" 
                className="px-4 py-3 hover:bg-[#F3F0EB] hover:text-[#003399] transition-colors font-medium border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription coach
              </Link>
              <Link 
                href="/formulaire/recruteur" 
                className="px-4 py-3 hover:bg-[#F3F0EB] hover:text-[#003399] transition-colors font-medium border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Déposer une demande
              </Link>
              <Link
                href="mailto:contact@coach-nection.com"
                className="px-4 py-3 hover:bg-[#F3F0EB] hover:text-[#003399] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}