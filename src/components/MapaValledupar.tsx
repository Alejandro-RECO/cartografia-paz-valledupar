import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import urlWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import {
  CAMARA_GENERAL,
  CAMARA_PARADA,
  DURACION_VUELO,
  LIMITES,
  MARGEN_PARADA,
  MARGEN_PORTADA,
} from '../config/map'
import { anotaciones } from '../data/anotaciones'
import { estiloPapelografo } from '../map/estiloPapelografo'
import { construirRuta, gradienteHasta } from '../map/ruta'
import { COLORES } from '../styles/colores'
import type { LngLat, Parada } from '../types'
import './MapaValledupar.css'

// MapLibre 6 calcula la ruta de su worker de forma relativa y Vite la rompe al preempaquetar: se la damos explícita
maplibregl.setWorkerUrl(urlWorker)

interface Props {
  paradas: Parada[]
  indice: number // -1 = vista general
  onSeleccionar: (i: number) => void
}

const sinMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const suavizar = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

/** Agrupa las paradas que comparten punto (V-02 y V-03 en Mariangola) sin mover el punto real. */
function agruparPorPunto(paradas: Parada[]) {
  const grupos = new Map<string, { coordenadas: LngLat; indices: number[] }>()
  paradas.forEach((p, i) => {
    if (!p.coordenadas) return // regla 4: sin ubicación, sin marcador
    const clave = p.coordenadas.join(',')
    const g = grupos.get(clave) ?? { coordenadas: p.coordenadas, indices: [] }
    g.indices.push(i)
    grupos.set(clave, g)
  })
  return [...grupos.values()]
}

