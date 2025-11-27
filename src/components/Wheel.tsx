import { useState, useEffect } from "react";
import { jeux as initialJeux, type JeuxType } from "./index";

// Passe à true pour tester sans limite journalière
const MODE_TEST = false;

export default function Wheel() {
  const radius = 250;
  const svgSize = 600;
  const cx = svgSize / 2;
  const cy = svgSize / 2;

  const [jeux, setJeux] = useState<JeuxType[]>(() => {
    const saved = localStorage.getItem("jeux-avent");
    return saved ? JSON.parse(saved) : initialJeux;
  });

  const [turn, setTurn] = useState(0);

  // Persistance
  useEffect(() => {
    localStorage.setItem("jeux-avent", JSON.stringify(jeux));
  }, [jeux]);

  const anglePerSegment = 360 / Math.max(jeux.length, 1);

  const canSpinToday = () => {
    if (MODE_TEST) return true;
    const lastSpin = localStorage.getItem("avent-last-spin");
    const today = new Date().toDateString();
    return lastSpin !== today;
  };

  const saveSpinDate = () => {
    localStorage.setItem("avent-last-spin", new Date().toDateString());
  };

  // trace d'un arc (fonction stable même pour 1 ou 2 segments)
  const getPath = (index: number) => {
    if (jeux.length === 1) {
      return `
        M ${cx} ${cy}
        m -${radius}, 0
        a ${radius},${radius} 0 1,0 ${radius * 2},0
        a ${radius},${radius} 0 1,0 -${radius * 2},0
      `;
    }

    const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = anglePerSegment > 180 ? 1 : 0;

    return `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
  };

  const spinWheel = () => {
    if (!canSpinToday()) {
      alert("🎄 Tu as déjà tiré aujourd'hui — reviens demain !");
      return;
    }
    if (jeux.length === 0) {
      alert("🎁 Plus aucun jeu !");
      return;
    }

    const randomIndex = Math.floor(Math.random() * jeux.length);

    // angle pour aligner le milieu du segment sous la flèche
    const finalAngle = 360 - (randomIndex * anglePerSegment + anglePerSegment / 2);

    setTurn((prev) => prev + 360 * 5 + finalAngle);

    // après l'animation, supprimer et sauvegarder la date
    setTimeout(() => {
      const game = jeux[randomIndex];
      alert(`🎉 Gagné : ${game.name}`);
      setJeux((prev) => prev.filter((j) => j.id !== game.id));
      saveSpinDate();
    }, 6000);
  };

  const resetWheel = () => {
    localStorage.removeItem("jeux-avent");
    localStorage.removeItem("avent-last-spin");
    setJeux(initialJeux);
    setTurn(0);
  };

  // distance du centre où on place le texte (ajustable)
  const textRadius = radius * 0.88;

  return (
    <section className="flex flex-col items-center bg-blue-950 min-h-screen py-10">
      <h1 className="bg-sky-500/40 mb-5 px-5 py-2 rounded-lg text-white text-xl">
        La roue de l'avent 🎄
      </h1>

      <div className="relative">
        {/* flèche */}
        <div
          className="w-0 h-0 border-l-10 border-r-10 border-t-[30px]
            border-l-transparent border-r-transparent border-t-red-500
            absolute left-1/2 -translate-x-1/2 -top-4 z-10"
        />

        <svg
          width={svgSize}
          height={svgSize}
          className="transition-transform duration-[6000ms]"
          style={{ transform: `rotate(${turn}deg)` }}
        >
          {jeux.map((j, index) => {
            const angleStart = index * anglePerSegment;
            const angleMid = angleStart + anglePerSegment / 2;
            const angleMidRad = (angleMid - 90) * (Math.PI / 180);

            // position radiale pour le texte (x,y)
            const textX = cx + textRadius * Math.cos(angleMidRad);
            const textY = cy + textRadius * Math.sin(angleMidRad);

            const hue = (index * 360) / Math.max(jeux.length, 1);

            return (
              <g key={j.id}>
                <path d={getPath(index)} fill={`hsl(${hue},70%,50%)`} stroke="#111" strokeWidth="1" />

                {/* texte vertical : on place un <text> au point (textX,textY), on le fait tourner pour s'aligner, 
                    et on empile des <tspan> pour chaque caractère */}
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize={12}
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${angleMid} ${textX} ${textY})`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {j.name.split("").map((ch, i) => (
                    <tspan key={i} x={textX} dy={i === 0 ? 0 : "1.05em"}>
                      {ch}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <button
        onClick={spinWheel}
        className="mt-6 px-6 py-3 border-2 border-indigo-500 text-white rounded-lg"
      >
        Tourner la roue
      </button>

      <button
        onClick={resetWheel}
        className="mt-3 px-6 py-2 text-sm border border-gray-400 text-white rounded-lg"
      >
        Réinitialiser
      </button>
    </section>
  );
}


