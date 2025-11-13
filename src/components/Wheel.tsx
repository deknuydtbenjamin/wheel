import { useState } from "react"

export default function Wheel(){
const [turn, setTurn] = useState(180)

    return( 
    <section>
    <h1 className="bg-sky-500/40">la roue de la fortune!!!</h1>

    <div className="rounded-full w-96 h-96 border-2 border-dashed border-indigo-500 transition-transform duration-2000"
    style={{transform: `rotate(${turn}deg)`}}>

    </div>
        <button onClick={() =>setTurn(360)}>Tourner la roue</button>
    </section>)
}