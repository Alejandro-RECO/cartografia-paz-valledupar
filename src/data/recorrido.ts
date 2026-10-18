import datosFuentes from '../../datos/fuentes.json'
import datosAudios from '../../datos/audios.json'
import datosImagenes from '../../datos/imagenes.json'
import datosParadas from '../../datos/paradas.json'
import datosUbicaciones from '../../datos/ubicaciones.json'
import type { Fuente, Parada, ParadaDatos, Ubicacion } from '../types'

/*
 * Une los archivos de datos/ en las paradas del recorrido. No reinterpreta ni completa nada:
 * si falta un dato, la parada se muestra sin él (reglas 1 y 4 de CLAUDE.md).
 */

const fuentes = datosFuentes.fuentes as Record<string, Omit<Fuente, 'codigo'>>
const ubicaciones = datosUbicaciones.coordenadas_paradas as Ubicacion[]
const imagenes = datosImagenes as Record<string, string>
const audios = datosAudios as Record<string, string>

/** Busca una fuente por su código (F1…F26) en datos/fuentes.json. */
export function fuente(codigo: string): Fuente | null {
  const f = fuentes[codigo]
  return f ? { codigo, ...f } : null
}

export const ROTULO_IA = datosParadas.rotulo_ia
export const DEFINICION_MASACRE = datosParadas.definicion_masacre

export const paradas: Parada[] = (datosParadas.paradas as unknown as ParadaDatos[])
  .toSorted((a, b) => a.orden - b.orden)
  .map((p) => {
    const ubicacion = ubicaciones.find((u) => u.id === p.id) ?? null
    if (!ubicacion)
      console.warn(`${p.id} no tiene ubicación en datos/ubicaciones.json: se muestra sin marcador`)

    const fuentesDetalle = p.fuentes.flatMap((codigo) => {
      const f = fuentes[codigo]
      if (!f) console.warn(`${p.id}: la fuente ${codigo} no está en datos/fuentes.json`)
      return f ? [{ codigo, ...f }] : []
    })

    return {
      ...p,
      ubicacion,
      coordenadas: ubicacion ? [ubicacion.lng, ubicacion.lat] : null,
      fuentesDetalle,
      imagen: imagenes[p.id] ?? null,
      audio: audios[p.id] ?? null,
    }
  })

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

/** "1996-11-22" → "22 de noviembre de 1996"; "1997-09" → "septiembre de 1997". */
export function formatearFecha(valor: string): string {
  const [anio, mes, dia] = valor.split('-').map(Number)
  if (dia) return `${dia} de ${MESES[mes - 1]} de ${anio}`
  if (mes) return `${MESES[mes - 1]} de ${anio}`
  return String(anio)
}

/** Años del primer y último caso, para la portada. */
export const PERIODO = {
  desde: Math.min(...paradas.map((p) => Number(p.fecha.valor.slice(0, 4)))),
  hasta: Math.max(...paradas.map((p) => Number(p.fecha.valor.slice(0, 4)))),
}
