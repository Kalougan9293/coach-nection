import Link from "next/link";

export const metadata = {
  title: "Foire Aux Questions | Coach-Nection",
  description: "Foire aux questions - Coach-Nection",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F3F0EB] text-[#1F2957] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block text-sm font-medium text-[#1F2957]/80 hover:text-[#1F2957] mb-8"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold text-[#1F2957] mb-2">
          Foire Aux Questions
        </h1>
        <p className="text-sm text-[#1F2957]/70 mb-8">Coach-Nection</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">
            À qui s&apos;adresse le réseau Coach-Nection ?
          </h2>
          <p>
            Notre agence accompagne principalement les professionnels du sport
            (salles de fitness, box de CrossFit, studios de yoga, associations)
            dans leur recherche de coachs. Nous répondons aussi aux demandes de
            particuliers cherchant un accompagnement privé sur mesure.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">
            Quel est le tarif pour recruter ou remplacer un coach sportif ?
          </h2>
          <p>
            C&apos;est vous qui fixez votre budget ! Notre formulaire de
            recherche est sur mesure : vous indiquez le montant que vous êtes
            prêt à allouer à votre besoin. Le prix d&apos;un remplacement
            urgent à 7h du matin n&apos;est pas le même que celui d&apos;un
            recrutement en CDI 35h. Vous pouvez même proposer un budget de 0 €
            pour la recherche : nous trouvons alors un accord directement sur les
            premières prestations du coach.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">
            Quel type de contrat de coaching proposez-vous ?
          </h2>
          <p>
            Notre réseau s&apos;adapte à vos besoins réels. La majorité de nos
            coachs partenaires interviennent sous le statut de freelance
            (indépendant / auto-entrepreneur), idéal pour des remplacements de
            dernière minute ou des missions ponctuelles. Nous gérons également
            les mises en relation pour des recrutements classiques en CDD ou
            CDI.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">
            Dans quelles zones géographiques vos coachs interviennent-ils ?
          </h2>
          <p>
            Coach-Nection est actif sur l&apos;ensemble de la France
            métropolitaine. Que vous gériez une salle en plein centre de Paris
            ou une association en zone rurale, nous activons notre réseau local
            pour vous trouver le profil idéal rapidement. L&apos;ouverture à la
            Belgique, Andorre et aux DOM-TOM est en cours de déploiement !
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">
            Je suis coach sportif, l&apos;inscription est-elle vraiment
            gratuite ?
          </h2>
          <p>
            Oui, à 100 % ! Vous créez votre profil, renseignez vos spécialités
            et votre zone d&apos;intervention. Ensuite, vous n&apos;avez plus
            rien à faire. Nous vous contactons uniquement lorsqu&apos;une
            mission (remplacement, cours collectif, coaching privé) correspond
            exactement à vos critères. Sans abonnement, sans engagement.
          </p>
        </section>

        <Link
          href="/"
          className="inline-block mt-4 text-sm font-medium text-[#1F2957]/80 hover:text-[#1F2957]"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
