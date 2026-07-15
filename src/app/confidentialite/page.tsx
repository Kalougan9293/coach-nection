import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité | Coach-Nection",
  description: "Politique de confidentialité et protection des données Coach-Nection",
};

const linkClass = "underline hover:text-[#1F2957]/80";

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[#F3F0EB] text-[#1F2957] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block text-sm font-medium text-[#1F2957]/80 hover:text-[#1F2957] mb-8"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold text-[#1F2957] mb-2">Politique de Confidentialité</h1>
        <p className="text-sm text-[#1F2957]/70 mb-8">Mise à jour : 28.02.2026</p>

        <p className="mb-10">
          Chez Coach-Nection, nous prenons la protection de vos données au sérieux. Cette politique
          explique comment nous collectons, utilisons et protégeons vos informations personnelles,
          en respectant le RGPD (Règlement Général sur la Protection des Données).
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">1. Responsable du traitement</h2>
          <p>
            Le responsable des données est Jonathan Seroussi, représentant légal de la société
            Coach-Nection (SAS). Vous pouvez le contacter à l&apos;adresse :{" "}
            <a href="mailto:contact@lockin-web.online" className={linkClass}>
              contact@lockin-web.online
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">2. Données que nous collectons</h2>
          <p className="mb-4">
            Nous collectons uniquement les informations utiles pour opérer notre service de mise en
            relation :
          </p>
          <p className="mb-2">
            <strong>Pour les coachs :</strong> nom, prénom, date de naissance, email, téléphone,
            réseaux sociaux, zone d&apos;intervention, diplômes, expériences, spécialités, tarifs,
            SIRET.
          </p>
          <p>
            <strong>Pour les clients recruteurs :</strong> nom de la structure/contact, email,
            téléphone, zone géographique, type de besoin, budget de recherche.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">3. Pourquoi nous les utilisons</h2>
          <p className="mb-4">Les données servent exclusivement à :</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Analyser les profils pour faciliter la mise en relation ultra-ciblée.</li>
            <li>
              Permettre le contact entre le coach et le client une fois l&apos;accord validé.
            </li>
            <li>
              Gérer le paiement de nos factures de mise en relation (via Stripe).
            </li>
            <li>Analyser les usages de la plateforme pour l&apos;améliorer.</li>
          </ul>
          <p>
            Les bases légales de traitement sont : le consentement de l&apos;utilisateur lors de la
            soumission du formulaire, l&apos;exécution du contrat de mise en relation, et
            l&apos;intérêt légitime.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">4. Avec qui nous les partageons</h2>
          <p>
            Les données sont partagées uniquement avec des prestataires fiables et conformes au RGPD,
            strictement nécessaires au fonctionnement technique du site : Stripe (paiement), Supabase
            (hébergement de la base de données), Netlify (hébergement du site web). Certains
            prestataires peuvent avoir des serveurs hors UE, mais respectent les clauses contractuelles
            types exigées par la réglementation européenne.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">5. Durée de conservation</h2>
          <p className="mb-4">
            Les données des utilisateurs sont conservées tant qu&apos;elles sont jugées utiles pour de
            potentielles mises en relation. Si un profil est inactif pendant 3 ans, les données sont
            supprimées.
          </p>
          <p>
            Les données liées à la facturation sont gardées 10 ans (obligation légale et comptable).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">6. Vos droits</h2>
          <p className="mb-4">
            Vous pouvez à tout moment demander l&apos;accès à vos données, leur rectification, leur
            suppression, leur portabilité, ou limiter leur traitement en faisant la demande à{" "}
            <a href="mailto:contact@lockin-web.online" className={linkClass}>
              contact@lockin-web.online
            </a>
            . Vous pouvez aussi définir ce qu&apos;il advient de vos données après votre décès.
          </p>
          <p>
            Si vous n&apos;obtenez pas de réponse satisfaisante sous 30 jours, vous pouvez saisir la
            CNIL via{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={linkClass}>
              www.cnil.fr
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">7. Sécurité</h2>
          <p>
            Vos données sont hébergées sur des serveurs sécurisés. L&apos;accès à la base de données
            d&apos;administration est strictement restreint à l&apos;équipe de Coach-Nection. En cas
            de violation avérée de données, vous serez notifié(e) dans les délais légaux impartis.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">8. Utilisation des Cookies</h2>
          <p className="mb-4">
            Ce site utilise uniquement des cookies techniques strictement nécessaires à son bon
            fonctionnement et à sa sécurité (notamment pour le maintien de la connexion des
            utilisateurs via Supabase).
          </p>
          <p className="mb-4">
            Aucun cookie de traçage publicitaire ou de mesure d&apos;audience n&apos;est utilisé. Par
            conséquent, conformément aux directives de la CNIL, ce site est exempté du recueil de
            consentement et ne nécessite pas l&apos;affichage d&apos;une bannière de cookies.
          </p>
          <p>
            Pour plus d&apos;informations sur la gestion des cookies, vous pouvez consulter le site
            de la CNIL (
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={linkClass}>
              www.cnil.fr
            </a>
            ).
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
