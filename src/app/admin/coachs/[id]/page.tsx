"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  DEPARTEMENTS_LIST as SHARED_DEPARTEMENTS_LIST,
  resolveDepartementsForRow,
  toDepartementsArray,
} from "@/lib/departements";

const DEPARTEMENTS_LIST = [...SHARED_DEPARTEMENTS_LIST];
const SPECIALITES_LIST = [
  "Activité douce", "Calisthénie", "Cardio", "Crossfit", "Cross-training",
  "Fitness général", "Danse", "Haltérophilie", "Circuit training", "Hyrox",
  "Les Mills", "Marche sportive", "Musculation", "Pilates", "Pole dance",
  "Santé et bien-être", "Vélo indoor", "Yoga", "Sports aquatiques",
  "Sports artistiques", "Sports cardio", "Sports collectifs", "Sports de combat",
  "Sports de glisse", "Sports de raquette", "Sports alternatifs", "Sports extrêmes", "Autres",
];
const TYPE_COURS_LIST = [
  "Coaching privé en salle", "En extérieur", "À domicile", "Cours collectif",
  "Coaching plateau", "Small group", "Teambuilding", "Préparateur & compétition",
  "Coach santé adapté", "Animation sportive", "Cours kids & teens",
  "Coach formateur", "Bien être et nutrition", "Mission spéciale", "Coaching en ligne",
];
const DIPLOMES_LIST = [
  "BPJEPS", "STAPS", "CQP", "Formation privée",
  "Autre diplôme spécialisé", "Diplôme bien être", "Étudiant",
];
const JOURS_SEMAINE = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

type CoachRecord = {
  id: string;
  nom: string | null;
  prenom: string | null;
  departements: string[] | null;
  specialites: string[] | null;
  type_cours: string[] | null;
  prix_base: number | null;
  telephone: string | null;
  email: string | null;
  date_naissance?: string | null;
  photo_url?: string | null;
  diplome?: string | null;
  diplome_statut?: string | null;
  annees_experience?: string | null;
  personnalite?: string | null;
  horaires_a_definir?: boolean | null;
  horaires_details?: { jour: string; debut: string; fin: string }[] | null;
  description?: string | null;
  reseau_social?: string | null;
  siret?: string | null;
  rc_pro?: boolean | null;
  connu_par?: string | null;
  cgv_acceptees?: boolean | null;
};

