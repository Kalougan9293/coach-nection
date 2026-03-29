"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

type DemandeRecord = {
  id: string;
  titre_annonce: string | null;
  type_demandeur: string | null;
  ville: string | null;
  specialites: string[] | null;
  type_cours: string[] | null;
  statut: string | null;
  horaires_a_definir?: boolean | null;
  horaires_details?: { jour: string; debut: string; fin: string }[] | null;
  horaires_frequence?: string | null;
  diplome_requis?: string | null;
  type_contrat?: string | null;
  tarif_propose?: number | null;
  description?: string | null;
  profil_recherche?: string | null;
  budget_recherche?: number | null;
  nom_contact?: string | null;
  contact_email?: string | null;
  contact_telephone?: string | null;
  contact_reseau?: string | null;
  siret?: string | null;
  connu_par?: string | null;
  cgv_acceptees?: boolean | null;
};

export default function AdminEditAnnoncePage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [horairesADefinir, setHorairesADefinir] = useState(true);
  const [horairesList, setHorairesList] = useState<{ jour: string; debut: string; fin: string }[]>([{ jour: "Lundi", debut: "09:00", fin: "10:00" }]);
  const [horairesFrequence, setHorairesFrequence] = useState<"ponctuel" | "fixe" | null>(null);

  const [formData, setFormData] = useState({
    titre_annonce: "",
    type_demandeur: "",
    ville: "",
    specialite_recherchee: "",
    autre_specialite: "",
    type_cours: "",
    statut: "en_cours",
    type_contrat: "",
    diplome_requis: "",
    tarif_propose: "",
    description: "",
    profil_recherche: "",
    budget_recherche: 0,
    nom_contact: "",
    contact_email: "",
    contact_telephone: "",
    contact_reseau: "",
    siret: "",
    connu_par: "",
    cgv_acceptees: false,
  });

  useEffect(() => {
    if (!id) return;
    async function fetchDemande() {
      setLoading(true);
      const { data, error: fetchError } = await supabase.from("demandes").select("*").eq("id", id).single();
      if (fetchError || !data) {
        setError("Annonce introuvable.");
        setLoading(false);
        return;
      }
      const d = data as DemandeRecord;
      const specialites = d.specialites ?? [];
      const autreSpec = specialites.find((s) => s.startsWith("Autres :"));
      const specialite_recherchee = autreSpec ? "Autres" : (specialites[0] ?? "");
      const autre_specialite = autreSpec ? autreSpec.replace(/^Autres :\s*/, "") : "";
      const type_cours = Array.isArray(d.type_cours) && d.type_cours[0] ? d.type_cours[0] : "";

      setFormData({
        titre_annonce: d.titre_annonce ?? "",
        type_demandeur: d.type_demandeur ?? "",
        ville: d.ville ?? "",
        specialite_recherchee,
        autre_specialite,
        type_cours,
        statut: d.statut === "trouve" ? "trouve" : "en_cours",
        type_contrat: d.type_contrat ?? "",
        diplome_requis: d.diplome_requis ?? "",
        tarif_propose: d.tarif_propose != null ? String(d.tarif_propose) : "",
        description: d.description ?? "",
        profil_recherche: d.profil_recherche ?? "",
        budget_recherche: d.budget_recherche ?? 0,
        nom_contact: d.nom_contact ?? "",
        contact_email: d.contact_email ?? "",
        contact_telephone: d.contact_telephone ?? "",
        contact_reseau: d.contact_reseau ?? "",
        siret: d.siret ?? "",
        connu_par: d.connu_par ?? "",
        cgv_acceptees: !!d.cgv_acceptees,
      });
      setHorairesADefinir(d.horaires_a_definir ?? true);
      setHorairesList(
        Array.isArray(d.horaires_details) && d.horaires_details.length > 0
          ? d.horaires_details
          : [{ jour: "Lundi", debut: "09:00", fin: "10:00" }]
      );
      const hf = d.horaires_frequence;
      setHorairesFrequence(hf === "ponctuel" || hf === "fixe" ? hf : null);
      setLoading(false);
    }
    fetchDemande();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      const val = name === "budget_recherche" ? parseInt(value, 10) || 0 : value;
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const addHoraire = () => setHorairesList([...horairesList, { jour: "Lundi", debut: "09:00", fin: "10:00" }]);
  const removeHoraire = (i: number) => setHorairesList(horairesList.filter((_, idx) => idx !== i));
  const updateHoraire = (i: number, field: string, value: string) => {
    const next = [...horairesList];
    next[i] = { ...next[i], [field]: value };
    setHorairesList(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const tarifNum = parseFloat(formData.tarif_propose);
    const specialites =
      formData.specialite_recherchee === "Autres" && formData.autre_specialite
        ? [`Autres : ${formData.autre_specialite}`]
        : formData.specialite_recherchee
          ? [formData.specialite_recherchee]
          : [];
    const type_cours = formData.type_cours ? [formData.type_cours] : [];

    const payload = {
      titre_annonce: formData.titre_annonce || null,
      type_demandeur: formData.type_demandeur || null,
      ville: formData.ville || null,
      specialites,
      type_cours,
      statut: formData.statut,
      horaires_a_definir: horairesADefinir,
      horaires_details: horairesADefinir ? null : horairesList,
      horaires_frequence: horairesFrequence,
      diplome_requis: formData.diplome_requis || null,
      type_contrat: formData.type_contrat || null,
      tarif_propose: Number.isNaN(tarifNum) ? null : tarifNum,
      description: formData.description || null,
      profil_recherche: formData.profil_recherche || null,
      budget_recherche: formData.budget_recherche,
      nom_contact: formData.nom_contact || null,
      contact_email: formData.contact_email || null,
      contact_telephone: formData.contact_telephone || null,
      contact_reseau: formData.contact_reseau || null,
      siret: formData.siret || null,
      connu_par: formData.connu_par || null,
      cgv_acceptees: formData.cgv_acceptees,
    };

    const { error: updateError } = await supabase.from("demandes").update(payload).eq("id", id);
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

  if (error && !formData.titre_annonce) {
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
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">Annonce enregistrée</h2>
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

  const inputClass = "w-full px-4 py-3 rounded-xl border border-[#1F2957]/20 text-[#1F2957] focus:ring-2 focus:ring-[#D4DC53] outline-none bg-white";
  const labelClass = "block text-sm font-bold text-[#1F2957] mb-2";

  return (
    <div className="min-h-screen bg-[#F3F0EB]">
      <header className="bg-[#1F2957] text-white py-4 px-6 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Modifier l&apos;annonce</h1>
          <Link href="/admin" className="text-[#D4DC53] hover:text-[#D4DC53]/80 text-sm font-medium">
            ← Retour au tableau de bord
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">{error}</div>}

          <section className="bg-white rounded-2xl p-6 shadow-md border border-[#1F2957]/10">
            <h2 className="text-lg font-bold text-[#1F2957] border-b pb-2 mb-4">1. Annonce</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Type demandeur *</label>
                <select name="type_demandeur" value={formData.type_demandeur} onChange={handleChange} className={inputClass}>
                  <option value="">Sélectionner...</option>
                  <option value="particulier">Un particulier</option>
                  <option value="entreprise">Une structure (salle, asso, entreprise)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Titre de l&apos;annonce *</label>
                <input type="text" name="titre_annonce" value={formData.titre_annonce} onChange={handleChange} maxLength={50} className={inputClass} />
                <p className="text-xs text-gray-500 mt-1">{formData.titre_annonce.length}/50</p>
              </div>
              <div>
                <label className={labelClass}>Lieu (Ville / Quartier) *</label>
                <input type="text" name="ville" value={formData.ville} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Spécialité recherchée *</label>
                <select name="specialite_recherchee" value={formData.specialite_recherchee} onChange={handleChange} className={inputClass}>
                  <option value="">Sélectionner...</option>
                  {SPECIALITES_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {formData.specialite_recherchee === "Autres" && (
                  <input type="text" name="autre_specialite" value={formData.autre_specialite} onChange={handleChange} placeholder="Précisez..." className={`${inputClass} mt-2`} />
                )}
              </div>
              <div>
                <label className={labelClass}>Type de cours *</label>
                <select name="type_cours" value={formData.type_cours} onChange={handleChange} className={inputClass}>
                  <option value="">Sélectionner...</option>
                  {TYPE_COURS_LIST.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Statut</label>
                <select name="statut" value={formData.statut} onChange={handleChange} className={inputClass}>
                  <option value="en_cours">⏳ En cours</option>
                  <option value="trouve">✅ Trouvé !</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Type de contrat</label>
                  <select name="type_contrat" value={formData.type_contrat} onChange={handleChange} className={inputClass}>
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
                  <label className={labelClass}>Diplôme requis</label>
                  <select name="diplome_requis" value={formData.diplome_requis} onChange={handleChange} className={inputClass}>
                    <option value="">Peu importe...</option>
                    {DIPLOMES_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Tarif proposé (€/h)</label>
                  <input type="number" name="tarif_propose" value={formData.tarif_propose} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Horaires souhaités</label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={horairesADefinir} onChange={() => setHorairesADefinir(true)} className="w-4 h-4" />
                    <span>À définir ensemble</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={!horairesADefinir} onChange={() => setHorairesADefinir(false)} className="w-4 h-4" />
                    <span>Créneaux spécifiques</span>
                  </label>
                </div>
                {!horairesADefinir && (
                  <div className="space-y-2">
                    {horairesList.map((h, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2 bg-gray-50 p-3 rounded-lg">
                        <select value={h.jour} onChange={(e) => updateHoraire(i, "jour", e.target.value)} className="px-3 py-2 rounded-lg border bg-white">
                          {JOURS_SEMAINE.map((j) => (
                            <option key={j} value={j}>{j}</option>
                          ))}
                        </select>
                        <input type="time" value={h.debut} onChange={(e) => updateHoraire(i, "debut", e.target.value)} className="px-3 py-2 rounded-lg border" />
                        <span>à</span>
                        <input type="time" value={h.fin} onChange={(e) => updateHoraire(i, "fin", e.target.value)} className="px-3 py-2 rounded-lg border" />
                        {horairesList.length > 1 && (
                          <button type="button" onClick={() => removeHoraire(i)} className="text-red-600 hover:underline text-sm">
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
                <div className="pt-3 mt-3 border-t border-gray-200">
                  <p className="text-xs text-[#1F2957]/70 mb-2">Optionnel</p>
                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={horairesFrequence === "ponctuel"}
                        onChange={() =>
                          setHorairesFrequence((prev) => (prev === "ponctuel" ? null : "ponctuel"))
                        }
                        className="w-4 h-4 rounded"
                      />
                      <span>Ponctuel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={horairesFrequence === "fixe"}
                        onChange={() =>
                          setHorairesFrequence((prev) => (prev === "fixe" ? null : "fixe"))
                        }
                        className="w-4 h-4 rounded"
                      />
                      <span>Fixe</span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClass}>Description complète *</label>
                <textarea name="description" rows={5} value={formData.description} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Profil / Expérience recherchée</label>
                <textarea name="profil_recherche" rows={3} value={formData.profil_recherche} onChange={handleChange} className={inputClass} />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-md border border-[#1F2957]/10">
            <h2 className="text-lg font-bold text-[#1F2957] border-b pb-2 mb-4">2. Contact & Budget</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Nom structure / Contact *</label>
                <input type="text" name="nom_contact" value={formData.nom_contact} onChange={handleChange} className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Téléphone</label>
                  <input type="tel" name="contact_telephone" value={formData.contact_telephone} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Réseau social (lien)</label>
                <input type="text" name="contact_reseau" value={formData.contact_reseau} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>SIRET</label>
                <input type="text" name="siret" value={formData.siret} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Connu par</label>
                <select name="connu_par" value={formData.connu_par} onChange={handleChange} className={inputClass}>
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
              <div>
                <label className={labelClass}>Budget recherche (€)</label>
                <input type="range" name="budget_recherche" min={0} max={150} step={10} value={formData.budget_recherche} onChange={handleChange} className="w-full" />
                <p className="text-sm text-[#1F2957]/80 mt-1">{formData.budget_recherche === 150 ? "150€ ou plus" : `${formData.budget_recherche}€`}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="cgv_acceptees" checked={formData.cgv_acceptees} onChange={handleChange} className="w-4 h-4 rounded" />
                  <span className="text-sm">CGV acceptées</span>
                </label>
              </div>
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
            <Link href="/admin" className="px-8 py-3 bg-white border border-[#1F2957]/30 text-[#1F2957] font-bold rounded-xl hover:bg-gray-50">
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
