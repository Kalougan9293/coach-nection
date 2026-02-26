import Image from "next/image";

export interface CoachCardProps {
  name: string;
  ville: string;
  specialites: string[];
  photo?: string;
}

export default function CoachCard({
  name,
  ville,
  specialites,
  photo = "/placeholder-coach.jpg",
}: CoachCardProps) {
  const displaySpecs = specialites.slice(0, 3);

  return (
    <article className="h-full flex flex-col bg-white/60 backdrop-blur-md rounded-2xl border border-primary/10 shadow-soft hover:shadow-card hover:bg-white/80 transition-all overflow-hidden">
      {/* Photo carrée en haut */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl flex-shrink-0">
        <Image
          src={photo}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 320px) 288px, 288px"
        />
      </div>
      <div className="p-4 flex flex-col flex-1 min-h-0">
        {/* Prénom en gras */}
        <p className="font-bold text-primary text-base mb-2">{name}</p>
        {/* Lieu : bulle/pill bleue */}
        <span className="inline-flex self-start px-2 py-0.5 bg-primary/15 text-primary text-xs font-medium rounded-full mb-2">
          {ville}
        </span>
        {/* Spécialités : bulles/pills jaunes (1 à 3 max) */}
        <div className="flex gap-1.5 flex-wrap">
          {displaySpecs.map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 bg-secondary/60 text-primary text-xs font-medium rounded-full max-w-[100px] truncate"
              title={spec}
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
