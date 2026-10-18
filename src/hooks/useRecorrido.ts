import { useCallback, useEffect, useState } from 'react'

/**
 * Estado del recorrido guiado.
 * indice = -1 → portada (vista general); 0..total-1 → paradas.
 * Teclado (útil con presentador inalámbrico): → / Espacio / PageDown avanza, ← / PageUp retrocede, Inicio vuelve a la portada.
 */
export function useRecorrido(total: number) {
  const [indice, setIndice] = useState(-1)

  const siguiente = useCallback(() => setIndice((i) => Math.min(i + 1, total - 1)), [total])
  const anterior = useCallback(() => setIndice((i) => Math.max(i - 1, -1)), [])
  const irA = useCallback((i: number) => setIndice(Math.max(-1, Math.min(i, total - 1))), [total])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Las flechas sobre la barra de la guía auditiva la adelantan; no cambian de parada
      if (e.target instanceof HTMLMediaElement || e.target instanceof HTMLInputElement) return
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        siguiente()
      } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        anterior()
      } else if (e.key === 'Home') {
        irA(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [siguiente, anterior, irA])

  return { indice, siguiente, anterior, irA }
}
