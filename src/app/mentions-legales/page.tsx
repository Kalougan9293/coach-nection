import Link from "next/link";

export const metadata = {
  title: "Mentions légales | Coach-Nection",
  description: "Mentions légales du site Coach-Nection",
};

const linkClass = "underline hover:text-[#1F2957]/80";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#F3F0EB] text-[#1F2957] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block text-sm font-medium text-[#1F2957]/80 hover:text-[#1F2957] mb-8"
        >
          ← Retour à l&apos;accueil
        </Link>

        <h1 className="text-3xl font-bold text-[#1F2957] mb-2">Mentions légales</h1>
        <p className="text-sm text-[#1F2957]/70 mb-8">Mise à jour : 28.02.2026</p>

        <p className="mb-6">
          Conformément aux dispositions des articles 6-III et 19 de la loi n°2004-575 du 21 juin 2004
          pour la confiance dans l&apos;économie numérique (L.C.E.N.), il est porté à la connaissance
          des utilisateurs du site Coach-Nection les présentes mentions légales.
        </p>
        <p className="mb-10">
          La navigation sur le site Coach-Nection implique l&apos;acceptation pleine et entière des
          présentes mentions légales.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">1. Éditeur du site</h2>
          <p className="mb-2">Le site Coach-Nection est édité par :</p>
          <p className="mb-2">Coach-Nection, société par actions simplifiée (SAS)</p>
          <p className="mb-2">Immatriculée au RCS de Paris sous le numéro SIRET : 943 548 404 00019</p>
          <p className="mb-2">Siège social : 10 rue de Penthièvre, 75008 Paris, France</p>
          <p className="mb-2">Capital social : 5 000€</p>
          <p className="mb-2">Numéro de téléphone : 06.62.28.86.56</p>
          <p className="mb-2">
            Adresse e-mail :{" "}
            <a href="mailto:contact@lockin-web.online" className={linkClass}>
              contact@lockin-web.online
            </a>
          </p>
          <p>Directeur de la publication : Seroussi Jonathan</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">2. Hébergeur du site</h2>
          <p className="mb-2">Le site Coach-Nection est hébergé par :</p>
          <p className="mb-2">Netlify, Inc.</p>
          <p className="mb-2">Adresse : 44 Montgomery Street, Suite 300, San Francisco, California 94104, USA</p>
          <p>
            Site web :{" "}
            <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
              https://www.netlify.com
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">3. Accès au site</h2>
          <p className="mb-4">
            Le site est accessible en continu, 7j/7 et 24h/24, sauf interruption pour maintenance
            technique ou cas de force majeure.
          </p>
          <p>
            Coach-Nection s&apos;efforce de garantir l&apos;accessibilité du site à tout moment, sans
            pour autant être tenu à une obligation de résultat.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">4. Propriété intellectuelle</h2>
          <p className="mb-4">
            Tous les éléments présents sur le site (textes, images, logos, contenus, etc.) sont
            protégés par les lois en vigueur relatives à la propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, adaptation, totale ou
            partielle, sans autorisation expresse préalable, est interdite et constitue une
            contrefaçon susceptible d&apos;engager la responsabilité civile et pénale de son auteur.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">5. Données personnelles</h2>
          <p className="mb-4">
            Coach-Nection s&apos;engage à respecter la réglementation applicable en matière de
            protection des données personnelles, et notamment le Règlement Général sur la Protection
            des Données (RGPD – UE 2016/679).
          </p>
          <p className="mb-4">
            Les données personnelles collectées via le site sont utilisées exclusivement pour
            permettre le bon fonctionnement de la plateforme et ne sont jamais revendues.
            L&apos;utilisateur dispose d&apos;un droit d&apos;accès, de rectification, d&apos;opposition,
            de portabilité, de limitation et de suppression de ses données personnelles, qu&apos;il
            peut exercer à tout moment par e-mail à{" "}
            <a href="mailto:contact@lockin-web.online" className={linkClass}>
              contact@lockin-web.online
            </a>
            .
          </p>
          <p className="mb-4">
            Pour en savoir plus, l&apos;utilisateur peut consulter la{" "}
            <Link href="/confidentialite" className={linkClass}>
              Politique de confidentialité
            </Link>
            . L&apos;utilisateur peut également introduire une réclamation auprès de la CNIL (
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className={linkClass}>
              www.cnil.fr
            </a>
            ) s&apos;il estime que ses droits ne sont pas respectés.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">6. Médiation de la consommation</h2>
          <p className="mb-4">
            Conformément à l&apos;article L612-1 du Code de la consommation, en cas de litige non
            résolu avec Coach-Nection, le consommateur peut recourir gratuitement au service de
            médiation de la consommation.
          </p>
          <p className="mb-2">Le médiateur désigné est :</p>
          <p className="mb-2">Société Médiation Professionnelle</p>
          <p className="mb-2">2 Rue Marc Sangnier, 33130 Bègles (siège social)</p>
          <p className="mb-2">
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
          <p className="mb-2">
            Adresse de saisine (à utiliser par les consommateurs pour toute demande de médiation) :
          </p>
          <p className="mb-4">
            Société Médiation Professionnelle – Alteritae
            <br />
            5 rue Salvaing, 12000 Rodez
          </p>
          <p>
            Plateforme européenne règlement en ligne des litiges :{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#1F2957] mb-4">7. Contact</h2>
          <p>
            Pour toute question, signalement de contenu ou demande de support, vous pouvez nous
            contacter à :{" "}
            <a href="mailto:contact@lockin-web.online" className={linkClass}>
              contact@lockin-web.online
            </a>
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
