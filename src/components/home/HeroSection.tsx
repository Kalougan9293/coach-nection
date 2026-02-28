export default function HeroSection() {
  const vimeoEmbedUrl = "https://player.vimeo.com/video/1087999976";

  return (
    <section className="relative py-4 md:py-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent blur-3xl -z-10" />

      <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Titre et sous-titre centrés */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-primary mb-2 tracking-tight w-full">
          Besoin d&apos;un coach ?
        </h1>
        <p className="text-xl md:text-2xl font-medium text-primary mb-1 w-full">
          On vous aide à trouver{" "}
          <span className="relative inline-block">
            <span className="relative z-10">le BON</span>
            <span
              className="absolute bottom-0 left-0 right-0 h-2.5 bg-secondary/70 -z-0"
              style={{ transform: "translateY(2px)" }}
            />
          </span>{" "}
          coach !
        </p>
        <p className="text-sm md:text-base text-primary/60 mb-6 w-full">
          Réseau de mise en relation Coach & Recruteur
        </p>

        {/* Vidéo : même largeur max que le bloc stats */}
        <div className="w-full rounded-2xl overflow-hidden shadow-soft min-w-0">
          <iframe
            src={vimeoEmbedUrl}
            title="Vidéo Coach-Nection"
            allow="fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full aspect-video block min-h-0"
          />
        </div>
      </div>
    </section>
  );
}
