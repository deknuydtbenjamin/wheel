import { useState, useEffect } from "react";
import { jeux as initialJeux } from "./index";

//  Mets à true pour tester sans la limite d'un tirage par jour
const MODE_TEST = false;

export default function Wheel() {
  const radius = 150;

  const [jeux, setJeux] = useState(() => {
    const saved = localStorage.getItem("jeux-avent");
    return saved ? JSON.parse(saved) : initialJeux;
  });

  const [turn, setTurn] = useState(0);

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem("jeux-avent", JSON.stringify(jeux));
  }, [jeux]);

  const anglePerSegment = 360 / Math.max(jeux.length, 1);

  // --- Vérification limitation journalière ---
  const canSpinToday = () => {
    if (MODE_TEST) return true;

    const lastSpin = localStorage.getItem("avent-last-spin");
    const today = new Date().toDateString();

    return lastSpin !== today;
  };

  const saveSpinDate = () => {
    const today = new Date().toDateString();
    localStorage.setItem("avent-last-spin", today);
  };

  // --- Création des segments ---
  const getPath = (index: number) => {
    const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);

    const x1 = 200 + radius * Math.cos(startAngle);
    const y1 = 200 + radius * Math.sin(startAngle);
    const x2 = 200 + radius * Math.cos(endAngle);
    const y2 = 200 + radius * Math.sin(endAngle);

    const largeArc = anglePerSegment > 180 ? 1 : 0;

    return `
      M 200 200
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
  };

  // --- Tirage ---
  const spinWheel = () => {
    if (!canSpinToday()) {
      alert("🎄 Tu as déjà tiré aujourd’hui ! Reviens demain 😊");
      return;
    }

    if (jeux.length === 0) {
      alert("🎁 Plus aucun jeu disponible !");
      return;
    }

    const randomIndex = Math.floor(Math.random() * jeux.length);
    const finalAngle =
      360 - (randomIndex * anglePerSegment + anglePerSegment / 2);

    setTurn((prev) => prev + 360 * 5 + finalAngle);

    setTimeout(() => {
      const game = jeux[randomIndex];
      alert(`🎉 Gagné : ${game.name}`);

      // Supprime le jeu tiré
      setJeux((prev) => prev.filter((j) => j.id !== game.id));

      // Sauvegarde date du tirage
      saveSpinDate();
    }, 6000);
  };

  // --- Réinitialisation ---
  const resetWheel = () => {
    localStorage.removeItem("jeux-avent");
    localStorage.removeItem("avent-last-spin");
    setJeux(initialJeux);
    setTurn(0);
  };

  return (
    <section className="flex flex-col items-center bg-blue-950 min-h-screen py-10">
      <h1 className="bg-sky-500/40 mb-5 px-5 py-2 rounded-lg text-white text-xl">
        La roue de l'avent 🎄
      </h1>

      <div className="relative">
        {/* Flèche */}
        <div
          className="w-0 h-0 border-l-10 border-r-10 border-t-[30px]
          border-l-transparent border-r-transparent border-t-red-500
          absolute left-1/2 -translate-x-1/2 -top-4 z-10"
        ></div>

        {/* La roue */}
        <svg
          width="400"
          height="400"
          className="transition-transform duration-[6000ms]"
          style={{ transform: `rotate(${turn}deg)` }}
        >
          {jeux.map((j, index) => (
            <g key={j.id}>
              <path
                d={getPath(index)}
                fill={`hsl(${(index * 360) / jeux.length}, 70%, 50%)`}
                stroke="#222"
                strokeWidth="1"
              />

              <text
                x="200"
                y="200"
                fill="white"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`
                  rotate(${index * anglePerSegment + anglePerSegment / 2} 200 200)
                  translate(0, -110)
                `}
              >
                {j.name}
              </text>
            </g>
          ))}
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

