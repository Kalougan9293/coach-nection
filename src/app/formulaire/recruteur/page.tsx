"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

const SPECIALITES_LIST = [
  "Activité douce", "Calisthénie", "Cardio", "Crossfit", "Cross-training", 
  "Fitness général", "Danse", "Haltérophilie", "Circuit training", "Hyrox", 
  "Les Mills", "Marche sportive", "Musculation", "Pilates", "Pole dance", 
  "Santé et bien-être", "Vélo indoor", "Yoga", "Sports aquatiques", 
  "Sports artistiques", "Sports cardio", "Sports collectifs", "Sports de combat", 
  "Sports de glisse", "Sports de raquette", "Sports alternatifs", "Sports extrêmes", "Autres"
];

const TYPE_COURS_LIST = [
  "Coaching privé en salle", "En extérieur", "À domicile", "Cours collectif", 
  "Coaching plateau", "Small group", "Teambuilding", "Préparateur & compétition", 
  "Coach santé adapté", "Animation sportive", "Cours kids & teens", 
  "Coach formateur", "Bien être et nutrition", "Mission spéciale", "Coaching en ligne"
];

const DIPLOMES_LIST = [
  "BPJEPS", "STAPS", "CQP", "Formation privée", 
  "Autre diplôme spécialisé", "Diplôme bien être", "Étudiant"
];

