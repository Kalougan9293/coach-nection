"use client";

const MOCK_COACHS = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Laetitia",
    email: "laetitia@email.com",
    telephone: "06 12 34 56 78",
    ville: "Soisy-sous-Montmorency",
    specialite: "Fitness, Cardio",
    dateInscription: "2026-02-15",
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Ludovic",
    email: "ludovic@email.com",
    telephone: "06 23 45 67 89",
    ville: "Paris",
    specialite: "CrossFit, Haltérophilie",
    dateInscription: "2026-02-14",
  },
  {
    id: 3,
    nom: "Bernard",
    prenom: "Samuel",
    email: "samuel@email.com",
    telephone: "06 34 56 78 90",
    ville: "Lyon",
    specialite: "CrossFit, Préparation physique",
    dateInscription: "2026-02-13",
  },
  {
    id: 4,
    nom: "Petit",
    prenom: "Charles",
    email: "charles@email.com",
    telephone: "06 45 67 89 01",
    ville: "Marseille",
    specialite: "Musculation, Cardio",
    dateInscription: "2026-02-12",
  },
  {
    id: 5,
    nom: "Durand",
    prenom: "Marie",
    email: "marie@email.com",
    telephone: "06 56 78 90 12",
    ville: "Bordeaux",
    specialite: "Yoga, Pilates",
    dateInscription: "2026-02-11",
  },
];

export default function DataGrid() {
  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 111.06-1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            placeholder="Rechercher par nom, email..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-3 rounded-2xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary">
            <option value="">Toutes les villes</option>
            <option value="paris">Paris</option>
            <option value="lyon">Lyon</option>
            <option value="marseille">Marseille</option>
            <option value="bordeaux">Bordeaux</option>
          </select>
          <select className="px-4 py-3 rounded-2xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary">
            <option value="">Toutes les spécialités</option>
            <option value="fitness">Fitness</option>
            <option value="crossfit">CrossFit</option>
            <option value="yoga">Yoga</option>
            <option value="musculation">Musculation</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-primary/10 shadow-soft">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-left px-6 py-4 font-semibold">Nom</th>
              <th className="text-left px-6 py-4 font-semibold">Prénom</th>
              <th className="text-left px-6 py-4 font-semibold">Email</th>
              <th className="text-left px-6 py-4 font-semibold">Téléphone</th>
              <th className="text-left px-6 py-4 font-semibold">Ville</th>
              <th className="text-left px-6 py-4 font-semibold">Spécialité</th>
              <th className="text-left px-6 py-4 font-semibold">Inscription</th>
              <th className="text-left px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_COACHS.map((coach) => (
              <tr
                key={coach.id}
                className="border-t border-primary/5 hover:bg-primary/5 transition-colors"
              >
                <td className="px-6 py-4 text-primary font-medium">
                  {coach.nom}
                </td>
                <td className="px-6 py-4 text-primary">{coach.prenom}</td>
                <td className="px-6 py-4 text-primary/80">{coach.email}</td>
                <td className="px-6 py-4 text-primary/80">
                  {coach.telephone}
                </td>
                <td className="px-6 py-4 text-primary/80">{coach.ville}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-secondary/50 rounded-full text-sm font-medium text-primary">
                    {coach.specialite}
                  </span>
                </td>
                <td className="px-6 py-4 text-primary/70 text-sm">
                  {new Date(coach.dateInscription).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="text-accent hover:text-primary font-medium text-sm"
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
