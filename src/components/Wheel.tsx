import { useState } from "react"
import { jeux, type JeuxType } from "."

export default function Wheel(){
const [turn, setTurn] = useState(360)
const totalJeux = jeux.length
const segmentSize = 360/totalJeux



    return( 
    <section className="flex flex-col items-center bg-blue-950">
    <h1 className="bg-sky-500/40 mb-3">la roue de la fortune!!!</h1>
    <div className="w-0 h-0 border-l-10 border-r-10 border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 absolute top-9 z-2">
        
    </div>
     <div
        className="rounded-full w-96 h-96 border-4 border-dashed border-indigo-500 transition-transform duration-6000 mb-5 relative flex items-center justify-center"
        style={{ transform: `rotate(${turn}deg)` }}
      >
        {jeux.map((j: JeuxType, i: number) => {
          const angle = i * segmentSize; 
          return (
            <div
              key={j.id}
              className="absolute left-1/2 top-1/2 origin-bottom text-white text-sm "
              style={{
                transform: `rotate(${angle}deg) translateY(-100px)`,
              }}
            >
              {j.name}
            </div>
          );
        })}
      </div>
        <button onClick={() =>setTurn(1800)} className=" border-2 border-indigo-500">Tourner la roue</button>
    </section>
    )
}