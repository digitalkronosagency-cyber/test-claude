interface SeancesDotsProps {
  total: number;
  restantes: number;
  couleurPrincipale: string;
}

export default function SeancesDots({ total, restantes, couleurPrincipale }: SeancesDotsProps) {
  const consommees = total - restantes;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {Array.from({ length: total }).map((_, i) => {
        const pleine = i >= consommees; // les premières sont consommées
        return (
          <span
            key={i}
            className="w-4 h-4 rounded-full border-2 transition-all"
            style={{
              borderColor: couleurPrincipale,
              background: pleine ? couleurPrincipale : "transparent",
              opacity: pleine ? 1 : 0.3,
            }}
            title={pleine ? "Séance disponible" : "Séance utilisée"}
            aria-label={pleine ? "Séance disponible" : "Séance utilisée"}
          />
        );
      })}
      <span className="text-sm font-semibold text-gray-700 ml-1">
        {restantes}
        <span className="text-gray-400 font-normal"> / {total}</span>
      </span>
    </div>
  );
}
