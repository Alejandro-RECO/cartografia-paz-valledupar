import type { Estado } from '../types'

/** Nombres tal como los define la investigación; ninguno sube de categoría (regla 2). */
export const NOMBRES_ESTADO: Record<Estado, string> = {
  CONFIRMADO: 'Confirmado',
  CORROBORADO: 'Corroborado',
  TESTIMONIO_ATRIBUIDO: 'Testimonio atribuido',
  CONTROVERTIDO: 'Controvertido',
  NO_VERIFICADO: 'Sin verificar',
}
