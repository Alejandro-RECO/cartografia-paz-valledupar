import { formatearFecha, fuente, ROTULO_IA } from '../data/recorrido'
import type { Fuente, Parada } from '../types'
import { EtiquetaEstado } from './EtiquetaEstado'
import { GuiaAuditiva } from './GuiaAuditiva'
import './PanelParada.css'

interface Props {
  parada: Parada
  numero: number
}

function EnlaceFuente({ f }: { f: Fuente }) {
  return (
    <a href={f.url} target="_blank" rel="noreferrer">
      {f.titulo}
    </a>
  )
}

export function PanelParada({ parada: p, numero }: Props) {
  const cifra = p.victimas_mortales

  return (
    // key reinicia el panel (y su scroll) al cambiar de parada
    <article key={p.id} className="panel hoja" aria-live="polite">
      <span className="cinta" style={{ left: 'calc(50% - 70px)', rotate: '-3deg' }} />
      <div className="panel__contenido">
        {p.audio && <GuiaAuditiva src={p.audio} titulo={p.titulo} />}

        {p.imagen && (
          <figure className="panel__imagen">
            <img src={p.imagen} alt={`Recreación visual: ${p.imagen_ia.tipo}`} />
            <figcaption>{ROTULO_IA}</figcaption>
          </figure>
        )}

        <header className="panel__encabezado">
          <span className="panel__numero" aria-hidden="true">
            {numero}
          </span>
          <div>
            <h2 className="panel__titulo">{p.titulo}</h2>
            <p className="panel__fecha">
              {formatearFecha(p.fecha.valor)}
              {p.fecha.precision === 'aproximada' && ' (fecha aproximada)'}{' '}
              <EtiquetaEstado estado={p.fecha.estado} />
            </p>
          </div>
        </header>

        {p.fecha.nota && <p className="panel__nota">{p.fecha.nota}</p>}

        <p className="panel__lugar">
          <strong>{p.ubicacion?.etiqueta ?? 'Sin ubicación en el mapa'}</strong>
          <br />
          {p.lugar.referencia}
        </p>

        <p className="panel__texto">{p.texto_parada}</p>

        <section className="panel__seccion">
          <h3>Víctimas</h3>
          <p>
            {cifra.cifra} víctimas mortales <EtiquetaEstado estado={cifra.estado} />
          </p>
          {cifra.alternativas.map((a) => {
            const f = fuente(a.fuente)
            return (
              <p key={a.fuente} className="panel__nota">
                Otra fuente registra {a.cifra}
                {f && (
                  <>
                    {': '}
                    <EnlaceFuente f={f} />
                  </>
                )}
              </p>
            )
          })}
          <ul className="panel__victimas">
            {p.victimas.map((v, i) => (
              <li key={i}>
                <strong>{v.nombre}</strong>
                {v.detalle ? `. ${v.detalle}.` : '.'}
                {v.variantes && v.variantes.length > 0 && (
                  <span className="panel__variante"> También registrado como {v.variantes.join(', ')}.</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel__seccion">
          <h3>Responsables</h3>
          <p>
            {p.actores.texto} <EtiquetaEstado estado={p.actores.estado} />
          </p>
          <p>
            <strong>Estado judicial:</strong> {p.estado_judicial}
          </p>
        </section>

        {p.testimonios.length > 0 && (
          <section className="panel__seccion">
            <h3>Testimonios</h3>
            <ul className="panel__lista">
              {p.testimonios.map((t) => {
                const f = fuente(t.fuente)
                return (
                  <li key={t.persona}>
                    <strong>{t.persona}</strong>, {t.relacion.charAt(0).toLowerCase() + t.relacion.slice(1)}.{' '}
                    <EtiquetaEstado estado={t.estado} />
                    {f && (
                      <>
                        <br />
                        <EnlaceFuente f={f} />
                      </>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <section className="panel__seccion">
          <h3>Fuentes</h3>
          <ol className="panel__lista">
            {p.fuentesDetalle.map((f) => (
              <li key={f.codigo}>
                <EnlaceFuente f={f} />
                {f.fecha && <span className="panel__variante"> ({formatearFecha(f.fecha)})</span>}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </article>
  )
}
