import type { LngLat } from '../types'

export interface Anotacion {
  texto: string
  coordenadas: LngLat
  tipo: 'ciudad' | 'agua' | 'montana'
  rotacion?: number // grados, para seguir la forma del río o la montaña
}

/** Rótulos escritos "a mano" sobre el mapa (coordenadas aproximadas, verificar). */
export const anotaciones: Anotacion[] = [
  // Al sureste del centro para no tapar la parada de Bello Horizonte
  { texto: 'Valledupar', coordenadas: [-73.2, 10.43], tipo: 'ciudad' },
  { texto: 'Sierra Nevada de Santa Marta', coordenadas: [-73.55, 10.75], tipo: 'montana', rotacion: -8 },
  { texto: 'Serranía del Perijá', coordenadas: [-72.95, 10.4], tipo: 'montana', rotacion: -65 },
  { texto: 'río Guatapurí', coordenadas: [-73.29, 10.515], tipo: 'agua', rotacion: 25 },
  { texto: 'río Cesar', coordenadas: [-73.13, 10.36], tipo: 'agua', rotacion: -10 },
]
