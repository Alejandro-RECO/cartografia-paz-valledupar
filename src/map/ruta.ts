import type { Feature, LineString } from 'geojson'
import type { ExpressionSpecification } from 'maplibre-gl'
import { COLORES } from '../styles/colores'
import type { LngLat } from '../types'

const PUNTOS_POR_TRAMO = 32
const CURVATURA = 0.18 // 0 = recta; alterna de lado en cada tramo, como un trazo a mano

function bezier(a: LngLat, c: LngLat, b: LngLat, t: number): LngLat {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]
}

/**
 * Línea curva que une las paradas en orden.
 * `progresos[i]` es la fracción (0–1) de la ruta en la que está la parada i.
 */
export function construirRuta(puntos: LngLat[]) {
  const coords: LngLat[] = []
  const largos: number[] = []

  for (let i = 0; i < puntos.length - 1; i++) {
    const a = puntos[i]
    const b = puntos[i + 1]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const lado = i % 2 === 0 ? 1 : -1
    const control: LngLat = [
      (a[0] + b[0]) / 2 - dy * CURVATURA * lado,
      (a[1] + b[1]) / 2 + dx * CURVATURA * lado,
    ]
    for (let t = i === 0 ? 0 : 1; t <= PUNTOS_POR_TRAMO; t++)
      coords.push(bezier(a, control, b, t / PUNTOS_POR_TRAMO))
    largos.push(Math.hypot(dx, dy))
  }

  const total = largos.reduce((s, l) => s + l, 0) || 1
  const progresos = [0]
  for (const l of largos) progresos.push(progresos[progresos.length - 1] + l / total)

  const geojson: Feature<LineString> = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: coords },
  }
  return { geojson, progresos }
}

/** Pinta la línea hasta `progreso` (0–1) con `color`; el resto queda transparente. */
export function gradienteHasta(progreso: number, color: string = COLORES.canaguate): ExpressionSpecification {
  return ['step', ['line-progress'], color, Math.max(progreso, 0.0001), 'rgba(0,0,0,0)']
}
