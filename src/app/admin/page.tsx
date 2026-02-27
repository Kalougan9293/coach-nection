"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const COACHS_PER_PAGE = 20;

type Tab = "coachs" | "annonces" | "stats" | "devis";

type DevisRow = {
  id: string;
  nom_client: string | null;
  montant: number | null;
  statut: string | null;
  created_at?: string;
};

type CoachRow = {
  id: string;
  nom: string | null;
  prenom: string | null;
  ville: string | null;
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
  created_at?: string;
};

type DemandeRow = {
  id: string;
  titre_annonce: string | null;
  ville: string | null;
  specialites: string[] | null;
  nom_contact: string | null;
  contact_email: string | null;
  contact_telephone: string | null;
  statut: string | null;
  created_at?: string;
  [key: string]: unknown;
};

/** Liste des départements français pour le filtre (01-95) */
const DEPARTEMENTS_OPTIONS = Array.from({ length: 95 }, (_, i) => (i + 1).toString().padStart(2, "0"));

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("coachs");
  const [coachs, setCoachs] = useState<CoachRow[]>([]);
  const [demandes, setDemandes] = useState<DemandeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>("");
  const [coachPage, setCoachPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedCoachId, setExpandedCoachId] = useState<string | null>(null);
  const [expandedAnnonceId, setExpandedAnnonceId] = useState<string | null>(null);
  const [devis, setDevis] = useState<DevisRow[]>([]);
  const [devisLoading, setDevisLoading] = useState(false);
  const [devisForm, setDevisForm] = useState({ nom_client: "", montant: "", statut: "Proposition envoyée" });
  const [annonceStatutFilter, setAnnonceStatutFilter] = useState<"en_cours" | "trouve">("en_cours");

  useEffect(() => {
    async function fetchInitial() {
      setLoading(true);
      const [cRes, dRes, devisRes] = await Promise.all([
        supabase.from("coachs").select("*").order("created_at", { ascending: false }),
        supabase.from("demandes").select("*").order("created_at", { ascending: false }),
        supabase.from("suivi_devis").select("*").order("created_at", { ascending: false }),
      ]);
      if (cRes.data) setCoachs(cRes.data as CoachRow[]);
      if (dRes.data) setDemandes(dRes.data as DemandeRow[]);
      if (devisRes.data) setDevis(devisRes.data as DevisRow[]);
      setLoading(false);
    }
    fetchInitial();
  }, []);

  useEffect(() => {
    const coachChannel = supabase
      .channel("coachs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "coachs" },
        () => {
          supabase.from("coachs").select("*").order("created_at", { ascending: false }).then(({ data }) => {
            if (data) setCoachs(data as CoachRow[]);
          });
        }
      )
      .subscribe();

    const demandesChannel = supabase
      .channel("demandes-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "demandes" },
        () => {
          supabase.from("demandes").select("*").order("created_at", { ascending: false }).then(({ data }) => {
            if (data) setDemandes(data as DemandeRow[]);
          });
        }
      )
      .subscribe();

    const devisChannel = supabase
      .channel("devis-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "suivi_devis" },
        () => {
          supabase.from("suivi_devis").select("*").order("created_at", { ascending: false }).then(({ data }) => {
            if (data) setDevis(data as DevisRow[]);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coachChannel);
      supabase.removeChannel(demandesChannel);
      supabase.removeChannel(devisChannel);
    };
  }, []);

  const filteredCoachs = useMemo(() => {
    let list = coachs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => {
        const nom = [c.prenom, c.nom].filter(Boolean).join(" ").toLowerCase();
        const ville = (c.ville ?? "").toLowerCase();
        const specs = (c.specialites ?? []).join(" ").toLowerCase();
        return nom.includes(q) || ville.includes(q) || specs.includes(q);
      });
    }
    if (filterDept) {
      list = list.filter((c) => {
        const depts = (c.ville ?? "").split(",").map((p) => p.trim()).filter(Boolean);
        return depts.includes(filterDept);
      });
    }
    return list;
  }, [coachs, search, filterDept]);

  const filteredDemandes = useMemo(
    () =>
      demandes.filter((d) =>
        annonceStatutFilter === "trouve" ? d.statut === "trouve" : d.statut !== "trouve"
      ),
    [demandes, annonceStatutFilter]
  );

  const totalCoachPages = Math.max(1, Math.ceil(filteredCoachs.length / COACHS_PER_PAGE));
  const paginatedCoachs = useMemo(
    () => filteredCoachs.slice((coachPage - 1) * COACHS_PER_PAGE, coachPage * COACHS_PER_PAGE),
    [filteredCoachs, coachPage]
  );

  useEffect(() => {
    setCoachPage(1);
  }, [search, filterDept]);

  const setStatut = async (id: string, statut: string) => {
    setUpdatingId(id);
    await supabase.from("demandes").update({ statut }).eq("id", id);
    setUpdatingId(null);
  };

  const deleteCoach = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce profil coach ?")) return;
    setUpdatingId(id);
    await supabase.from("coachs").delete().eq("id", id);
    setCoachs((prev) => prev.filter((c) => c.id !== id));
    if (expandedCoachId === id) setExpandedCoachId(null);
    setUpdatingId(null);
  };

  const deleteAnnonce = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette annonce ?")) return;
    setUpdatingId(id);
    await supabase.from("demandes").delete().eq("id", id);
    setDemandes((prev) => prev.filter((d) => d.id !== id));
    if (expandedAnnonceId === id) setExpandedAnnonceId(null);
    setUpdatingId(null);
  };

  const formatHorairesDemande = (d: DemandeRow) => {
    if ((d as { horaires_a_definir?: boolean }).horaires_a_definir) return "À définir";
    const details = (d as { horaires_details?: { jour: string; debut: string; fin: string }[] }).horaires_details;
    if (!Array.isArray(details) || details.length === 0) return "—";
    return details.map((h) => `${h.jour} ${h.debut}–${h.fin}`).join(" ; ");
  };

  const budgetDisplay = (d: DemandeRow) => {
    const b = (d as { budget_recherche?: number }).budget_recherche;
    if (b == null) return "—";
    return b >= 150 ? "150€ ou plus" : `${b}€`;
  };

  const formatSpecs = (s: string[] | null) => (Array.isArray(s) ? s.join(", ") : s ?? "—");
  const formatTypeCours = (t: string[] | null) => (Array.isArray(t) ? t.join(", ") : t ?? "—");
  const formatSpecsShort = (s: string[] | null) => {
    if (!Array.isArray(s) || s.length === 0) return "—";
    if (s.length <= 3) return s.join(", ");
    const rest = s.length - 3;
    return `${s.slice(0, 3).join(", ")} ... (+ ${rest} autre${rest > 1 ? "s" : ""})`;
  };
  const formatTypeCoursShort = (t: string[] | null) => {
    if (!Array.isArray(t) || t.length === 0) return "—";
    if (t.length <= 3) return t.join(", ");
    const rest = t.length - 3;
    return `${t.slice(0, 3).join(", ")} ... (+ ${rest} autre${rest > 1 ? "s" : ""})`;
  };
  const formatHoraires = (c: CoachRow) => {
    if (c.horaires_a_definir) return "À définir";
    const details = c.horaires_details;
    if (!Array.isArray(details) || details.length === 0) return "—";
    return details.map((h) => `${h.jour} ${h.debut}–${h.fin}`).join(" ; ");
  };
  const formatDateNaissance = (d: string | null | undefined) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-[#F3F0EB]">
      <header className="bg-[#1F2957] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Tableau de bord Admin</h1>
          <Link
            href="/"
            className="text-[#D4DC53] hover:text-[#D4DC53]/80 text-sm font-medium flex items-center gap-2"
          >
            Retour au site
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 border-b border-[#1F2957]/10">
          <button
            onClick={() => setTab("coachs")}
            className={`px-4 py-3 font-medium rounded-t-lg transition-colors ${
              tab === "coachs"
                ? "bg-[#1F2957] text-white"
                : "bg-white/60 text-[#1F2957] hover:bg-white"
            }`}
          >
            Coachs
          </button>
          <button
            onClick={() => setTab("annonces")}
            className={`px-4 py-3 font-medium rounded-t-lg transition-colors ${
              tab === "annonces"
                ? "bg-[#1F2957] text-white"
                : "bg-white/60 text-[#1F2957] hover:bg-white"
            }`}
          >
            Annonces
          </button>
          <button
            onClick={() => setTab("stats")}
            className={`px-4 py-3 font-medium rounded-t-lg transition-colors ${
              tab === "stats"
                ? "bg-[#1F2957] text-white"
                : "bg-white/60 text-[#1F2957] hover:bg-white"
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setTab("devis")}
            className={`px-4 py-3 font-medium rounded-t-lg transition-colors ${
              tab === "devis"
                ? "bg-[#1F2957] text-white"
                : "bg-white/60 text-[#1F2957] hover:bg-white"
            }`}
          >
            Devis
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#1F2957]/20 border-t-[#1F2957] rounded-full animate-spin" />
            <p className="mt-4 text-[#1F2957] font-medium">Chargement des données...</p>
          </div>
        ) : (
          <>
            {tab === "coachs" && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <input
                    type="search"
                    placeholder="Rechercher par nom, ville ou spécialité..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 max-w-md px-4 py-3 rounded-xl border border-[#1F2957]/20 bg-white text-[#1F2957] placeholder:text-[#1F2957]/50 focus:ring-2 focus:ring-[#D4DC53] focus:border-[#1F2957]/30 outline-none transition-all"
                  />
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-[#1F2957]/20 bg-white text-[#1F2957] focus:ring-2 focus:ring-[#D4DC53] outline-none transition-all min-w-[12rem]"
                  >
                    <option value="">Tous les départements</option>
                    {DEPARTEMENTS_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        Département {d}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-sm text-[#1F2957]/70 mb-4">
                  {filteredCoachs.length} coach{filteredCoachs.length !== 1 ? "s" : ""} trouvé
                  {filteredCoachs.length > COACHS_PER_PAGE
                    ? ` • Page ${coachPage} sur ${totalCoachPages}`
                    : ""}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedCoachs.map((c) => {
                    const isExpanded = expandedCoachId === c.id;
                    return (
                      <div
                        key={c.id}
                        className="bg-white rounded-2xl p-5 shadow-md border border-[#1F2957]/10 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex gap-4 mb-3">
                          <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gray-200">
                            {c.photo_url ? (
                              <img
                                src={c.photo_url}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                width={56}
                                height={56}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 rounded-full" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-[#1F2957] text-lg">{c.prenom ?? "—"}</h3>
                            <p className="text-sm text-[#1F2957]/80">
                              <span className="font-medium">Localité :</span> {c.ville ?? "—"}
                            </p>
                            <p className="text-sm text-[#1F2957]/80">
                              <span className="font-medium">Spécialités :</span> {formatSpecsShort(c.specialites)}
                            </p>
                            <p className="text-sm text-[#1F2957]/80">
                              <span className="font-medium">Types de coaching :</span> {formatTypeCoursShort(c.type_cours)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExpandedCoachId(isExpanded ? null : c.id)}
                          className="text-sm font-medium text-[#1F2957] hover:text-[#D4DC53] transition-colors"
                        >
                          {isExpanded ? "Voir moins ↑" : "Voir plus ↓"}
                        </button>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-[#1F2957]/10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <p><span className="font-medium text-[#1F2957]">Nom complet :</span> {[c.prenom, c.nom].filter(Boolean).join(" ") || "—"}</p>
                            <p><span className="font-medium text-[#1F2957]">Date de naissance :</span> {formatDateNaissance(c.date_naissance)}</p>
                            <p><span className="font-medium text-[#1F2957]">Diplôme :</span> {c.diplome ?? "—"}</p>
                            <p><span className="font-medium text-[#1F2957]">Statut diplôme :</span> {c.diplome_statut ?? "—"}</p>
                            <p><span className="font-medium text-[#1F2957]">Années d&apos;expérience :</span> {c.annees_experience ?? "—"}</p>
                            <p><span className="font-medium text-[#1F2957]">Personnalité :</span> {c.personnalite ?? "—"}</p>
                            <p><span className="font-medium text-[#1F2957]">Tarifs :</span> {c.prix_base != null ? `${c.prix_base} €` : "—"}</p>
                            <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Horaires :</span> {formatHoraires(c)}</p>
                            <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Spécialités :</span> {formatSpecs(c.specialites)}</p>
                            <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Types de coaching :</span> {formatTypeCours(c.type_cours)}</p>
                            <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Description :</span> {c.description ?? "—"}</p>
                            <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Email :</span> <span className="break-all">{c.email ?? "—"}</span></p>
                            <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Téléphone :</span> {c.telephone ?? "—"}</p>
                            <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Réseaux sociaux :</span> <span className="break-all">{c.reseau_social ?? "—"}</span></p>
                            <p><span className="font-medium text-[#1F2957]">SIRET :</span> {c.siret ?? "—"}</p>
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-t border-[#1F2957]/10 flex flex-col gap-2">
                          <Link
                            href={`/admin/coachs/${c.id}`}
                            className="w-full py-2 text-sm font-medium rounded-lg bg-[#1F2957] text-white hover:bg-[#151c3d] transition-colors text-center"
                          >
                            ✏️ Modifier la fiche
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteCoach(c.id)}
                            disabled={updatingId === c.id}
                            className="w-full py-2 text-sm font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
                          >
                            🗑️ Supprimer le profil
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredCoachs.length > COACHS_PER_PAGE && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setCoachPage((p) => Math.max(1, p - 1))}
                      disabled={coachPage <= 1}
                      className="px-5 py-2.5 rounded-xl bg-[#1F2957] text-white font-medium hover:bg-[#151c3d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Précédent
                    </button>
                    <span className="text-sm text-[#1F2957] font-medium">
                      Page {coachPage} / {totalCoachPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoachPage((p) => Math.min(totalCoachPages, p + 1))}
                      disabled={coachPage >= totalCoachPages}
                      className="px-5 py-2.5 rounded-xl bg-[#1F2957] text-white font-medium hover:bg-[#151c3d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Suivant →
                    </button>
                  </div>
                )}

                {filteredCoachs.length === 0 && (
                  <p className="text-center text-[#1F2957]/60 py-12">Aucun coach trouvé.</p>
                )}
              </div>
            )}

            {tab === "annonces" && (
              <div>
                <div className="flex gap-2 mb-6 border-b border-[#1F2957]/10 pb-2">
                  <button
                    type="button"
                    onClick={() => setAnnonceStatutFilter("en_cours")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      annonceStatutFilter === "en_cours"
                        ? "bg-amber-500 text-white"
                        : "bg-white/60 text-[#1F2957] hover:bg-white border border-[#1F2957]/20"
                    }`}
                  >
                    ⏳ En cours
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnnonceStatutFilter("trouve")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      annonceStatutFilter === "trouve"
                        ? "bg-emerald-600 text-white"
                        : "bg-white/60 text-[#1F2957] hover:bg-white border border-[#1F2957]/20"
                    }`}
                  >
                    ✅ Trouvé !
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDemandes.map((d) => {
                  const isExpanded = expandedAnnonceId === d.id;
                  const dx = d as DemandeRow & {
                    type_contrat?: string | null;
                    diplome_requis?: string | null;
                    type_cours?: string[] | null;
                    horaires_a_definir?: boolean;
                    horaires_details?: { jour: string; debut: string; fin: string }[] | null;
                    description?: string | null;
                    profil_recherche?: string | null;
                    siret?: string | null;
                    contact_reseau?: string | null;
                    budget_recherche?: number | null;
                    tarif_propose?: number | null;
                    type_demandeur?: string | null;
                    connu_par?: string | null;
                  };
                  return (
                    <div
                      key={d.id}
                      className="bg-white rounded-2xl p-5 shadow-md border border-[#1F2957]/10 hover:shadow-lg transition-shadow flex flex-col"
                    >
                      <div className="mb-2">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-[#1F2957] text-lg flex-1">
                            {d.titre_annonce ?? "Sans titre"}
                          </h3>
                          {d.statut === "trouve" && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 shrink-0">
                              ✅ TROUVÉ !
                            </span>
                          )}
                          {d.statut === "en_cours" && (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 shrink-0">
                              ⏳ En cours
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#1F2957]/80 mb-1">
                          <span className="font-medium">Ville :</span> {d.ville ?? "—"}
                        </p>
                        <p className="text-sm text-[#1F2957]/80 mb-1">
                          <span className="font-medium">Contact :</span> {d.nom_contact ?? "—"}
                          {d.contact_email ? ` • ${d.contact_email}` : ""}
                          {d.contact_telephone ? ` • ${d.contact_telephone}` : ""}
                        </p>
                        <p className="text-sm text-[#1F2957]/80 mb-2">
                          <span className="font-medium">Budget :</span> {budgetDisplay(d)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedAnnonceId(isExpanded ? null : d.id)}
                        className="text-sm font-medium text-[#1F2957] hover:text-[#D4DC53] transition-colors mb-3"
                      >
                        {isExpanded ? "Voir moins ↑" : "Voir plus ↓"}
                      </button>

                      {isExpanded && (
                        <div className="mb-4 pt-4 border-t border-[#1F2957]/10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Spécialités :</span> {formatSpecs(d.specialites)}</p>
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Types de cours :</span> {formatTypeCours(dx.type_cours)}</p>
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Horaires :</span> {formatHorairesDemande(d)}</p>
                          <p><span className="font-medium text-[#1F2957]">Type de contrat :</span> {dx.type_contrat ?? "—"}</p>
                          <p><span className="font-medium text-[#1F2957]">Diplôme requis :</span> {dx.diplome_requis ?? "—"}</p>
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Description :</span> {dx.description ?? "—"}</p>
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Profil recherché :</span> {dx.profil_recherche ?? "—"}</p>
                          <p><span className="font-medium text-[#1F2957]">SIRET :</span> {dx.siret ?? "—"}</p>
                          <p><span className="font-medium text-[#1F2957]">Tarif proposé :</span> {dx.tarif_propose != null ? `${dx.tarif_propose} €` : "—"}</p>
                          <p><span className="font-medium text-[#1F2957]">Type demandeur :</span> {dx.type_demandeur ?? "—"}</p>
                          <p><span className="font-medium text-[#1F2957]">Connu par :</span> {dx.connu_par ?? "—"}</p>
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Contact email :</span> <span className="break-all">{d.contact_email ?? "—"}</span></p>
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Contact téléphone :</span> {d.contact_telephone ?? "—"}</p>
                          <p className="sm:col-span-2"><span className="font-medium text-[#1F2957]">Réseau social :</span> <span className="break-all">{dx.contact_reseau ?? "—"}</span></p>
                        </div>
                      )}

                      <div className="mt-auto flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setStatut(d.id, "en_cours")}
                            disabled={updatingId === d.id}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-50 ${
                              d.statut === "en_cours"
                                ? "bg-orange-500 text-white font-bold"
                                : "bg-white text-orange-500 opacity-60"
                            }`}
                          >
                            ⏳ En cours
                          </button>
                          <button
                            onClick={() => setStatut(d.id, "trouve")}
                            disabled={updatingId === d.id}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-50 ${
                              d.statut === "trouve"
                                ? "bg-green-500 text-white font-bold"
                                : "bg-white text-green-500 opacity-60"
                            }`}
                          >
                            ✅ Trouvé !
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/annonces/${d.id}`}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#1F2957]/10 text-[#1F2957] hover:bg-[#1F2957]/20 transition-colors"
                          >
                            ✏️ Modifier
                          </Link>
                          <button
                            onClick={() => deleteAnnonce(d.id)}
                            disabled={updatingId === d.id}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 transition-colors"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredDemandes.length === 0 && (
                  <p className="text-center text-[#1F2957]/60 py-12 col-span-full">
                    {annonceStatutFilter === "trouve" ? "Aucune annonce trouvée." : "Aucune annonce en cours."}
                  </p>
                )}
              </div>
            </div>
            )}

            {tab === "stats" && (() => {
              const tarifs = demandes.map((d) => (d as { tarif_propose?: number }).tarif_propose).filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
              const budgetMoyen = tarifs.length > 0 ? tarifs.reduce((a, b) => a + b, 0) / tarifs.length : null;
              const deptCount: Record<string, number> = {};
              coachs.forEach((c) => {
                const parts = (c.ville ?? "").split(",").map((p) => p.trim()).filter(Boolean);
                parts.forEach((p) => { deptCount[p] = (deptCount[p] ?? 0) + 1; });
              });
              const top5Depts = Object.entries(deptCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
              const specCount: Record<string, number> = {};
              [...(coachs.flatMap((c) => c.specialites ?? [])), ...(demandes.flatMap((d) => d.specialites ?? []))].forEach((s) => {
                specCount[s] = (specCount[s] ?? 0) + 1;
              });
              const top5Specs = Object.entries(specCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
              const connuParCount: Record<string, number> = {};
              [...coachs, ...demandes].forEach((x) => {
                const v = (x as { connu_par?: string | null }).connu_par;
                const label = (typeof v === "string" && v.trim()) ? v.trim() : "Non renseigné";
                connuParCount[label] = (connuParCount[label] ?? 0) + 1;
              });
              const totalConnuPar = Object.values(connuParCount).reduce((a, b) => a + b, 0);
              const connuParPct = totalConnuPar > 0
                ? Object.entries(connuParCount).sort((a, b) => b[1] - a[1]).map(([label, count]) => ({ label, count, pct: Math.round((count / totalConnuPar) * 100) }))
                : [];
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-[#1F2957]/10">
                      <p className="text-sm text-[#1F2957]/70 font-medium">Total coachs</p>
                      <p className="text-2xl font-bold text-[#1F2957]">{coachs.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-[#1F2957]/10">
                      <p className="text-sm text-[#1F2957]/70 font-medium">Total annonces</p>
                      <p className="text-2xl font-bold text-[#1F2957]">{demandes.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-md border border-[#1F2957]/10">
                      <p className="text-sm text-[#1F2957]/70 font-medium">Budget moyen proposé</p>
                      <p className="text-2xl font-bold text-[#1F2957]">{budgetMoyen != null ? `${Math.round(budgetMoyen)} €` : "—"}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-[#1F2957]/10">
                      <h3 className="font-bold text-[#1F2957] mb-3">Top 5 départements / zones</h3>
                      <ul className="space-y-2 text-[#1F2957]">
                        {top5Depts.length === 0 ? <li className="text-[#1F2957]/60">—</li> : top5Depts.map(([nom, count]) => <li key={nom}><span className="font-medium">{nom}</span> : {count}</li>)}
                      </ul>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-md border border-[#1F2957]/10">
                      <h3 className="font-bold text-[#1F2957] mb-3">Top 5 spécialités</h3>
                      <ul className="space-y-2 text-[#1F2957]">
                        {top5Specs.length === 0 ? <li className="text-[#1F2957]/60">—</li> : top5Specs.map(([nom, count]) => <li key={nom}><span className="font-medium">{nom}</span> : {count}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-md border border-[#1F2957]/10">
                    <h3 className="font-bold text-[#1F2957] mb-3">Répartition « Connu par » (coachs + recruteurs)</h3>
                    <p className="text-sm text-[#1F2957]/70 mb-3">Pourcentage par canal d&apos;acquisition</p>
                    {connuParPct.length === 0 ? (
                      <p className="text-[#1F2957]/60">Aucune donnée.</p>
                    ) : (
                      <ul className="space-y-2 text-[#1F2957]">
                        {connuParPct.map(({ label, count, pct }) => (
                          <li key={label} className="flex justify-between items-center gap-4">
                            <span className="font-medium">{label}</span>
                            <span>{pct} % ({count})</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })()}

            {tab === "devis" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-5 shadow-md border border-[#1F2957]/10">
                  <h3 className="font-bold text-[#1F2957] mb-4">Ajouter un devis</h3>
                  <form
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const montantNum = parseFloat(devisForm.montant);
                      if (!devisForm.nom_client.trim() || Number.isNaN(montantNum)) return;
                      setDevisLoading(true);
                      await supabase.from("suivi_devis").insert([{ nom_client: devisForm.nom_client.trim(), montant: montantNum, statut: devisForm.statut }]);
                      setDevisForm({ nom_client: "", montant: "", statut: "Proposition envoyée" });
                      const { data } = await supabase.from("suivi_devis").select("*").order("created_at", { ascending: false });
                      if (data) setDevis(data as DevisRow[]);
                      setDevisLoading(false);
                    }}
                  >
                    <div>
                      <label className="block text-sm font-medium text-[#1F2957] mb-1">Nom du client</label>
                      <input type="text" value={devisForm.nom_client} onChange={(e) => setDevisForm((f) => ({ ...f, nom_client: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#1F2957]/20 text-[#1F2957]" placeholder="Nom du client" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1F2957] mb-1">Montant (€)</label>
                      <input type="number" step="0.01" min="0" value={devisForm.montant} onChange={(e) => setDevisForm((f) => ({ ...f, montant: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#1F2957]/20 text-[#1F2957]" placeholder="Montant" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1F2957] mb-1">Statut</label>
                      <select value={devisForm.statut} onChange={(e) => setDevisForm((f) => ({ ...f, statut: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-[#1F2957]/20 text-[#1F2957] bg-white">
                        <option value="Proposition envoyée">Proposition envoyée</option>
                        <option value="Accepté">Accepté</option>
                        <option value="Payé">Payé</option>
                      </select>
                    </div>
                    <button type="submit" disabled={devisLoading} className="px-4 py-2 rounded-lg bg-[#1F2957] text-white font-medium hover:bg-[#151c3d] disabled:opacity-50">Ajouter</button>
                  </form>
                </div>
                <div className="bg-white rounded-xl overflow-hidden shadow-md border border-[#1F2957]/10">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-[#1F2957]">
                      <thead className="bg-[#1F2957]/10">
                        <tr>
                          <th className="text-left px-4 py-3 font-bold">Client</th>
                          <th className="text-left px-4 py-3 font-bold">Montant</th>
                          <th className="text-left px-4 py-3 font-bold">Statut</th>
                          <th className="text-right px-4 py-3 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {devis.length === 0 && (
                          <tr><td colSpan={4} className="px-4 py-8 text-center text-[#1F2957]/60">Aucun devis.</td></tr>
                        )}
                        {devis.map((dv) => (
                          <tr key={dv.id} className="border-t border-[#1F2957]/10 hover:bg-[#1F2957]/5">
                            <td className="px-4 py-3">{dv.nom_client ?? "—"}</td>
                            <td className="px-4 py-3">{dv.montant != null ? `${dv.montant} €` : "—"}</td>
                            <td className="px-4 py-3">
                              <select
                                value={dv.statut ?? ""}
                                onChange={async (e) => {
                                  const newStatut = e.target.value;
                                  setUpdatingId(dv.id);
                                  await supabase.from("suivi_devis").update({ statut: newStatut }).eq("id", dv.id);
                                  setDevis((prev) => prev.map((x) => (x.id === dv.id ? { ...x, statut: newStatut } : x)));
                                  setUpdatingId(null);
                                }}
                                disabled={updatingId === dv.id}
                                className="px-2 py-1 rounded border border-[#1F2957]/20 bg-white text-[#1F2957] disabled:opacity-50"
                              >
                                <option value="Proposition envoyée">Proposition envoyée</option>
                                <option value="Accepté">Accepté</option>
                                <option value="Payé">Payé</option>
                              </select>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!window.confirm("Supprimer ce devis ?")) return;
                                  setUpdatingId(dv.id);
                                  await supabase.from("suivi_devis").delete().eq("id", dv.id);
                                  setDevis((prev) => prev.filter((x) => x.id !== dv.id));
                                  setUpdatingId(null);
                                }}
                                disabled={updatingId === dv.id}
                                className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
