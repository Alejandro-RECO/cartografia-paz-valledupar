import './Convenciones.css'

/** Leyenda del mapa, como en los pliegos de cartografía social. */
export function Convenciones() {
  return (
    <aside className="convenciones hoja" aria-label="Convenciones del mapa">
      <span className="cinta" style={{ left: 110, width: 120, rotate: '-5deg' }} />
      <h2>Convenciones</h2>
      <ul>
        <li>
          <span className="muestra muestra--rio" />
          Ríos
        </li>
        <li>
          <span className="muestra muestra--montana" />
          Montaña
        </li>
        <li>
          <span className="muestra muestra--lugar" />
          Lugar de los hechos (ubicación aproximada)
        </li>
        <li>
          <span className="muestra muestra--recorrido" />
          Camino recorrido
        </li>
        <li>
          <span className="muestra muestra--pendiente" />
          Camino por recorrer
        </li>
      </ul>
    </aside>
  )
}