export default function AdminEditCoachPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deptInput, setDeptInput] = useState("");
  const [horairesADefinir, setHorairesADefinir] = useState(true);
  const [horairesList, setHorairesList] = useState<{ jour: string; debut: string; fin: string }[]>([{ jour: "Lundi", debut: "09:00", fin: "10:00" }]);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    date_naissance: "",
    photo_url: "",
    departements: [] as string[],
    specialites: [] as string[],
    autre_specialite: "",
    type_cours: [] as string[],
    diplomes: [] as string[],
    diplome_statut: "fourni",
    annees_experience: "",
    prix_base: "",
    personnalite: "",
    description: "",
    telephone: "",
    email: "",
    reseau_social: "",
    siret: "",
    rc_pro: false,
    connu_par: "",
    cgv_acceptees: false,
  });

  useEffect(() => {
    if (!id) return;
    async function fetchCoach() {
      setLoading(true);
      const { data, error: fetchError } = await supabase.from("coachs").select("*").eq("id", id).single();
      if (fetchError || !data) {
        setError("Coach introuvable.");
        setLoading(false);
        return;
      }
      const c = data as CoachRecord;
      const departements = resolveDepartementsForRow(c.departements);
      const specialites = c.specialites ?? [];
      const autreSpec = specialites.find((s) => s.startsWith("Autres :"));
      const specialitesSansAutres = autreSpec
        ? specialites.filter((s) => s !== autreSpec).concat("Autres")
        : specialites;
      const autre_specialite = autreSpec ? autreSpec.replace(/^Autres :\s*/, "") : "";

      setFormData({
        nom: c.nom ?? "",
        prenom: c.prenom ?? "",
        date_naissance: c.date_naissance ? c.date_naissance.slice(0, 10) : "",
        photo_url: c.photo_url ?? "",
        departements,
        specialites: specialitesSansAutres,
        autre_specialite,
        type_cours: c.type_cours ?? [],
        diplomes: (c.diplome ?? "").split(",").map((s) => s.trim()).filter(Boolean),
        diplome_statut: (c.diplome_statut as string) ?? "fourni",
        annees_experience: c.annees_experience ?? "",
        prix_base: c.prix_base != null ? String(c.prix_base) : "",
        personnalite: c.personnalite ?? "",
        description: c.description ?? "",
        telephone: c.telephone ?? "",
        email: c.email ?? "",
        reseau_social: c.reseau_social ?? "",
        siret: c.siret ?? "",
        rc_pro: !!c.rc_pro,
        connu_par: c.connu_par ?? "",
        cgv_acceptees: !!c.cgv_acceptees,
      });
      setHorairesADefinir(c.horaires_a_definir ?? true);
      setHorairesList(
        Array.isArray(c.horaires_details) && c.horaires_details.length > 0
          ? c.horaires_details
          : [{ jour: "Lundi", debut: "09:00", fin: "10:00" }]
      );
      setLoading(false);
    }
    fetchCoach();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 10) val = val.substring(0, 10);
    const formatted = val.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
    setFormData((prev) => ({ ...prev, telephone: formatted }));
  };

  const handleDeptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 2) setDeptInput(val);
  };
  const handleAddDept = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!deptInput) return;
    const formattedDept = deptInput.padStart(2, "0");
    if (DEPARTEMENTS_LIST.includes(formattedDept) && !formData.departements.includes(formattedDept)) {
      setFormData((prev) => ({ ...prev, departements: [...prev.departements, formattedDept] }));
      setDeptInput("");
    }
  };
  const handleRemoveDept = (deptToRemove: string) => {
    setFormData((prev) => ({ ...prev, departements: prev.departements.filter((d) => d !== deptToRemove) }));
  };

  const handleArrayChange = (category: "specialites" | "type_cours" | "diplomes", value: string) => {
    setFormData((prev) => {
      const currentList = prev[category];
      if (currentList.includes(value)) {
        return { ...prev, [category]: currentList.filter((item) => item !== value) };
      }
      return { ...prev, [category]: [...currentList, value] };
    });
  };

  const addHoraire = () => setHorairesList([...horairesList, { jour: "Lundi", debut: "09:00", fin: "10:00" }]);
  const removeHoraire = (index: number) => setHorairesList(horairesList.filter((_, i) => i !== index));
  const updateHoraire = (index: number, field: string, value: string) => {
    const newHoraires = [...horairesList];
    newHoraires[index] = { ...newHoraires[index], [field]: value };
    setHorairesList(newHoraires);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const prixNumeric = parseFloat(formData.prix_base);
    const finalSpecialites = formData.specialites.map((s) =>
      s === "Autres" && formData.autre_specialite ? `Autres : ${formData.autre_specialite}` : s
    );
    const payload = {
      nom: formData.nom || null,
      prenom: formData.prenom || null,
      date_naissance: formData.date_naissance || null,
      photo_url: formData.photo_url || null,
      departements: [...toDepartementsArray(formData.departements)],
      specialites: finalSpecialites,
      type_cours: formData.type_cours,
      diplome: formData.diplomes.length ? formData.diplomes.join(", ") : null,
      diplome_statut: formData.diplome_statut || null,
      annees_experience: formData.annees_experience || null,
      prix_base: Number.isNaN(prixNumeric) ? null : prixNumeric,
      personnalite: formData.personnalite || null,
      horaires_a_definir: horairesADefinir,
      horaires_details: horairesADefinir ? null : horairesList,
      description: formData.description || null,
      telephone: formData.telephone || null,
      email: formData.email || null,
      reseau_social: formData.reseau_social || null,
      siret: formData.siret || null,
      rc_pro: formData.rc_pro,
      connu_par: formData.connu_par || null,
      cgv_acceptees: formData.cgv_acceptees,
    };
    const { error: updateError } = await supabase.from("coachs").update(payload).eq("id", id);
    if (updateError) {
      setError("Erreur lors de l'enregistrement.");
      setSaving(false);
      return;
    }
    setSuccess(true);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F0EB] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1F2957]/20 border-t-[#1F2957] rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !formData.prenom) {
    return (
      <div className="min-h-screen bg-[#F3F0EB] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Link href="/admin" className="text-[#1F2957] font-bold hover:underline">
            ← Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F3F0EB] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">✓</div>
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">Fiche coach enregistrée</h2>
          <Link
            href="/admin"
            className="inline-block bg-[#1F2957] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#151c3d] transition-colors"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0EB]">
      <header className="bg-[#1F2957] text-white py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Modifier la fiche coach</h1>
          <Link
            href="/admin"
            className="text-[#D4DC53] hover:text-[#D4DC53]/80 text-sm font-medium"
          >
            ← Retour au tableau de bord
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* 1. Identité */}
          <section className="bg-white rounded-2xl p-6 shadow-md border border-[#1F2957]/10">
            <h2 className="text-lg font-bold text-[#1F2957] border-b pb-2 mb-4">1. Identité</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] focus:ring-2 focus:ring-[#D4DC53] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] focus:ring-2 focus:ring-[#D4DC53] outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Date de naissance</label>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                className="w-full md:max-w-xs px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] focus:ring-2 focus:ring-[#D4DC53] outline-none"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Photo (URL)</label>
              <input
                type="text"
                name="photo_url"
                value={formData.photo_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] focus:ring-2 focus:ring-[#D4DC53] outline-none"
              />
              {formData.photo_url && (
                <div className="mt-2 w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  <img src={formData.photo_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </section>

          {/* 2. Zone & Pro */}
          <section className="bg-white rounded-2xl p-6 shadow-md border border-[#1F2957]/10">
            <h2 className="text-lg font-bold text-[#1F2957] border-b pb-2 mb-4">2. Zone d'intervention & Profil pro</h2>
            <div>
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Départements</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={deptInput}
                  onChange={handleDeptInputChange}
                  onKeyDown={(e) => (e.key === "Enter" ? handleAddDept(e) : null)}
                  placeholder="Ex: 75, 92..."
                  className="flex-1 px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] focus:ring-2 focus:ring-[#D4DC53] outline-none"
                />
                <button type="button" onClick={handleAddDept} className="px-6 py-3 bg-[#1F2957] text-white font-bold rounded-xl hover:bg-[#151c3d]">
                  Ajouter
                </button>
              </div>
              {formData.departements.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.departements.map((dep) => (
                    <span
                      key={dep}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#D4DC53] text-[#1F2957] text-sm font-bold rounded-full"
                    >
                      {dep}
                      <button type="button" onClick={() => handleRemoveDept(dep)} className="hover:text-red-600">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Spécialités</label>
              <div className="max-h-48 overflow-y-auto p-4 border border-[#1F2957]/20 rounded-xl bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SPECIALITES_LIST.map((spec) => (
                  <label key={spec} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.specialites.includes(spec)}
                      onChange={() => handleArrayChange("specialites", spec)}
                      className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]"
                    />
                    <span>{spec}</span>
                  </label>
                ))}
              </div>
              {formData.specialites.includes("Autres") && (
                <input
                  type="text"
                  name="autre_specialite"
                  placeholder="Précisez..."
                  value={formData.autre_specialite}
                  onChange={handleChange}
                  className="mt-2 w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
                />
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Types de cours</label>
              <div className="max-h-48 overflow-y-auto p-4 border border-[#1F2957]/20 rounded-xl bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TYPE_COURS_LIST.map((type) => (
                  <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.type_cours.includes(type)}
                      onChange={() => handleArrayChange("type_cours", type)}
                      className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Diplômes (plusieurs choix possibles)</label>
              <div className="max-h-48 overflow-y-auto p-4 border border-[#1F2957]/20 rounded-xl bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIPLOMES_LIST.map((d) => (
                  <label key={d} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.diplomes.includes(d)}
                      onChange={() => handleArrayChange("diplomes", d)}
                      className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]"
                    />
                    <span>{d}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Statut diplôme</label>
              <select
                name="diplome_statut"
                value={formData.diplome_statut}
                onChange={handleChange}
                className="w-full md:max-w-xs px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] bg-white"
              >
                <option value="fourni">Fourni</option>
                <option value="a_fournir">À fournir</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Années d'expérience</label>
                <select
                  name="annees_experience"
                  value={formData.annees_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] bg-white"
                >
                  <option value="">Sélectionner...</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} an{i > 0 ? "s" : ""}</option>
                  ))}
                  <option value="10+">Plus de 10 ans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Tarif de base (€/h)</label>
                <input
                  type="number"
                  name="prix_base"
                  value={formData.prix_base}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Personnalité (3 mots, 50 car. max)</label>
              <input
                type="text"
                name="personnalite"
                maxLength={50}
                value={formData.personnalite}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
              />
              <span className="text-xs text-gray-500">{formData.personnalite.length}/50</span>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Disponibilités</label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={horairesADefinir}
                    onChange={() => setHorairesADefinir(true)}
                    className="w-4 h-4 text-[#1F2957] focus:ring-[#D4DC53]"
                  />
                  <span>À définir</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!horairesADefinir}
                    onChange={() => setHorairesADefinir(false)}
                    className="w-4 h-4 text-[#1F2957] focus:ring-[#D4DC53]"
                  />
                  <span>Créneaux spécifiques</span>
                </label>
              </div>
              {!horairesADefinir && (
                <div className="space-y-2">
                  {horairesList.map((h, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <select
                        value={h.jour}
                        onChange={(e) => updateHoraire(i, "jour", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[#1F2957]/20 bg-white"
                      >
                        {JOURS_SEMAINE.map((j) => (
                          <option key={j} value={j}>{j}</option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={h.debut}
                        onChange={(e) => updateHoraire(i, "debut", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[#1F2957]/20"
                      />
                      <span>à</span>
                      <input
                        type="time"
                        value={h.fin}
                        onChange={(e) => updateHoraire(i, "fin", e.target.value)}
                        className="px-3 py-2 rounded-lg border border-[#1F2957]/20"
                      />
                      {horairesList.length > 1 && (
                        <button type="button" onClick={() => removeHoraire(i)} className="text-red-600 hover:underline">
                          Retirer
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addHoraire} className="text-[#1F2957] font-bold text-sm hover:underline">
                    + Ajouter un créneau
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
              />
            </div>
          </section>

          {/* 3. Contact */}
          <section className="bg-white rounded-2xl p-6 shadow-md border border-[#1F2957]/10">
            <h2 className="text-lg font-bold text-[#1F2957] border-b pb-2 mb-4">3. Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1F2957] mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Réseau social (lien)</label>
              <input
                type="text"
                name="reseau_social"
                value={formData.reseau_social}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">SIRET</label>
              <input
                type="text"
                name="siret"
                value={formData.siret}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957]"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-bold text-[#1F2957] mb-2">Connu par</label>
              <select
                name="connu_par"
                value={formData.connu_par}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] bg-white"
              >
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
            <div className="mt-4 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rc_pro"
                  checked={formData.rc_pro}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]"
                />
                <span className="text-sm">RC Pro</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="cgv_acceptees"
                  checked={formData.cgv_acceptees}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-[#1F2957] focus:ring-[#D4DC53]"
                />
                <span className="text-sm">CGV acceptées</span>
              </label>
            </div>
          </section>

          <div className="flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-[#D4DC53] text-[#1F2957] font-bold rounded-xl hover:bg-[#c4cc43] disabled:opacity-50"
            >
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
            <Link
              href="/admin"
              className="px-8 py-3 bg-white border border-[#1F2957]/30 text-[#1F2957] font-bold rounded-xl hover:bg-gray-50"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
