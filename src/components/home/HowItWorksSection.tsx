import React from 'react';
import Link from 'next/link';

export default function HowItWorksSection() {
  return (
    <section id="concept" className="py-12 md:py-16 bg-[#F3F0EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          
          {/* Carte Coach */}
          <div className="flex-1 bg-[#F9FCE8] rounded-2xl p-8 flex flex-col shadow-sm border border-[#D4DC53]/30">
            <h3 className="text-2xl font-bold text-[#1F2957] mb-8 flex items-center gap-3">
              <span className="bg-[#D4DC53] p-2 rounded-full">
                <svg className="w-6 h-6 text-[#1F2957]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </span>
              TU ES COACH ?
            </h3>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-8">
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F2957] text-lg">1. Inscris-toi gratuitement</h4>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">Crée ton profil en quelques minutes.</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F2957] text-lg">2. Complète-le au maximum</h4>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">Spécialités, expériences, disponibilités, zones d’intervention… Plus ton profil est précis, plus les opportunités seront pertinentes.</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F2957] text-lg">3. Ensuite ? Plus rien à faire.</h4>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">On cherche pour toi. On te contacte uniquement si une mission te correspond. Tu acceptes ou tu refuses. Pas d’abonnement. Pas de prospection. Pas de démarches. Que des opportunités ciblées.</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#D4DC53]/30">
                <p className="font-bold text-[#1F2957] text-center mb-6">👉 Tout à gagner. Rien à perdre.</p>
                <Link href="/formulaire/coach" className="block w-full text-center bg-[#D4DC53] text-[#1F2957] font-bold py-4 rounded-xl hover:bg-[#c4cc43] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Inscription Coach
                </Link>
              </div>
            </div>
          </div>

          {/* Carte Recruteur */}
          <div className="flex-1 bg-[#E8F0FE] rounded-2xl p-8 flex flex-col shadow-sm border border-[#1F2957]/10">
            <h3 className="text-2xl font-bold text-[#1F2957] mb-8 flex items-center gap-3">
              <span className="bg-[#1F2957] p-2 rounded-full">
                <svg className="w-6 h-6 text-[#F3F0EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </span>
              TU CHERCHES UN COACH ?
            </h3>
            
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-8">
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F2957] text-lg">1. Envoie-nous ta demande</h4>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">Décris ton besoin avec un maximum d’informations (objectif, lieu, fréquence, budget…).</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F2957] text-lg">2. On sélectionne et te présente les profils</h4>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">Nous activons notre réseau et te proposons les coachs les plus pertinents.</p>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#1F2957] text-lg">3. Tu valides… ou non.</h4>
                  <p className="text-gray-700 mt-2 text-sm leading-relaxed">Tu es libre de choisir. Aucun engagement tant que tu n’as pas validé un coach. Le tarif est défini selon ton besoin. Cela peut même être 0 € selon la demande. Aucun risque.</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-[#1F2957]/10">
                <p className="font-bold text-[#1F2957] text-center mb-6">👉 Tu essaies. Si on trouve, parfait. Sinon, rien à perdre.</p>
                <Link href="/formulaire/recruteur" className="block w-full text-center bg-[#1F2957] text-[#F3F0EB] font-bold py-4 rounded-xl hover:bg-[#151c3d] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Lancer une recherche
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}