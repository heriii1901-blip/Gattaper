import { useState } from 'react'
import { useAnimeDetail } from '../hooks/useAnimeDetail.js'

// Waktu tayang episode berikutnya, mis. "Jumat, 21 Nov 19.30"
const airing = (n) =>
  `Eps. ${n.episode} · ` +
  new Date(n.airingAt * 1000).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export function AnimeDetail({ aid, onBack }) {
  const { detail: d, status, eps, more } = useAnimeDetail(aid)
  const [full, setFull] = useState(false)

  const total = d && (d.episodes || (d.nextEp ? d.nextEp.episode - 1 : 0))
  const rows = d && [
    ['Studio', d.studios.join(', ')],
    ['Sumber asli', d.source],
    ['Status', d.status],
    ['Format', [d.format, d.year].filter(Boolean).join(' • ')],
    ['Skor', d.score ? `${d.score}/100` : ''],
    ['Episode berikut', d.nextEp ? airing(d.nextEp) : ''],
  ].filter(([, v]) => v)

  return (
    <div className="det">
      <button className="back" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 5l-7 7 7 7" /></svg>
        Kembali
      </button>

      {status === 'loading' && <div className="empty">Memuat…</div>}
      {status === 'error' && <div className="empty">Gagal memuat detail anime.</div>}

      {d && (
        <>
          <div className="det-top">
            <img className="det-cover" src={d.cover} alt="" referrerPolicy="no-referrer" />
            <div className="det-info">
              <h2>{d.title}</h2>
              {d.altTitle && <small>{d.altTitle}</small>}
              <dl>
                {rows.map(([k, v]) => (
                  <div key={k}><dt>{k}:</dt> <dd>{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>

          {d.description && (
            <div className="det-desc">
              <p className={full ? '' : 'clamp'}>{d.description}</p>
              {d.description.length > 180 && (
                <button onClick={() => setFull(!full)}>{full ? 'Sembunyikan' : 'Selengkapnya'}</button>
              )}
            </div>
          )}

          {d.genres.length > 0 && (
            <div className="chips">{d.genres.map((g) => <span key={g}>{g}</span>)}</div>
          )}

          <h3 className="det-h">{total ? `${total} episode` : 'Episode'}</h3>
          {eps.items.map((e) => (
            <div key={e.no} className="ep">
              <span className="ep-n">{e.no}</span>
              <div>
                <b>{e.title || `Episode ${e.no}`}</b>
                {(e.aired || e.filler) && <small>{[e.aired, e.filler && 'filler'].filter(Boolean).join(' • ')}</small>}
              </div>
            </div>
          ))}
          {eps.loading && <div className="empty" style={{ padding: 20 }}>Memuat episode…</div>}
          {!eps.loading && !eps.items.length && <div className="empty" style={{ padding: 20 }}>Belum ada daftar episode.</div>}
          {eps.hasNext && !eps.loading && <button className="more" onClick={more}>Muat lagi</button>}
        </>
      )}
    </div>
  )
}
