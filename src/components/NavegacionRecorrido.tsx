import type { Parada } from '../types'
import './NavegacionRecorrido.css'

interface Props {
  paradas: Parada[]
  indice: number
  onAnterior: () => void
  onSiguiente: () => void
  onIrA: (i: number) => void
}

export function NavegacionRecorrido({ paradas, indice, onAnterior, onSiguiente, onIrA }: Props) {
  const esUltima = indice === paradas.length - 1

  return (
    <nav className="navegacion hoja" aria-label="Recorrido">
      <button className="boton" onClick={onAnterior}>
        {indice === 0 ? 'Portada' : 'Anterior'}
      </button>

      {/* Miniatura de la ruta: lo recorrido en cañaguate, lo que falta punteado */}
      <ol className="navegacion__ruta">
        {paradas.map((p, i) => (
          <li key={p.id} className={i < indice ? 'tramo tramo--recorrido' : 'tramo'}>
            <button
              className={
                i === indice ? 'punto punto--actual' : i < indice ? 'punto punto--visitado' : 'punto'
              }
              onClick={() => onIrA(i)}
              aria-current={i === indice ? 'step' : undefined}
              aria-label={`Parada ${i + 1}: ${p.titulo}`}
              title={p.titulo}
            >
              {i + 1}
            </button>
          </li>
        ))}
      </ol>

      <button className="boton boton--principal" onClick={onSiguiente} disabled={esUltima}>
        {esUltima ? 'Fin del recorrido' : 'Siguiente lugar'}
      </button>
    </nav>
  )
}
