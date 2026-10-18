import type { Estado, Parada } from '../types'
import { NOMBRES_ESTADO } from './estados'
import { formatearFecha, fuente, ROTULO_IA } from './recorrido'

/*
 * Guion de la guía auditiva: lee la tarjeta de cada parada (PanelParada.tsx) tal cual,
 * en el mismo orden y con los mismos textos. Si cambia el orden de la tarjeta, cambiarlo aquí también.
 */

/** Asegura que cada frase termine en punto, para que la voz haga la pausa. */
const frase = (texto: string) => (/[.!?…]$/.test(texto.trim()) ? texto.trim() : `${texto.trim()}.`)
const estado = (e: Estado) => `Estado de verificación: ${NOMBRES_ESTADO[e].toLowerCase()}.`
const minuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1)
const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** Párrafos del guion de una parada, en el orden de la tarjeta. */
export function guionDeParada(p: Parada, numero: number): string[] {
  const bloques: string[] = []

  // Imagen
  if (p.imagen) bloques.push(`Imagen. ${frase(ROTULO_IA)}`)

  // Encabezado
  bloques.push(`Parada ${numero}. ${frase(p.titulo)}`)
  const aproximada = p.fecha.precision === 'aproximada' ? ' (fecha aproximada)' : ''
  bloques.push(`${mayuscula(formatearFecha(p.fecha.valor))}${aproximada}. ${estado(p.fecha.estado)}`)
  if (p.fecha.nota) bloques.push(frase(p.fecha.nota))

  // Lugar
  bloques.push(`${frase(p.ubicacion?.etiqueta ?? 'Sin ubicación en el mapa')} ${frase(p.lugar.referencia)}`)

  // Relato
  bloques.push(frase(p.texto_parada))

  // Víctimas
  const cifra = p.victimas_mortales
  const victimas = [`Víctimas. ${cifra.cifra} víctimas mortales. ${estado(cifra.estado)}`]
  for (const a of cifra.alternativas) {
    const f = fuente(a.fuente)
    victimas.push(
      f ? `Otra fuente registra ${a.cifra}: ${frase(f.titulo)}` : `Otra fuente registra ${a.cifra}.`,
    )
  }
  for (const v of p.victimas) {
    let linea = v.detalle ? `${frase(v.nombre)} ${frase(v.detalle)}` : frase(v.nombre)
    if (v.variantes?.length) linea += ` También registrado como ${frase(v.variantes.join(', '))}`
    victimas.push(linea)
  }
  bloques.push(victimas.join('\n'))

  // Responsables
  bloques.push(
    `Responsables. ${frase(p.actores.texto)} ${estado(p.actores.estado)}\nEstado judicial: ${frase(p.estado_judicial)}`,
  )

  // Testimonios
  if (p.testimonios.length > 0) {
    const lineas = p.testimonios.map((t) => {
      const f = fuente(t.fuente)
      return `${t.persona}, ${frase(minuscula(t.relacion))} ${estado(t.estado)}${f ? ` Fuente: ${frase(f.titulo)}` : ''}`
    })
    bloques.push(['Testimonios.', ...lineas].join('\n'))
  }

  // Fuentes
  const fuentes = p.fuentesDetalle.map((f) =>
    f.fecha ? `${f.titulo}, ${frase(formatearFecha(f.fecha))}` : frase(f.titulo),
  )
  bloques.push(['Fuentes.', ...fuentes].join('\n'))

  return bloques
}
