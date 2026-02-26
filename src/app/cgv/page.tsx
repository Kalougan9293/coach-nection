import Link from "next/link";

export const metadata = {
  title: "Conditions générales de vente (CGV) | Coach-Nection",
  description: "Conditions générales de vente Coach-Nection",
};

const linkClass = "underline hover:text-[#1F2957]/80";

export default function CGVPage() {
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
          Conditions Générales de Vente (CGV)
        </h1>
        <p className="text-sm text-[#1F2957]/70 mb-8">Mise à jour le 15 mai 2025</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">1. Qui sommes-nous ?</h2>
          <p className="mb-4">
            Coach-Nection est une agence digitale qui met en relation des coachs sportifs avec des
            clients (particuliers, responsables de salle, entreprises, etc.).
          </p>
          <p>
            La société est immatriculée en France sous le numéro SIRET 943 548 404 00019, avec son
            siège social au 10 rue Penthièvre, Paris (75008), Île-de-France, France.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">2. À quoi servent ces CGV ?</h2>
          <p>
            Elles encadrent les règles entre vous (coach ou client recruteur) et nous (Coach-Nection),
            pour tout ce qui concerne notre service de recherche, de mise en relation et la
            facturation associée.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">
            3. Fonctionnement de la plateforme et Tarification
          </h2>
          <p className="mb-4">
            L&apos;inscription et la soumission d&apos;un profil pour les Coachs sportifs sont
            entièrement gratuites. Coach-Nection ne prend aucune commission sur les prestations
            réalisées par la suite entre le coach et le client.
          </p>
          <p>
            Pour les Clients (Recruteurs), le dépôt d&apos;une annonce est gratuit. Le service de
            mise en relation est facturé sous forme d&apos;un forfait unique (&quot;Frais
            d&apos;agence&quot;). Le montant de ce forfait est défini en amont avec le client en
            fonction du budget de recherche alloué lors du dépôt de l&apos;annonce, et validé lors
            d&apos;un contact direct sous 24h.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">
            4. Modalité de compensation (Budget de recherche nul)
          </h2>
          <p className="mb-4">
            Dans le cas où le Client recruteur indique ne disposer d&apos;aucun budget pour régler
            les frais d&apos;agence de mise en relation, une modalité de compensation s&apos;applique
            de plein droit :
          </p>
          <p className="mb-4">Le Client s&apos;acquitte de la facture de mise en relation émise par Coach-Nection.</p>
          <p className="mb-4">
            En contrepartie, le Coach sélectionné et acceptant la mission s&apos;engage à réaliser sa
            première prestation (ou ses premières, selon accord préalable) à titre gratuit pour le
            Client.
          </p>
          <p>
            Ce système permet au Client d&apos;amortir les frais d&apos;agence de la plateforme, et au
            Coach de régler ses coûts d&apos;acquisition client sous la forme d&apos;une prestation
            offerte.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">5. Paiement et sécurité</h2>
          <p>
            Les factures émises par Coach-Nection sont gérées via Stripe, un prestataire sécurisé, ou
            par virement bancaire. Les coordonnées complètes et définitives du Coach sélectionné
            peuvent être retenues jusqu&apos;au paiement intégral de la facture de mise en relation par
            le Client.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">6. Droit de rétractation et Remboursement</h2>
          <p>
            S&apos;agissant d&apos;un service de mise en relation (fourniture d&apos;un contact qualifié)
            exécuté immédiatement après accord, et s&apos;adressant majoritairement à un public de
            professionnels, le Client reconnaît expressément que les services démarrent immédiatement
            après son accord et qu&apos;il renonce à son droit de rétractation (article L221-28 du Code
            de la consommation). Les frais de mise en relation ne sont pas remboursables en cas de
            rupture de la collaboration ultérieure entre le Coach et le Client, la mission de
            Coach-Nection ayant été pleinement exécutée.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">7. Respect des engagements et Exécution</h2>
          <p>
            Coach-Nection est un intermédiaire. Une fois la mise en relation effectuée, le Client et
            le Coach contractent directement et librement ensemble. Les coachs s&apos;engagent à fournir
            des informations claires, à jour, et à posséder les assurances professionnelles requises
            (RC Pro). Un comportement irrespectueux, abusif ou le contournement volontaire de la
            plateforme peut entraîner la suppression du compte et des poursuites.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">8. Litiges et médiation</h2>
          <p className="mb-4">
            En cas de souci, contactez-nous d&apos;abord pour tenter une résolution amiable :{" "}
            <a href="mailto:contact@coach-nection.com" className={linkClass}>
              contact@coach-nection.com
            </a>
            .
          </p>
          <p className="mb-4">
            À défaut d&apos;accord amiable ou en l&apos;absence de réponse dans un délai d&apos;un (1)
            mois, le Client consommateur au sens de l&apos;article L.612-2 du code de la consommation
            a la possibilité de saisir gratuitement le médiateur compétent :
          </p>
          <p className="mb-2">Société Médiation Professionnelle, 2 Rue Marc Sangnier, 33130 Bègles.</p>
          <p className="mb-2">
            Adresse de saisine : Société Médiation Professionnelle – Alteritae, 5 rue Salvaing,
            12000 Rodez.
          </p>
          <p>
            Site web :{" "}
            <a
              href="https://www.mediateur-consommation-smp.fr"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              www.mediateur-consommation-smp.fr
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">9. Loi applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige non résolu à
            l&apos;amiable, la juridiction compétente sera celle du siège social de Coach-Nection,
            sauf disposition légale contraire.
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
