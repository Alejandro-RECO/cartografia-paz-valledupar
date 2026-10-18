import { Convenciones } from './components/Convenciones'
import { MapaValledupar } from './components/MapaValledupar'
import { NavegacionRecorrido } from './components/NavegacionRecorrido'
import { PanelParada } from './components/PanelParada'
import { Portada } from './components/Portada'
import { paradas } from './data/recorrido'
import { useRecorrido } from './hooks/useRecorrido'

export default function App() {
  const { indice, siguiente, anterior, irA } = useRecorrido(paradas.length)
  const parada = paradas[indice]

  return (
    <>
      <MapaValledupar paradas={paradas} indice={indice} onSeleccionar={irA} />
      <div className="textura-papel" aria-hidden="true" />

      {parada ? (
        <>
          <PanelParada parada={parada} numero={indice + 1} />
          <NavegacionRecorrido
            paradas={paradas}
            indice={indice}
            onAnterior={anterior}
            onSiguiente={siguiente}
            onIrA={irA}
          />
        </>
      ) : (
        <>
          <Convenciones />
          <Portada onComenzar={siguiente} />
        </>
      )}
    </>
  )
}
