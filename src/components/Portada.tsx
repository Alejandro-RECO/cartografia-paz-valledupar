import { PROYECTO } from '../config/proyecto'
import { paradas, PERIODO } from '../data/recorrido'
import './Portada.css'

export function Portada({ onComenzar }: { onComenzar: () => void }) {
  return (
    <header className="portada hoja">
      <span className="cinta" style={{ left: 48, rotate: '-4deg' }} />
      <span className="cinta" style={{ right: 48, rotate: '5deg' }} />
      <h1>{PROYECTO.titulo}</h1>
      <p className="portada__lema">{PROYECTO.lema}</p>
      <p className="portada__aviso">
        Este recorrido narra {paradas.length} masacres ocurridas en Valledupar entre {PERIODO.desde} y{' '}
        {PERIODO.hasta}. Contiene relatos de violencia y nombres de víctimas.
      </p>
      <div className="portada__accion">
        <button className="boton boton--principal" onClick={onComenzar} autoFocus>
          Empezar el recorrido
        </button>
        <span className="portada__ayuda">Avanza con las flechas del teclado</span>
      </div>
      <p className="portada__creditos">{PROYECTO.creditos}</p>
    </header>
  )
}
