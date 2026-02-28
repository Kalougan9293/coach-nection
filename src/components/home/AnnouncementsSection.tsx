import React from "react";

type Annonce = Record<string, unknown> & {
  id?: string;
  titre_annonce?: string | null;
  ville?: string | null;
  specialites?: string[] | null;
  statut?: string | null;
  created_at?: string | null;
};

function formatDate(createdAt: string | null | undefined) {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  return `Publiée le ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
}

export default function AnnouncementsSection({
  annonces = [],
  loading = false,
}: {
  annonces?: Annonce[];
  loading?: boolean;
}) {
  return (
    <section className="py-12 md:py-16 bg-[#F3F0EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2957]">
            Dernières annonces
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-[#1F2957]/60">
              Chargement...
            </div>
          ) : (
            (annonces as Annonce[]).map((annonce) => {
              const title = (annonce.titre_annonce as string) ?? "Sans titre";
              const location = (annonce.ville as string) ?? "—";
              const specs = (annonce.specialites as string[] | undefined) ?? [];
              const specialty = specs[0] ?? "—";
              const statut = annonce.statut as string | null | undefined;
              const dateStr = formatDate(annonce.created_at as string | null | undefined);
              return (
                <div
                  key={annonce.id ?? String(Math.random())}
                  className="group bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col h-full transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
                >
                  {statut === "trouve" && (
                    <span className="self-start text-[10px] font-medium px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 mb-3 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-900">
                      ✅ TROUVÉ !
                    </span>
                  )}
                  {statut === "en_cours" && (
                    <span className="self-start text-[10px] font-medium px-2 py-1 rounded-md bg-amber-50 text-amber-800 mb-3 transition-colors duration-300 group-hover:bg-amber-100 group-hover:text-amber-900">
                      ⏳ EN COURS
                    </span>
                  )}
                  <h3 className="font-bold text-[#1F2957] text-lg mb-4 flex-1 transition-colors duration-300 group-hover:text-[#151c3d]">
                    {title}
                  </h3>
                  <div className="flex flex-col gap-3 mt-auto">
                    <div>
                      <span className="bg-[#FFFBEB] border border-[#FBBF24] text-[#1F2957] text-xs font-medium px-2.5 py-1 rounded-full truncate max-w-full inline-block transition-colors duration-300 group-hover:bg-amber-100 group-hover:border-amber-400">
                        {specialty}
                      </span>
                    </div>
                    <div>
                      <span className="bg-[#E8F0FE] text-[#1F2957] text-xs font-semibold px-3 py-1.5 rounded-full inline-block transition-colors duration-300 group-hover:bg-blue-100 group-hover:text-[#151c3d]">
                        📍 {location}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2 transition-colors duration-300 group-hover:text-gray-600">{dateStr}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
