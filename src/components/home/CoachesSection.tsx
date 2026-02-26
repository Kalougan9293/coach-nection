import React from "react";
import Link from "next/link";

type Coach = Record<string, unknown> & {
  id?: string;
  prenom?: string | null;
  nom?: string | null;
  ville?: string | null;
  specialites?: string[] | null;
  photo_url?: string | null;
};

const PLACEHOLDER_IMAGE = "https://i.pravatar.cc/300?img=1";

export default function CoachesSection({
  coachs = [],
  loading = false,
}: {
  coachs?: Coach[];
  loading?: boolean;
}) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1F2957]">
            Derniers Coachs inscrits
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-[#1F2957]/60">
              Chargement...
            </div>
          ) : (
            (coachs as Coach[]).map((coach) => {
              const displayName = (coach.prenom as string)?.trim() || "Coach";
              const location = (coach.ville as string) ?? "—";
              const specs = (coach.specialites as string[] | undefined) ?? [];
              const imageUrl = (coach.photo_url as string) || PLACEHOLDER_IMAGE;
              return (
                <div
                  key={coach.id ?? String(Math.random())}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col h-full"
                >
                  <div className="aspect-square w-full overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={`Photo de ${displayName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1 min-h-0">
                    <h3 className="font-bold text-[#1F2957] text-xl mb-3 flex-shrink-0">{displayName}</h3>
                    <div className="flex flex-col flex-1 min-h-[7rem] gap-3">
                      <div className="flex flex-wrap gap-2 content-start max-h-[4rem] overflow-hidden">
                        {specs.slice(0, 8).map((spec, index) => (
                          <span
                            key={index}
                            className="bg-[#FFFBEB] border border-amber-200 text-[#1F2957] text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <div className="mt-auto pt-1 flex-shrink-0">
                        <span className="inline-flex items-center gap-1.5 bg-[#E8F0FE] text-[#1F2957] text-xs font-semibold px-3 py-1.5 rounded-full">
                          <span aria-hidden>📍</span> {location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 3ème ligne : haut des profils floutés + CTA */}
        <div className="relative mt-6 h-28 sm:h-32 overflow-hidden rounded-2xl">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 absolute inset-0"
            aria-hidden
          >
            {[3, 5, 7, 9].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md bg-white flex-shrink-0 -mb-24">
                <div
                  className="aspect-square w-full blur-2xl scale-110 bg-cover bg-center opacity-90"
                  style={{ backgroundImage: `url(https://i.pravatar.cc/300?img=${i})` }}
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-[#F3F0EB]/50">
            <Link
              href="/formulaire/recruteur"
              className="bg-[#1F2957] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#151c3d] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 z-10"
            >
              Lancer votre recherche !
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
