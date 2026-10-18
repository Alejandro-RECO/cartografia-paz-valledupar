import type { Camara, LngLat } from '../types'

/** Vista general: el municipio completo con la Sierra al norte. Se encuadra con todas las paradas. */
export const CAMARA_GENERAL = { pitch: 50, bearing: -15 }

/**
 * Al volar a una parada. Zoom de corregimiento, no de calle:
 * las ubicaciones son aproximadas (centro del corregimiento o barrio).
 */
export const CAMARA_PARADA: Camara = { zoom: 13.2, pitch: 60, bearing: -15 }

/** Espacio que ocupan las hojas sobre el mapa, para que el punto quede en la parte visible. */
export const MARGEN_PORTADA = { top: 120, bottom: 140, left: 1000, right: 460 } // título a la izquierda, convenciones a la derecha
export const MARGEN_PARADA = { top: 80, bottom: 200, left: 80, right: 780 }

/** Cuánto se exagera el relieve. 1 = real; 1.5 hace visible la Sierra sin deformar la ciudad. */
export const EXAGERACION_TERRENO = 1.5

/** Duración del vuelo entre paradas, en ms. */
export const DURACION_VUELO = 4500

/**
 * Limita el mapa a la región para no cargar teselas innecesarias.
 * Ojo: si es muy estrecho, MapLibre no deja alejar la cámara y la vista general no cabe.
 */
export const LIMITES: [LngLat, LngLat] = [
  [-75.5, 9.0],
  [-71.5, 11.9],
]

/**
 * Fuentes de datos (gratis, sin API key):
 * - Vectores: OpenFreeMap (OpenStreetMap, esquema OpenMapTiles)
 * - Relieve: Terrain Tiles de AWS / Mapzen (formato terrarium)
 */
export const FUENTES = {
  vectores: 'https://tiles.openfreemap.org/planet',
  glifos: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  relieve: 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
}
