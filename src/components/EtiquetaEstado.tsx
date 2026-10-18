import { NOMBRES_ESTADO } from '../data/estados'
import type { Estado } from '../types'
import './EtiquetaEstado.css'

export function EtiquetaEstado({ estado }: { estado: Estado }) {
  return (
    <span className={`estado estado--${estado.toLowerCase()}`} title="Estado de verificación">
      {NOMBRES_ESTADO[estado] ?? estado}
    </span>
  )
}
