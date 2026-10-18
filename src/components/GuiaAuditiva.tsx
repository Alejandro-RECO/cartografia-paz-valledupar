import { useRef, useState, type CSSProperties } from 'react'
import './GuiaAuditiva.css'

const formatear = (s: number) =>
  Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00'

/** Reproductor de la guía auditiva: lee la tarjeta en voz alta, en el mismo orden. */
export function GuiaAuditiva({ src, titulo }: { src: string; titulo: string }) {
  const ref = useRef<HTMLAudioElement>(null)
  const [sonando, setSonando] = useState(false)
  const [actual, setActual] = useState(0)
  const [duracion, setDuracion] = useState(0)

  const alternar = () => {
    const a = ref.current
    if (!a) return
    if (a.paused) void a.play()
    else a.pause()
  }

  return (
    <section className="guia" aria-label={`Guía auditiva: ${titulo}`}>
      <audio
        ref={ref}
        src={src}
        preload="metadata"
        onPlay={() => setSonando(true)}
        onPause={() => setSonando(false)}
        onEnded={() => setSonando(false)}
        onTimeUpdate={(e) => setActual(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
      />
      <button
        className="guia__boton"
        onClick={alternar}
        aria-label={sonando ? 'Pausar la guía auditiva' : 'Escuchar esta parada'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
          {sonando ? (
            <path d="M6 4h4v16H6zM14 4h4v16h-4z" fill="currentColor" />
          ) : (
            <path d="M7 4l13 8-13 8z" fill="currentColor" />
          )}
        </svg>
      </button>
      <div className="guia__cuerpo">
        <span className="guia__titulo">{sonando ? 'Escuchando la parada' : 'Escuchar esta parada'}</span>
        <input
          type="range"
          min={0}
          max={duracion || 0}
          step={0.1}
          value={actual}
          onChange={(e) => {
            if (ref.current) ref.current.currentTime = Number(e.target.value)
          }}
          aria-label="Posición de la guía auditiva"
          style={{ '--avance': `${duracion ? (actual / duracion) * 100 : 0}%` } as CSSProperties}
        />
      </div>
      <span className="guia__tiempo">
        {formatear(actual)} / {formatear(duracion)}
      </span>
    </section>
  )
}
