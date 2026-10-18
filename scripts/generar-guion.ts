/**
 * Genera el guion de la guía auditiva a partir de los mismos datos que muestra la tarjeta.
 * Uso: npm run guion
 * Salida: docs/guion-audio.md (todo junto) y docs/guion-audio/parada-N-<slug>.txt (uno por parada, listo para la voz).
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { guionDeParada } from '../src/data/guion.ts'
import { paradas } from '../src/data/recorrido.ts'

const carpeta = 'docs/guion-audio'
mkdirSync(carpeta, { recursive: true })

const md = [
  '# Guion de la guía auditiva',
  '',
  'Generado con `npm run guion` a partir de `datos/`. No editar a mano: lee la tarjeta de cada parada tal cual y en el mismo orden.',
  '',
]

paradas.forEach((p, i) => {
  const numero = i + 1
  const bloques = guionDeParada(p, numero)
  const texto = bloques.join('\n\n') + '\n'
  writeFileSync(`${carpeta}/parada-${numero}-${p.slug}.txt`, texto)

  const palabras = texto.split(/\s+/).filter(Boolean).length
  const minutos = (palabras / 150).toFixed(1) // ~150 palabras por minuto en locución pausada
  md.push(`## Parada ${numero}. ${p.titulo}`, '', `*${palabras} palabras · unos ${minutos} min*`, '', texto)
  console.log(`parada-${numero}-${p.slug}.txt  ${palabras} palabras  ~${minutos} min`)
})

writeFileSync('docs/guion-audio.md', md.join('\n'))
console.log('docs/guion-audio.md')
