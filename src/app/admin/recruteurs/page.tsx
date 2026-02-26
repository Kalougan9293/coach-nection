import Link from "next/link";
import AdminSidebar from "@/components/admin/AdminSidebar";

const MOCK_RECRUTEURS = [
  {
    id: 1,
    nom: "Basic-Fit",
    contact: "Jean Dupont",
    email: "jean@basic-fit.com",
    annonce: "Coach Fitness recherché - Paris 15ème",
    date: "2026-02-15",
  },
  {
    id: 2,
    nom: "KeepCool",
    contact: "Marie Martin",
    email: "marie@keepcool.fr",
    annonce: "Coordinateur sportif - Salle premium",
    date: "2026-02-14",
  },
  {
    id: 3,
    nom: "CrossFit Lyon",
    contact: "Paul Bernard",
    email: "paul@crossfit-lyon.com",
    annonce: "Coach CrossFit - Nouvelle salle",
    date: "2026-02-12",
  },
];

export default function RecruteursAdminPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">
            Recruteurs / Annonces
          </h1>
          <Link
            href="/"
            className="text-primary/70 hover:text-primary transition-colors text-sm flex items-center gap-2"
          >
            Retour au site
          </Link>
        </div>

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
                placeholder="Rechercher par entreprise, contact..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-primary/20 focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <select className="px-4 py-3 rounded-2xl border border-primary/20 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary">
              <option value="">Toutes les annonces</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-primary/10 shadow-soft">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left px-6 py-4 font-semibold">Entreprise</th>
                  <th className="text-left px-6 py-4 font-semibold">Contact</th>
                  <th className="text-left px-6 py-4 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 font-semibold">Annonce</th>
                  <th className="text-left px-6 py-4 font-semibold">Date</th>
                  <th className="text-left px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_RECRUTEURS.map((recruteur) => (
                  <tr
                    key={recruteur.id}
                    className="border-t border-primary/5 hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-primary font-medium">
                      {recruteur.nom}
                    </td>
                    <td className="px-6 py-4 text-primary">
                      {recruteur.contact}
                    </td>
                    <td className="px-6 py-4 text-primary/80">
                      {recruteur.email}
                    </td>
                    <td className="px-6 py-4 text-primary/80 max-w-xs truncate">
                      {recruteur.annonce}
                    </td>
                    <td className="px-6 py-4 text-primary/70 text-sm">
                      {new Date(recruteur.date).toLocaleDateString("fr-FR")}
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
      </main>
    </div>
  );
}
