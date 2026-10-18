export type LngLat = [lng: number, lat: number]

export interface Camara {
  zoom: number
  pitch: number // inclinación 0–85 (más alto = más 3D)
  bearing: number // rotación en grados (0 = norte arriba)
}

export type Estado = 'CONFIRMADO' | 'CORROBORADO' | 'TESTIMONIO_ATRIBUIDO' | 'CONTROVERTIDO' | 'NO_VERIFICADO'

/* Esquema de datos/paradas.json (copia literal del documento de investigación, Parte X) */

export interface ParadaDatos {
  id: string
  orden: number
  slug: string
  titulo: string
  fecha: { valor: string; precision: string; estado: Estado; nota: string | null }
  lugar: {
    municipio: string
    departamento: string
    corregimiento: string | null
    referencia: string
    ambito: string
    precision: string
  }
  victimas_mortales: { cifra: number; estado: Estado; alternativas: { cifra: number; fuente: string }[] }
  victimas: { nombre: string; detalle: string | null; variantes?: string[] }[]
  actores: { texto: string; estado: Estado }
  estado_judicial: string
  texto_parada: string
  testimonios: { persona: string; relacion: string; fuente: string; estado: Estado }[]
  imagen_ia: { prompt_ref: string; tipo: string }
  fuentes: string[]
  advertencias: string[]
}

/* Esquema de datos/ubicaciones.json */
export interface Ubicacion {
  id: string
  lat: number
  lng: number
  precision: string
  etiqueta: string // ya incluye «(ubicación aproximada)»
  referencia: string
  fuente: string
  verificado_en_terreno: boolean
}

/* Esquema de datos/fuentes.json */
export interface Fuente {
  codigo: string
  titulo: string
  fecha: string | null
  tipo: string
  url: string
}

/** Parada lista para mostrar: datos de la investigación + ubicación + fuentes + imagen. */
export interface Parada extends ParadaDatos {
  coordenadas: LngLat | null // null = sin ubicación cargada: sin marcador (regla 4)
  ubicacion: Ubicacion | null
  fuentesDetalle: Fuente[]
  imagen: string | null
  audio: string | null // guía auditiva: lectura de la tarjeta (docs/guion-audio/)
}
