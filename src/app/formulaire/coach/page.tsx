"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// --- LISTES PRÉDÉFINIES ---
const DEPARTEMENTS_LIST = Array.from({ length: 95 }, (_, i) => (i + 1).toString().padStart(2, '0'));

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

/**
 * Bucket Supabase Storage pour les photos coach.
 * En production : dans le Dashboard Supabase > Storage, créer un bucket "coach-photos",
 * le rendre Public (Public bucket), et autoriser les uploads (policy INSERT pour anon si besoin).
 * L'URL des fichiers utilise NEXT_PUBLIC_SUPABASE_URL (aucune variable d'environnement supplémentaire).
 */
const STORAGE_BUCKET_COACH_PHOTOS = 'coach-photos';

export default function CoachForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [age, setAge] = useState<number | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [deptInput, setDeptInput] = useState('');

  // Gestion des horaires dynamiques (disponibilités)
  const [horairesADefinir, setHorairesADefinir] = useState(true);
  const [horairesList, setHorairesList] = useState([{ jour: 'Lundi', debut: '09:00', fin: '10:00' }]);

  const [formData, setFormData] = useState({
    // Page 1
    nom: '', prenom: '', date_naissance: '', photo_url: '',
    // Page 2
    departements: [] as string[], specialites: [] as string[], autre_specialite: '', type_cours: [] as string[], 
    diplomes: [] as string[], diplome_statut: 'fourni', annees_experience: '', 
    prix_base: '', personnalite: '', description: '',
    // Page 3
    telephone: '', email: '', reseau_social: '', siret: '', rc_pro: false, connu_par: '', cgv_acceptees: false
  });

  // Calcul de l'âge en direct
  useEffect(() => {
    if (formData.date_naissance) {
      const today = new Date();
      const birthDate = new Date(formData.date_naissance);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [formData.date_naissance]);

  // Gestion des champs classiques
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInvalidFields(prev => { const n = new Set(prev); n.delete(name); return n; });
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gestion du formatage du téléphone (06 12 34 56 78)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvalidFields(prev => { const n = new Set(prev); n.delete('telephone'); return n; });
    let val = e.target.value.replace(/\D/g, ''); // Garde uniquement les chiffres
    if (val.length > 10) val = val.substring(0, 10); // 10 chiffres max
    const formatted = val.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
    setFormData(prev => ({ ...prev, telephone: formatted }));
  };

  // Gestion de l'aperçu photo et du fichier pour l'upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  // --- Gestion des Départements (insertion auto à 2 chiffres) ---
  const handleDeptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 2) {
      setDeptInput(val);
      if (val.length === 2) {
        const formattedDept = val.padStart(2, '0');
        if (DEPARTEMENTS_LIST.includes(formattedDept)) {
          setInvalidFields(prev => { const n = new Set(prev); n.delete('departements'); return n; });
          setFormData(prev => {
            if (prev.departements.includes(formattedDept)) return prev;
            return { ...prev, departements: [...prev.departements, formattedDept] };
          });
          setDeptInput('');
        }
      }
    }
  };

  const addHoraire = () => setHorairesList([...horairesList, { jour: 'Lundi', debut: '09:00', fin: '10:00' }]);
  const removeHoraire = (index: number) => setHorairesList(horairesList.filter((_, i) => i !== index));
  const updateHoraire = (index: number, field: string, value: string) => {
    const newHoraires = [...horairesList];
    newHoraires[index] = { ...newHoraires[index], [field]: value };
    setHorairesList(newHoraires);
  };

  const handleRemoveDept = (deptToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      departements: prev.departements.filter(d => d !== deptToRemove)
    }));
  };
  // --------------------------------

  // Gestion des listes à choix multiples (Cases à cocher)
  const handleArrayChange = (category: 'specialites' | 'type_cours' | 'diplomes', value: string) => {
    setFormData(prev => {
      const currentList = prev[category];
      if (currentList.includes(value)) {
        return { ...prev, [category]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...currentList, value] };
      }
    });
  };

  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);
  };
  
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rc_pro) {
      setError("Vous devez certifier posséder une RC Pro valide pour continuer.");
      return;
    }
    if (!formData.cgv_acceptees) {
      setError("Vous devez accepter les conditions générales pour continuer.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    let photoUrl: string | null = null;

    // 1. Upload de la photo vers Supabase Storage AVANT l'insertion en base
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeExt = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? ext : 'jpg';
      const filePath = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET_COACH_PHOTOS)
        .upload(filePath, photoFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: photoFile.type || `image/${safeExt}`,
        });

      if (uploadError) {
        setError("L'envoi de la photo a échoué. Veuillez réessayer ou continuer sans photo.");
        console.error('Storage upload error:', uploadError);
        setIsSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET_COACH_PHOTOS)
        .getPublicUrl(uploadData.path);
      photoUrl = urlData.publicUrl;
    }

    const prixNumeric = parseFloat(formData.prix_base);
    const finalSpecialites = formData.specialites.map(s =>
      s === 'Autres' && formData.autre_specialite ? `Autres : ${formData.autre_specialite}` : s
    );

    const finalPayload = {
      nom: formData.nom,
      prenom: formData.prenom,
      date_naissance: formData.date_naissance,
      photo_url: photoUrl,
      ville: formData.departements.join(', '),
      specialites: finalSpecialites,
      type_cours: formData.type_cours,
      diplome: formData.diplomes.length ? formData.diplomes.join(', ') : null,
      diplome_statut: formData.diplome_statut,
      annees_experience: formData.annees_experience,
      prix_base: isNaN(prixNumeric) ? null : prixNumeric,
      personnalite: formData.personnalite,
      horaires_a_definir: horairesADefinir,
      horaires_details: horairesADefinir ? null : horairesList,
      description: formData.description,
      telephone: formData.telephone,
      email: formData.email,
      reseau_social: formData.reseau_social,
      siret: formData.siret,
      rc_pro: formData.rc_pro,
      connu_par: formData.connu_par,
      cgv_acceptees: formData.cgv_acceptees
    };

    const { error: supabaseError } = await supabase.from('coachs').insert([finalPayload]);

    if (supabaseError) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      console.error(supabaseError);
    } else {
      setIsSuccess(true);
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F3F0EB] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-[#1F2957] mb-4">Profil enregistré !</h2>
          <p className="text-gray-600 mb-8">
            Merci pour ton inscription ! Tu n&apos;as absolument plus rien à faire. Si on a une opportunité pour toi, on te contacte directement et tu n&apos;as plus qu&apos;à dire oui ou non, c&apos;est tout ! 😉
          </p>
          <a href="/" className="inline-block bg-[#1F2957] text-[#F3F0EB] font-bold px-8 py-3 rounded-xl hover:bg-[#151c3d] transition-colors">
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0EB] py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* En-tête & Barre de progression */}
        <div className="bg-[#1F2957] p-8">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Création de ton profil Coach</h1>
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center w-1/3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-[#D4DC53] text-[#1F2957]' : 'bg-white/20 text-white'}`}>
                  {num}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= num ? 'text-[#D4DC53]' : 'text-white/50'}`}>
                  {num === 1 ? 'Identité' : num === 2 ? 'Pro' : 'Contact'}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-[#D4DC53] h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* Corps du formulaire */}
        <div className="p-8">
          {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

          {/* === ETAPE 1 : IDENTITÉ === */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#1F2957] border-b pb-2">1. Informations de base</h2>
              
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                {photoPreview ? (
                  <img src={photoPreview} alt="Aperçu" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                )}
                <div className="flex-1">
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Photo de profil *</label>
                  <p className="text-xs text-gray-500 mb-3">Attention : Choisissez une photo de vous (pas d'avatar ou de logo). Elle sera recadrée automatiquement.</p>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1F2957] file:text-white hover:file:bg-[#151c3d] cursor-pointer" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('prenom') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Prénom *</label>
                  <input required type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                </div>
                <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('nom') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Nom *</label>
                  <input required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                </div>
              </div>

              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('date_naissance') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Date de naissance *</label>
                <div className="flex items-center gap-4">
                  <input required type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                  {age !== null && (
                    <div className="bg-[#1F2957] text-white px-4 py-3 rounded-xl font-bold whitespace-nowrap">
                      {age} ans
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === ETAPE 2 : PROFESSIONNEL === */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#1F2957] border-b pb-2">2. Profil Professionnel</h2>
              
              {/* Zone d'intervention : champ court + insertion auto à 2 chiffres */}
              <div className={`rounded-xl p-4 transition-colors ${invalidFields.has('departements') ? 'border-2 border-red-500 bg-red-50' : ''}`}>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Zone d&apos;intervention (Départements) *</label>
                <p className="text-xs text-gray-500 mb-2">Saisissez 2 chiffres (ex: 75) — le département s&apos;ajoute automatiquement.</p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={deptInput}
                  onChange={handleDeptInputChange}
                  placeholder="75"
                  className="w-20 px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all text-center text-lg"
                />
                {formData.departements.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.departements.map(dep => (
                      <span key={dep} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4DC53] text-[#1F2957] text-sm font-bold rounded-full">
                        {dep}
                        <button type="button" onClick={() => handleRemoveDept(dep)} className="hover:text-red-600 focus:outline-none leading-none" aria-label="Retirer">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Spécialités : bulles cliquables, sélectionnées en dessous */}
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Vos Spécialités (cliquez pour ajouter / retirer)</label>
                {formData.specialites.length > 0 && (
                  <p className="text-xs text-[#1F2957]/70 mb-2">Sélectionnés :</p>
                )}
                {formData.specialites.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.specialites.map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => handleArrayChange('specialites', spec)}
                        className="px-3 py-1.5 bg-[#D4DC53] text-[#1F2957] text-sm font-medium rounded-full hover:bg-[#c4cc43] transition-colors"
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {SPECIALITES_LIST.filter(s => !formData.specialites.includes(s)).map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => handleArrayChange('specialites', spec)}
                      className="px-3 py-1.5 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:border-[#1F2957] hover:bg-gray-50 transition-colors"
                    >
                      {spec}
                    </button>
                  ))}
                </div>
                {formData.specialites.includes('Autres') && (
                  <div className="mt-3 animate-fade-in">
                    <input type="text" name="autre_specialite" placeholder="Précisez votre spécialité..." value={formData.autre_specialite} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                  </div>
                )}
              </div>

              {/* Types de cours : bulles cliquables */}
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Types de cours proposés (cliquez pour ajouter / retirer)</label>
                {formData.type_cours.length > 0 && (
                  <p className="text-xs text-[#1F2957]/70 mb-2">Sélectionnés :</p>
                )}
                {formData.type_cours.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.type_cours.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleArrayChange('type_cours', type)}
                        className="px-3 py-1.5 bg-[#D4DC53] text-[#1F2957] text-sm font-medium rounded-full hover:bg-[#c4cc43] transition-colors"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {TYPE_COURS_LIST.filter(t => !formData.type_cours.includes(t)).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleArrayChange('type_cours', type)}
                      className="px-3 py-1.5 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:border-[#1F2957] hover:bg-gray-50 transition-colors"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diplômes : bulles cliquables */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#1F2957]">Diplômes (cliquez pour ajouter / retirer)</label>
                {formData.diplomes.length > 0 && (
                  <p className="text-xs text-[#1F2957]/70 mb-2">Sélectionnés :</p>
                )}
                {formData.diplomes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.diplomes.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleArrayChange('diplomes', d)}
                        className="px-3 py-1.5 bg-[#D4DC53] text-[#1F2957] text-sm font-medium rounded-full hover:bg-[#c4cc43] transition-colors"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {DIPLOMES_LIST.filter(d => !formData.diplomes.includes(d)).map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleArrayChange('diplomes', d)}
                      className="px-3 py-1.5 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-full hover:border-[#1F2957] hover:bg-gray-50 transition-colors"
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-700 mb-2">Joindre le diplôme (PDF/Image)</label>
                  <input type="file" disabled={formData.diplome_statut === 'a_fournir'} className="w-full text-xs text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#1F2957] file:text-white hover:file:bg-[#151c3d] cursor-pointer disabled:opacity-50 transition-opacity" />
                </div>

                <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" checked={formData.diplome_statut === 'a_fournir'} onChange={(e) => setFormData({...formData, diplome_statut: e.target.checked ? 'a_fournir' : 'fourni'})} className="rounded text-[#1F2957] focus:ring-[#D4DC53]" />
                  <span>Je fournirai mon diplôme plus tard</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Années d&apos;expérience</label>
                  <select name="annees_experience" value={formData.annees_experience} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none bg-white transition-all">
                    <option value="">Sélectionner...</option>
                    {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1} an{i > 0 ? 's' : ''}</option>)}
                    <option value="10+">Plus de 10 ans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Tarif de base indicatif (€/h)</label>
                  <input type="number" name="prix_base" placeholder="Ex: 50" value={formData.prix_base} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Ta personnalité en 3 mots (Max 50 car.)</label>
                <input type="text" name="personnalite" maxLength={50} placeholder="Ex: Dynamique, Bienveillant, Exigeant" value={formData.personnalite} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                <div className="text-right text-xs text-gray-400 mt-1">{formData.personnalite.length}/50</div>
              </div>

              {/* SECTION DISPONIBILITÉS (créneaux horaires dynamiques) */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <label className="block text-sm font-bold text-[#1F2957] mb-3">Disponibilités actuelles</label>
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" checked={horairesADefinir} onChange={() => setHorairesADefinir(true)} className="w-4 h-4 text-[#1F2957] focus:ring-[#D4DC53]" />
                    <span>A voir selon les propositions</span>
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

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Description / Ta plus-value pour te vendre !</label>
                <textarea name="description" rows={4} placeholder="Parle de ton matériel, de ton approche, pourquoi un client devrait te choisir toi..." value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
              </div>
            </div>
          )}

          {/* === ETAPE 3 : CONTACT === */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-[#1F2957] border-b pb-2">3. Informations de contact</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Email *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1F2957] mb-2">Téléphone *</label>
                  <input required type="tel" name="telephone" value={formData.telephone} onChange={handlePhoneChange} placeholder="06 12 34 56 78" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Réseau social principal (Lien Insta, LinkedIn...)</label>
                <input type="text" name="reseau_social" placeholder="https://instagram.com/..." value={formData.reseau_social} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Numéro de SIRET (Optionnel)</label>
                <input type="text" name="siret" placeholder="Ex: 123 456 789 00012" value={formData.siret} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all" />
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

              <div className="mt-8 space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[5.5rem] flex items-center">
                  <label className="flex items-start space-x-3 cursor-pointer w-full">
                    <input required type="checkbox" name="rc_pro" checked={formData.rc_pro} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-[#1F2957] focus:ring-[#D4DC53] flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      Je certifie posséder une Assurance Responsabilité Civile Professionnelle (RC Pro) valide.*
                    </span>
                  </label>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 min-h-[5.5rem] flex items-center">
                  <label className="flex items-start space-x-3 cursor-pointer w-full">
                    <input required type="checkbox" name="cgv_acceptees" checked={formData.cgv_acceptees} onChange={handleChange} className="mt-1 w-5 h-5 rounded text-[#1F2957] focus:ring-[#D4DC53] flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      J&apos;accepte les conditions générales de vente, les conditions générales d&apos;utilisation, et la politique de confidentialité concernant l&apos;usage de mes données.*
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="px-6 py-3 text-[#1F2957] font-bold hover:bg-gray-100 rounded-xl transition-colors">
                ← Retour
              </button>
            ) : <div></div>}

            {step < 3 ? (
              <button type="button" onClick={() => {
                if (step === 1) {
                  const missing: string[] = [];
                  if (!formData.prenom) missing.push('prenom');
                  if (!formData.nom) missing.push('nom');
                  if (!formData.date_naissance) missing.push('date_naissance');
                  if (missing.length > 0) {
                    setInvalidFields(new Set(missing));
                    setError("Veuillez remplir les champs obligatoires (*) avant de continuer.");
                    return;
                  }
                }
                if (step === 2 && formData.departements.length === 0) {
                  setInvalidFields(new Set(['departements']));
                  setError("Veuillez sélectionner au moins un département d'intervention.");
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
                {isSubmitting ? 'Envoi...' : 'Valider ma candidature ✓'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}