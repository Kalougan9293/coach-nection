"use client";

import React, { useState } from "react";

const faqItems = [
  {
    question:
      "À qui s'adresse le réseau Coach-Nection ?",
    answer:
      "Notre agence accompagne principalement les professionnels du sport (salles de fitness, box de CrossFit, studios de yoga, associations) dans leur recherche de coachs. Nous répondons aussi aux demandes de particuliers cherchant un accompagnement privé sur mesure.",
  },
  {
    question:
      "Quel est le tarif pour recruter ou remplacer un coach sportif ?",
    answer:
      "C'est vous qui fixez votre budget ! Notre formulaire de recherche est sur mesure : vous indiquez le montant que vous êtes prêt à allouer à votre besoin. Le prix d'un remplacement urgent à 7h du matin n'est pas le même que celui d'un recrutement en CDI 35h. Vous pouvez même proposer un budget de 0 € pour la recherche : nous trouvons alors un accord directement sur les premières prestations du coach.",
  },
  {
    question:
      "Quel type de contrat de coaching proposez-vous ?",
    answer:
      "Notre réseau s'adapte à vos besoins réels. La majorité de nos coachs partenaires interviennent sous le statut de freelance (indépendant / auto-entrepreneur), idéal pour des remplacements de dernière minute ou des missions ponctuelles. Nous gérons également les mises en relation pour des recrutements classiques en CDD ou CDI.",
  },
  {
    question:
      "Dans quelles zones géographiques vos coachs interviennent-ils ?",
    answer:
      "Coach-Nection est actif sur l'ensemble de la France métropolitaine. Que vous gériez une salle en plein centre de Paris ou une association en zone rurale, nous activons notre réseau local pour vous trouver le profil idéal rapidement. L'ouverture à la Belgique, Andorre et aux DOM-TOM est en cours de déploiement !",
  },
  {
    question:
      "Je suis coach sportif, l'inscription est-elle vraiment gratuite ?",
    answer:
      "Oui, à 100 % ! Vous créez votre profil, renseignez vos spécialités et votre zone d'intervention. Ensuite, vous n'avez plus rien à faire. Nous vous contactons uniquement lorsqu'une mission (remplacement, cours collectif, coaching privé) correspond exactement à vos critères. Sans abonnement, sans engagement.",
  },
];

export default function FAQModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop avec blur */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      {/* Modale centrée */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#F3F0EB] p-6 shadow-xl md:p-8 relative">
        {/* Bouton Fermer (croix) en haut à droite */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-[#1F2957] transition-colors hover:bg-[#1F2957]/10 hover:text-[#1F2957]"
          aria-label="Fermer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="mb-6 text-2xl font-semibold text-[#1F2957]">
          Foire Aux Questions
        </h2>

        {/* Accordéon (Tailwind uniquement) */}
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-[#1F2957]/20"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="flex w-full items-center justify-between bg-white px-4 py-3 text-left text-sm font-medium text-[#1F2957] transition-colors hover:bg-[#1F2957]/5"
              >
                <span>{item.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-5 w-5 shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="border-t border-[#1F2957]/10 bg-[#F3F0EB] px-4 py-3">
                  <p className="text-sm leading-relaxed text-[#1F2957]/90">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
