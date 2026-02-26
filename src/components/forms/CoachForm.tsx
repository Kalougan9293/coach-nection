"use client";

import { useState } from "react";
import FormStepIndicator from "./FormStepIndicator";

export default function CoachForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    photo: null as File | null,
    lieu: "",
    specialite: "",
    experience: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else console.log("Submit coach:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Formulaire Coach
      </h1>
      <p className="text-primary/70 mb-8">
        Rejoignez notre plateforme et augmentez votre visibilité
      </p>

      <FormStepIndicator currentStep={step} totalSteps={2} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 p-6 bg-white rounded-3xl shadow-card">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Votre prénom"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="email@exemple.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="06 00 00 00 00"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 p-6 bg-white rounded-3xl shadow-card">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Photo de profil
              </label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-primary/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-primary/70">
                    {formData.photo
                      ? formData.photo.name
                      : "Cliquez pour uploader une photo"}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Lieu
              </label>
              <input
                type="text"
                name="lieu"
                value={formData.lieu}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="Ville ou région"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Spécialité
              </label>
              <select
                name="specialite"
                value={formData.specialite}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              >
                <option value="">Sélectionnez votre spécialité</option>
                <option value="fitness">Fitness</option>
                <option value="crossfit">CrossFit</option>
                <option value="yoga">Yoga</option>
                <option value="natation">Natation</option>
                <option value="running">Running</option>
                <option value="musculation">Musculation</option>
                <option value="sport-colectif">Sport collectif</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Expérience
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Parlez-nous de votre parcours, formations, années d'expérience..."
              />
            </div>
          </div>
        )}

        <div className="flex gap-4">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-2xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
            >
              Retour
            </button>
          )}
          <button
            type="submit"
            className="flex-1 py-4 bg-secondary text-primary font-bold rounded-2xl hover:bg-secondary-light transition-colors"
          >
            {step === 1 ? "Continuer" : "Valider"}
          </button>
        </div>
      </form>
    </div>
  );
}
