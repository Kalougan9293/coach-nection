import Link from "next/link";

export const metadata = {
  title: "Conditions générales d'utilisation (CGU) | Coach-Nection",
  description: "Conditions générales d'utilisation du site Coach-Nection",
};

const linkClass = "underline hover:text-[#1F2957]/80";

export default function CGUPage() {
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
          Conditions Générales d&apos;Utilisation (CGU)
        </h1>
        <p className="text-sm text-[#1F2957]/70 mb-8">Mise à jour : 28.02.2026</p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">1. Acceptation des CGU</h2>
          <p>
            En accédant à la plateforme Coach-Nection (ci-après &quot;le Service&quot;), vous
            reconnaissez avoir pris connaissance et accepté sans réserve les présentes Conditions
            Générales d&apos;Utilisation. Les CGU régissent l&apos;accès, la navigation et
            l&apos;utilisation de la plateforme.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">2. Description des services</h2>
          <p className="mb-4">
            Coach-Nection est une plateforme agissant comme une agence digitale de recrutement,
            facilitant la mise en relation entre coachs sportifs (professionnels indépendants) et
            utilisateurs recruteurs (particuliers, responsables de salles de sport, entreprises).
          </p>
          <p className="mb-4">
            Les coachs peuvent soumettre leur profil professionnel détaillé à notre équipe.
          </p>
          <p>
            Les recruteurs peuvent publier leurs demandes, horaires et budgets alloués à la recherche
            d&apos;un profil.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">3. Responsabilités et Modération</h2>
          <p className="mb-4">
            Chaque utilisateur est responsable des informations qu&apos;il communique sur la
            plateforme.
          </p>
          <p className="mb-4">
            Les coachs s&apos;engagent à soumettre des profils exacts, à jour, et à fournir des
            prestations conformes à ce qu&apos;ils annoncent.
          </p>
          <p className="mb-4">
            Coach-Nection se réserve le droit de modérer, de refuser, de suspendre ou de supprimer
            tout profil ou annonce contrevenant à la législation en vigueur, à l&apos;éthique du
            service ou aux présentes CGU (notamment les informations mensongères sur les diplômes).
          </p>
          <p>
            <strong>Droit à l&apos;image et cession de droits :</strong> En soumettant sa photo de
            profil et sa description, le Coach concède expressément à Coach-Nection une licence non
            exclusive, gratuite et mondiale pour utiliser, stocker, reproduire et partager ces
            éléments avec les recruteurs potentiels dans le cadre du service de mise en relation. Le
            Coach autorise également Coach-Nection à utiliser sa photo de profil à des fins de
            promotion de la plateforme (réseaux sociaux, site web), sauf refus explicite formulé par
            écrit à{" "}
            <a href="mailto:contact.coach.nection@gmail.com" className={linkClass}>
              contact.coach.nection@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">4. Limitation de responsabilité</h2>
          <p className="mb-4">
            Coach-Nection met à disposition un espace numérique et humain de mise en relation
            ciblée.
          </p>
          <p className="mb-4">
            Elle ne garantit ni la disponibilité permanente, ni la qualité, ni la fiabilité de
            l&apos;exécution des prestations proposées par les coachs une fois la mise en relation
            effectuée.
          </p>
          <p className="mb-4">
            La responsabilité de Coach-Nection ne saurait être engagée en cas de litige, dommage ou
            accident survenant entre utilisateurs (coach/client) pendant l&apos;exécution d&apos;un
            contrat de travail ou de prestation de service.
          </p>
          <p>
            <strong>Vérification des documents et qualifications :</strong> Bien que Coach-Nection
            demande aux Coachs de fournir leurs diplômes et de certifier la possession d&apos;une
            assurance RC Pro valide pour intégrer la base de données, notre obligation n&apos;est
            qu&apos;une obligation de moyens. Il appartient exclusivement au Client (Recruteur) de
            procéder aux vérifications légales d&apos;usage (validité des diplômes, carte
            professionnelle, assurance) avant toute signature de contrat ou début de prestation.
            Coach-Nection décline toute responsabilité en cas de falsification, d&apos;omission ou de
            documents frauduleux fournis par un Coach.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">5. Règlement des litiges</h2>
          <p>
            En cas de litige entre utilisateurs, ou avec la plateforme, les parties s&apos;engagent à
            rechercher une solution amiable en priorité. En cas d&apos;échec, un recours à la
            médiation (détaillé dans nos CGV et Mentions Légales) pourra être proposé avant toute
            action judiciaire. Le tribunal compétent sera celui du siège social de la société
            éditrice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">6. Données personnelles</h2>
          <p>
            Coach-Nection collecte et traite certaines données personnelles dans le cadre de
            l&apos;utilisation de la plateforme, conformément à la réglementation en vigueur (RGPD).
            Pour en savoir plus sur les finalités, les destinataires et vos droits, veuillez
            consulter notre{" "}
            <Link href="/confidentialite" className={linkClass}>
              Politique de confidentialité
            </Link>
            .
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
