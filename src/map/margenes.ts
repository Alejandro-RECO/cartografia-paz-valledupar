import type { PaddingOptions } from 'maplibre-gl'

const SEPARACION = 24 // px entre una hoja y el punto encuadrado
const MINIMO_LIBRE = 160 // px de mapa que siempre deben quedar visibles en cada eje

/**
 * Calcula el margen que la cámara debe dejar para que el punto quede en la zona de mapa
 * que no tapan las hojas (portada, convenciones, panel, navegación).
 * Mide las hojas reales en pantalla, así funciona en cualquier tamaño y orientación.
 */
export function margenLibre(): PaddingOptions {
  const ancho = window.innerWidth
  const alto = window.innerHeight
  const libre = { left: 0, top: 0, right: ancho, bottom: alto }

  for (const hoja of document.querySelectorAll<HTMLElement>('.hoja')) {
    const r = hoja.getBoundingClientRect()
    if (
      r.width === 0 ||
      r.right <= libre.left ||
      r.left >= libre.right ||
      r.bottom <= libre.top ||
      r.top >= libre.bottom
    )
      continue

    // Recortar la zona libre por el lado que conserve más área de mapa
    const opciones = [
      { ...libre, left: Math.max(libre.left, r.right + SEPARACION) },
      { ...libre, right: Math.min(libre.right, r.left - SEPARACION) },
      { ...libre, top: Math.max(libre.top, r.bottom + SEPARACION) },
      { ...libre, bottom: Math.min(libre.bottom, r.top - SEPARACION) },
    ].filter((o) => o.right - o.left >= MINIMO_LIBRE && o.bottom - o.top >= MINIMO_LIBRE)

    const mejor = opciones.sort((a, b) => area(b) - area(a))[0]
    if (mejor) Object.assign(libre, mejor)
  }

  return { left: libre.left, top: libre.top, right: ancho - libre.right, bottom: alto - libre.bottom }
}

const area = (z: { left: number; top: number; right: number; bottom: number }) =>
  (z.right - z.left) * (z.bottom - z.top)