const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export default function RecruteurForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());

  // Gestion des horaires dynamiques
  const [horairesADefinir, setHorairesADefinir] = useState(true);
  const [horairesList, setHorairesList] = useState([{ jour: 'Lundi', debut: '09:00', fin: '10:00' }]);

  // Gestion des types de contact
  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [useInsta, setUseInsta] = useState(false);

  const [formData, setFormData] = useState({
    // Page 1
    titre_annonce: '', type_demandeur: '', ville: '', specialite_recherchee: '', 
    autre_specialite: '', type_cours: '', diplome_requis: '', 
    type_contrat: '', tarif_propose: '', description: '', profil_recherche: '',
    // Page 2
    budget_recherche: 0, nom_contact: '', contact_email: '', contact_telephone: '', 
    contact_reseau: '', siret: '', connu_par: '', cgv_acceptees: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInvalidFields(prev => { const n = new Set(prev); n.delete(name); return n; });
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      if (name === 'titre_annonce' && value.length > 50) return;
      setFormData(prev => ({ ...prev, [name]: type === 'range' ? parseInt(value) : value }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.substring(0, 10);
    const formatted = val.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    setFormData(prev => ({ ...prev, contact_telephone: formatted }));
  };

  const addHoraire = () => setHorairesList([...horairesList, { jour: 'Lundi', debut: '09:00', fin: '10:00' }]);
  const removeHoraire = (index: number) => setHorairesList(horairesList.filter((_, i) => i !== index));
  const updateHoraire = (index: number, field: string, value: string) => {
    const newHoraires = [...horairesList];
    newHoraires[index] = { ...newHoraires[index], [field]: value };
    setHorairesList(newHoraires);
  };

  const getBudgetDisplay = (budget: number) => {
    if (budget === 0) {
      return { 
        text: "La recherche risque d'être plus longue. Nos frais de mise en relation seront directement déduits de la première prestation du coach (1 ou 2 séances gratuites pour lui).", 
        color: "text-gray-500", 
        bg: "bg-gray-100",
        emoji: "🐢" 
      };
    }
    if (budget > 0 && budget < 50) {
      return { 
        text: "C'est noté ! On active notre réseau. Cette prime nous permet de lancer les premières recherches sérieuses.", 
        color: "text-blue-700", 
        bg: "bg-blue-50",
        emoji: "🤝" 
      };
    }
    if (budget >= 50 && budget < 100) {
      return { 
        text: "Bon budget ! On s'occupe de tout. Toute l'équipe se mobilise pour trouver votre coach idéal rapidement !", 
        color: "text-green-700", 
        bg: "bg-green-50",
        emoji: "⚡" 
      };
    }
    return { 
      text: "Dossier VIP ! Nous optimisons toutes les chances. Votre annonce est ultra-prioritaire, il est quasi impossible d'échouer !", 
      color: "text-amber-700", 
      bg: "bg-amber-50",
      emoji: "🎯" 
    };
  };

  const nextStep = () => { window.scrollTo(0, 0); setStep(step + 1); };
  const prevStep = () => { window.scrollTo(0, 0); setStep(step - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cgv_acceptees) {
      setError("Vous devez accepter les conditions générales pour continuer.");
      return;
    }
    if (!useEmail && !usePhone && !useInsta) {
      setError("Veuillez sélectionner au moins un moyen de contact.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    const tarifNumeric = parseFloat(formData.tarif_propose);
    const finalSpecialites = formData.specialite_recherchee
      ? (formData.specialite_recherchee === 'Autres' && formData.autre_specialite
          ? [`Autres : ${formData.autre_specialite}`]
          : [formData.specialite_recherchee])
      : [];

    const finalPayload = {
      type_demandeur: formData.type_demandeur,
      ville: formData.ville,
      specialites: finalSpecialites,
      type_cours: formData.type_cours ? [formData.type_cours] : [],
      statut: "en_cours",
      horaires_a_definir: horairesADefinir,
      horaires_details: horairesADefinir ? null : horairesList,
      diplome_requis: formData.diplome_requis || null,
      type_contrat: formData.type_contrat,
      tarif_propose: isNaN(tarifNumeric) ? null : tarifNumeric,
      titre_annonce: formData.titre_annonce,
      description: formData.description,
      profil_recherche: formData.profil_recherche,
      budget_recherche: formData.budget_recherche,
      nom_contact: formData.nom_contact,
      contact_email: useEmail ? formData.contact_email : null,
      contact_telephone: usePhone ? formData.contact_telephone : null,
      contact_reseau: useInsta ? formData.contact_reseau : null,
      siret: formData.siret,
      connu_par: formData.connu_par,
      cgv_acceptees: formData.cgv_acceptees
    };

    const { error: supabaseError } = await supabase.from('demandes').insert([finalPayload]);

    if (supabaseError) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(supabaseError);
    } else {
      setIsSuccess(true);
      // Alerte webhook Make après insertion réussie
      fetch('https://hook.eu1.make.com/ntt994gqpiedfpp547m92s855mvb4e93', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      }).catch((err) => console.error('Webhook Make:', err));
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F3F0EB] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-[#1F2957] mb-4">Annonce publiée !</h2>
          <p className="text-gray-600 mb-8">
            Merci pour votre confiance ! Notre équipe prend en charge votre annonce et vous contactera sous 24h maximum pour lancer les recherches.
          </p>
          <a href="/" className="inline-block bg-[#1F2957] text-[#F3F0EB] font-bold px-8 py-3 rounded-xl hover:bg-[#151c3d] transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  const budgetInfo = getBudgetDisplay(formData.budget_recherche);

  return (
    <div className="min-h-screen bg-[#F3F0EB] py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-[#1F2957] p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Déposer une annonce</h1>
          <div className="flex justify-between items-center mb-2 px-12">
            {[1, 2].map((num) => (
              <div key={num} className="flex flex-col items-center w-1/2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-[#D4DC53] text-[#1F2957]' : 'bg-white/20 text-white'}`}>
                  {num}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= num ? 'text-[#D4DC53]' : 'text-white/50'}`}>
                  {num === 1 ? 'La demande' : 'Les informations'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden mx-auto max-w-md">
            <div className="bg-[#D4DC53] h-full transition-all duration-300" style={{ width: `${(step / 2) * 100}%` }}></div>
          </div>
        </div>

        <div className="p-8">
          {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

          {/* === ETAPE 1 : LA DEMANDE === */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#1F2957] border-b pb-2">1. La demande</h2>
              
              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('type_demandeur') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-3">Vous êtes : *</label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="type_demandeur" value="particulier" checked={formData.type_demandeur === 'particulier'} onChange={handleChange} className="w-4 h-4 text-[#1F2957] focus:ring-[#D4DC53]" />
                    <span>Un particulier</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" name="type_demandeur" value="entreprise" checked={formData.type_demandeur === 'entreprise'} onChange={handleChange} className="w-4 h-4 text-[#1F2957] focus:ring-[#D4DC53]" />
                    <span>Une structure (salle, asso, entreprise)</span>
                  </label>
                </div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('titre_annonce') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Titre de l&apos;annonce * (Max 50 car.)</label>
                <input required type="text" name="titre_annonce" placeholder="Ex: Cherche coach Yoga pour cours en entreprise..." value={formData.titre_annonce} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                <div className="text-right text-xs text-gray-400 mt-1">{formData.titre_annonce.length}/50</div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('ville') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Lieu (Ville / Quartier) *</label>
                <input required type="text" name="ville" placeholder="Ex: Paris 15e, Lyon..." value={formData.ville} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
              </div>

              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('specialite_recherchee') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Spécialité recherchée *</label>
                <select
                  required
                  name="specialite_recherchee"
                  value={formData.specialite_recherchee}
                  onChange={(e) => { setInvalidFields(prev => { const n = new Set(prev); n.delete('specialite_recherchee'); return n; }); setFormData(prev => ({ ...prev, specialite_recherchee: e.target.value })); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none bg-white transition-all"
                >
                  <option value="">Sélectionnez une spécialité</option>
                  {SPECIALITES_LIST.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {formData.specialite_recherchee === 'Autres' && (
                  <div className="mt-3 animate-fade-in">
                    <input type="text" name="autre_specialite" placeholder="Précisez la spécialité..." value={formData.autre_specialite} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                  </div>
                )}
              </div>

              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('type_cours') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Type de cours *</label>
                <select
                  required
                  name="type_cours"
                  value={formData.type_cours}
                  onChange={(e) => { setInvalidFields(prev => { const n = new Set(prev); n.delete('type_cours'); return n; }); setFormData(prev => ({ ...prev, type_cours: e.target.value })); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none bg-white transition-all"
                >
                  <option value="">Sélectionnez un type de cours</option>
                  {TYPE_COURS_LIST.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* SECTION HORAIRES */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-[#1F2957] mb-3">Horaires souhaités *</label>
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={horairesADefinir} onChange={() => setHorairesADefinir(true)} className="w-4 h-4 text-[#1F2957] focus:ring-[#D4DC53]" />
                    <span>À définir ensemble</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={!horairesADefinir} onChange={() => setHorairesADefinir(false)} className="w-4 h-4 text-[#1F2957] focus:ring-[#D4DC53]" />
                    <span>Créneaux spécifiques</span>
                  </label>
                </div>

                {!horairesADefinir && (
                  <div className="space-y-3 animate-fade-in">
                    {horairesList.map((horaire, index) => (
                      <div key={index} className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <select value={horaire.jour} onChange={(e) => updateHoraire(index, 'jour', e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none">
                          {JOURS_SEMAINE.map(j => <option key={j} value={j}>{j}</option>)}
                        </select>
                        <span className="text-sm">de</span>
                        <input type="time" value={horaire.debut} onChange={(e) => updateHoraire(index, 'debut', e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 outline-none" />
                        <span className="text-sm">à</span>
                        <input type="time" value={horaire.fin} onChange={(e) => updateHoraire(index, 'fin', e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 outline-none" />
                        
                        {horairesList.length > 1 && (
                          <button type="button" onClick={() => removeHoraire(index)} className="ml-auto px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            Retirer
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addHoraire} className="flex items-center space-x-2 text-[#1F2957] font-bold text-sm px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors mt-2">
                      <span className="text-xl">+</span> <span>Ajouter un créneau</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Type de contrat *</label>
                  <select required name="type_contrat" value={formData.type_contrat} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border outline-none bg-white focus:ring-2 focus:ring-[#D4DC53] ${invalidFields.has('type_contrat') ? 'border-2 border-red-500 bg-red-50' : 'border-gray-200'}`}>
                    <option value="">Sélectionner...</option>
                    <option value="Freelance (Prestation)">Freelance (Prestation)</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Alternance">Alternance</option>
                    <option value="Stage">Stage</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Diplôme requis (Optionnel)</label>
                  <select name="diplome_requis" value={formData.diplome_requis} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none bg-white">
                    <option value="">Peu importe...</option>
                    {DIPLOMES_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Tarif proposé (€/h)</label>
                  <input type="number" name="tarif_propose" placeholder="Ex: 40" value={formData.tarif_propose} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none" />
                </div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('description') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Description complète de l&apos;annonce *</label>
                <textarea required name="description" rows={5} placeholder="Décrivez votre besoin en détail (matériel à disposition, nombre de participants, objectifs...)" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Personnalité / Expérience recherchée (Optionnel)</label>
                <textarea name="profil_recherche" rows={3} placeholder="Ex: Coach dynamique, habitué au public senior..." value={formData.profil_recherche} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
              </div>
            </div>
          )}

          {/* === ETAPE 2 : INFORMATIONS DE CONTACT ET BUDGET === */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#1F2957] border-b pb-2">2. Les informations</h2>

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Nom de la structure ou Prénom *</label>
                <input required type="text" name="nom_contact" placeholder="Ex: Studio Fitness Paris / Thomas" value={formData.nom_contact} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-[#1F2957] mb-4">Comment les coachs ou notre équipe peuvent-ils vous contacter ? * (Plusieurs choix possibles)</label>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer mb-2">
                      <input type="checkbox" checked={useEmail} onChange={(e) => setUseEmail(e.target.checked)} className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]" />
                      <span className="font-bold text-gray-700">Par Email</span>
                    </label>
                    {useEmail && (
                      <input type="email" name="contact_email" placeholder="votre@email.com" value={formData.contact_email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none ml-7 w-[calc(100%-1.75rem)]" />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer mb-2">
                      <input type="checkbox" checked={usePhone} onChange={(e) => setUsePhone(e.target.checked)} className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]" />
                      <span className="font-bold text-gray-700">Par Téléphone</span>
                    </label>
                    {usePhone && (
                      <input type="tel" name="contact_telephone" placeholder="06 12 34 56 78" value={formData.contact_telephone} onChange={handlePhoneChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none ml-7 w-[calc(100%-1.75rem)]" />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer mb-2">
                      <input type="checkbox" checked={useInsta} onChange={(e) => setUseInsta(e.target.checked)} className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]" />
                      <span className="font-bold text-gray-700">Par Réseau Social</span>
                    </label>
                    {useInsta && (
                      <input type="text" name="contact_reseau" placeholder="Lien Instagram, LinkedIn..." value={formData.contact_reseau} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none ml-7 w-[calc(100%-1.75rem)]" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Numéro de SIRET (Optionnel)</label>
                <input type="text" name="siret" placeholder="Obligatoire pour les contrats freelance" value={formData.siret} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Où nous avez-vous connu ?</label>
                <select name="connu_par" value={formData.connu_par} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none bg-white transition-all">
                  <option value="">Sélectionner...</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Tiktok">Tiktok</option>
                  <option value="Mail">Mail</option>
                  <option value="Bouche à oreille">Bouche à oreille</option>
                  <option value="Recherche Google">Recherche Google</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* SECTION BUDGET RECHERCHE (SLIDER) DEPLACEE ICI */}
              <div className="mt-10 border-t border-gray-200 pt-8 pb-4">
                <label className="block text-xl font-bold text-[#1F2957] mb-2">Budget alloué à notre recherche (Frais d'agence)</label>
                <p className="text-sm text-gray-500 mb-8">Sélectionnez le montant que vous êtes prêt à investir en cas de recherche fructueuse.</p>
                
                <div className="relative pt-1 px-2">
                  <input 
                    type="range" 
                    name="budget_recherche" 
                    min="0" 
                    max="150" 
                    step="10" 
                    value={formData.budget_recherche} 
                    onChange={handleChange}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1F2957]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-3 font-bold">
                    <span>0€</span>
                    <span>50€</span>
                    <span>100€</span>
                    <span>150€+</span>
                  </div>
                </div>

                <div className={`mt-8 p-5 rounded-xl flex items-start gap-4 transition-colors border ${budgetInfo.bg.replace('bg-', 'border-').replace('50', '200')} ${budgetInfo.bg}`}>
                  <div className="text-4xl mt-1">{budgetInfo.emoji}</div>
                  <div>
                    <div className={`font-black text-2xl mb-2 ${budgetInfo.color}`}>
                      {formData.budget_recherche === 150 ? '150€ ou plus' : `${formData.budget_recherche}€`}
                    </div>
                    <p className={`text-sm ${budgetInfo.color} opacity-90 leading-relaxed font-medium`}>
                      {budgetInfo.text}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-5 italic bg-white p-3 rounded-lg border border-gray-100">
                  * Ceci est un devis estimatif pour évaluer la priorité de votre demande. Un contact aura lieu sous 24h grand maximum pour valider ces modalités ensemble.
                </p>
              </div>

              <div className="mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[5.5rem] flex items-center">
                <label className="flex items-start space-x-3 cursor-pointer w-full">
                  <input required type="checkbox" name="cgv_acceptees" checked={formData.cgv_acceptees} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-[#1F2957] focus:ring-[#D4DC53] flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    J&apos;accepte les conditions générales de vente, les conditions générales d&apos;utilisation, et la politique de confidentialité concernant l&apos;usage de mes données.*
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-6 py-3 text-[#1F2957] font-bold hover:bg-gray-100 rounded-xl transition-colors">
                ← Retour
              </button>
            ) : <div></div>}

            {step === 1 ? (
              <button type="button" onClick={() => {
                const missing: string[] = [];
                if (!formData.type_demandeur) missing.push('type_demandeur');
                if (!formData.titre_annonce) missing.push('titre_annonce');
                if (!formData.ville) missing.push('ville');
                if (!formData.type_contrat) missing.push('type_contrat');
                if (!formData.description) missing.push('description');
                if (!formData.specialite_recherchee) missing.push('specialite_recherchee');
                if (!formData.type_cours) missing.push('type_cours');
                if (missing.length > 0) {
                  setInvalidFields(new Set(missing));
                  setError(missing.includes('specialite_recherchee') || missing.includes('type_cours')
                    ? "Veuillez sélectionner une spécialité recherchée et un type de cours."
                    : "Veuillez remplir tous les champs obligatoires (*) avant de continuer.");
                  return;
                }
                setInvalidFields(new Set());
                setError(null);
                nextStep();
              }} className="px-8 py-3 bg-[#1F2957] text-white font-bold rounded-xl shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:bg-[#151c3d]">
                Suivant →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-3 bg-[#D4DC53] text-[#1F2957] font-bold rounded-xl shadow-md transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:bg-[#c4cc43] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100">
                {isSubmitting ? 'Envoi...' : 'Valider ma demande ✓'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}