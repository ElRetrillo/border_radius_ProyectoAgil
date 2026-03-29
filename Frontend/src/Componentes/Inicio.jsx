import { useState } from "react";
import "../Css/BarraLateral.css";

function Inicio() {
    const [abrirBarra, setAbrirBarra] = useState(false);

    return (
        <div className="inicio">
            <header className="headerBarraLateral">
                <div className="izquierda">
                    <button className="botonMenu" onClick={() => setAbrirBarra(!abrirBarra)}> 
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div className="derecha">
                    <p className="usuario">Usuario</p>
                </div>
            </header>

            <div className={`barra-lateral ${abrirBarra ? "activa" : ""}`}>
                <h2>Canales</h2>
                <ul>
                    <li>Opción 1</li>
                    <li>Opción 2</li>
                    <li>Opción 3</li>
                </ul>
            </div>
        </div>
    )
}
export default Inicio;