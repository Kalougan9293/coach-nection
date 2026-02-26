"use client";

import { useState } from "react";
import FormStepIndicator from "./FormStepIndicator";

export default function RecruteurForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    lieu: "",
    commentConnexion: "",
    annonce: "",
    questionsSpecifiques: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) setStep(2);
    else console.log("Submit recruteur:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Formulaire Recruteur
      </h1>
      <p className="text-primary/70 mb-8">
        Remplissez le formulaire pour publier votre annonce
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
                Comment nous avez-vous connus ?
              </label>
              <select
                name="commentConnexion"
                value={formData.commentConnexion}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
              >
                <option value="">Sélectionnez une option</option>
                <option value="google">Google</option>
                <option value="linkedin">LinkedIn</option>
                <option value="recommandation">Recommandation</option>
                <option value="reseaux">Réseaux sociaux</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 p-6 bg-white rounded-3xl shadow-card">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Quelle est ton annonce ?
              </label>
              <textarea
                name="annonce"
                value={formData.annonce}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Décrivez votre besoin en coach : type de poste, missions, profil recherché..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Questions spécifiques
              </label>
              <textarea
                name="questionsSpecifiques"
                value={formData.questionsSpecifiques}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                placeholder="Précisions supplémentaires, contraintes, disponibilités..."
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
            className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-colors"
          >
            {step === 1 ? "Continuer" : "Valider"}
          </button>
        </div>
      </form>
    </div>
  );
}