export function MapaValledupar({ paradas, indice, onSeleccionar }: Props) {
  const contenedor = useRef<HTMLDivElement>(null)
  const mapa = useRef<maplibregl.Map | null>(null)
  const botones = useRef<(HTMLButtonElement | null)[]>([])
  const etiquetas = useRef<{ el: HTMLElement; indices: number[] }[]>([])
  const progreso = useRef(0)
  const primerVuelo = useRef(true)

  // Ruta solo entre paradas con ubicación; cada parada sabe en qué punto de la ruta está
  const ubicadas = useRef(paradas.map((p, i) => ({ p, i })).filter(({ p }) => p.coordenadas))
  const ruta = useRef(construirRuta(ubicadas.current.map(({ p }) => p.coordenadas!)))

  const progresoDeParada = (i: number) => {
    if (i < 0) return 0
    const ultimaUbicada = ubicadas.current.findLastIndex((u) => u.i <= i)
    return ultimaUbicada < 0 ? 0 : (ruta.current.progresos[ultimaUbicada] ?? 1)
  }

  // Crear el mapa una sola vez
  useEffect(() => {
    if (!contenedor.current) return
    const limites = new maplibregl.LngLatBounds()
    ubicadas.current.forEach(({ p }) => limites.extend(p.coordenadas!))

    const m = new maplibregl.Map({
      container: contenedor.current,
      style: estiloPapelografo(ruta.current.geojson),
      center: limites.getCenter(),
      zoom: 9,
      ...CAMARA_GENERAL,
      maxPitch: 85,
      maxBounds: LIMITES,
      attributionControl: { compact: true },
    })
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right')
    // En la vista general los rótulos de ríos tapan los pines: se ocultan por CSS
    const marcarDistancia = () => contenedor.current?.classList.toggle('mapa--lejos', m.getZoom() < 10)
    m.on('zoom', marcarDistancia)
    marcarDistancia()
    mapa.current = m

    for (const a of anotaciones) {
      // La rotación va en un hijo: `rotate` en la raíz también rotaría el desplazamiento que aplica MapLibre
      const el = document.createElement('span')
      el.className = `anotacion anotacion--${a.tipo}`
      el.setAttribute('aria-hidden', 'true')
      const texto = document.createElement('span')
      texto.className = 'anotacion__texto'
      texto.textContent = a.texto
      texto.style.rotate = `${a.rotacion ?? 0}deg`
      el.append(texto)
      new maplibregl.Marker({ element: el }).setLngLat(a.coordenadas).addTo(m)
    }

    // MapLibre controla el transform del elemento raíz; los círculos van en hijos
    for (const g of agruparPorPunto(paradas)) {
      const raiz = document.createElement('div')
      raiz.className = 'marcador'
      const circulos = document.createElement('div')
      circulos.className = 'marcador__circulos'
      for (const i of g.indices) {
        const b = document.createElement('button')
        b.className = 'marcador__circulo'
        b.textContent = String(i + 1)
        b.setAttribute(
          'aria-label',
          `Parada ${i + 1}: ${paradas[i].titulo}. ${paradas[i].ubicacion?.etiqueta ?? ''}`,
        )
        b.addEventListener('click', () => onSeleccionar(i))
        botones.current[i] = b
        circulos.append(b)
      }
      const etiqueta = document.createElement('span')
      etiqueta.className = 'marcador__etiqueta'
      raiz.append(circulos, etiqueta)
      etiquetas.current.push({ el: etiqueta, indices: g.indices })
      new maplibregl.Marker({ element: raiz }).setLngLat(g.coordenadas).addTo(m)
    }

    return () => {
      m.remove()
      mapa.current = null
      botones.current = []
      etiquetas.current = []
    }
    // paradas y onSeleccionar son estables durante la vida del mapa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Al cambiar de parada: volar, actualizar los pines y dibujar la ruta hasta ahí
  useEffect(() => {
    const m = mapa.current
    if (!m) return
    const quieto = sinMovimiento() || primerVuelo.current
    primerVuelo.current = false

    botones.current.forEach((b, i) => {
      if (!b) return
      b.classList.toggle('marcador__circulo--visitado', i < indice)
      b.classList.toggle('marcador__circulo--actual', i === indice)
      if (i === indice) b.setAttribute('aria-current', 'step')
      else b.removeAttribute('aria-current')
    })
    // Regla del mapa: la etiqueta «(ubicación aproximada)» siempre junto al punto activo
    for (const { el, indices } of etiquetas.current) {
      const activo = indices.includes(indice)
      el.textContent = activo ? (paradas[indice].ubicacion?.etiqueta ?? '') : ''
      el.closest('.marcador')?.classList.toggle('marcador--activo', activo)
    }

    const parada = paradas[indice]
    const duracion = quieto ? 0 : DURACION_VUELO
    if (parada?.coordenadas) {
      m.flyTo({
        center: parada.coordenadas,
        ...CAMARA_PARADA,
        padding: MARGEN_PARADA,
        duration: duracion,
        curve: 1.5,
      })
    } else {
      const limites = new maplibregl.LngLatBounds()
      ubicadas.current.forEach(({ p }) => limites.extend(p.coordenadas!))
      const margen = parada ? MARGEN_PARADA : MARGEN_PORTADA
      // cameraForBounds calcula el zoom sin inclinación; con la cámara inclinada hace falta alejar un poco más
      const camara = m.cameraForBounds(limites, { padding: margen, bearing: CAMARA_GENERAL.bearing })
      m.flyTo({
        center: limites.getCenter(),
        zoom: (camara?.zoom ?? 9) - 0.4,
        ...CAMARA_GENERAL,
        padding: margen, // el centro queda en la zona libre de hojas
        duration: duracion,
        curve: 1.5,
      })
    }

    const desde = progreso.current
    const hasta = progresoDeParada(indice)
    const inicio = performance.now()
    let cuadro = 0

    const pintar = (p: number) => {
      progreso.current = p
      if (!m.getLayer('ruta-recorrida')) return
      m.setPaintProperty('ruta-recorrida', 'line-gradient', gradienteHasta(p))
      m.setPaintProperty('ruta-borde', 'line-gradient', gradienteHasta(p, COLORES.negro))
    }
    const animar = (ahora: number) => {
      const t = quieto ? 1 : Math.min((ahora - inicio) / DURACION_VUELO, 1)
      pintar(desde + (hasta - desde) * suavizar(t))
      if (t < 1) cuadro = requestAnimationFrame(animar)
    }
    const empezar = () => (cuadro = requestAnimationFrame(animar))

    if (m.isStyleLoaded()) empezar()
    else m.once('load', empezar)

    return () => {
      cancelAnimationFrame(cuadro)
      m.off('load', empezar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indice, paradas])

  return <div ref={contenedor} className="mapa" />
}
