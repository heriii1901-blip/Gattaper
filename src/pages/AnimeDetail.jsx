import { useState } from 'react'
import { useAnimeDetail } from '../hooks/useAnimeDetail.js'
import { useProgress } from '../hooks/useProgress.js'
import { Player, fmt } from './Player.jsx'

// Waktu tayang episode berikutnya, mis. "Jumat, 21 Nov 19.30"
const airing = (n) =>
  `Eps. ${n.episode} · ` +
  new Date(n.airingAt * 1000).toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const Heart = ({ on }) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
)

const Out = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
  </svg>
)

const UpDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
  </svg>
)

export function AnimeDetail({ aid, fav, onFav, onBack }) {
  const { detail: d, status, eps, more, all } = useAnimeDetail(aid)
  const [full, setFull] = useState(false)
  const [desc, setDesc] = useState(false) // false = terlama dulu, true = terbaru dulu
  const [playing, setPlaying] = useState(null) // episode yang lagi diputar
  const pg = useProgress()

  const total = d && (d.episodes || (d.nextEp ? d.nextEp.episode - 1 : 0))
  const rows = d && [
    ['Studio', d.studios.join(', ')],
    ['Sumber asli', d.source],
    ['Status', d.status],
    ['Format', [d.format, d.year].filter(Boolean).join(' • ')],
    ['Skor', d.score ? `${d.score}/100` : ''],
    ['Episode berikut', d.nextEp ? airing(d.nextEp) : ''],
  ].filter(([, v]) => v)

  // "Terbaru dulu" butuh semua episode, jadi sisa halaman dimuat otomatis
  const toggleSort = () => {
    const next = !desc
    setDesc(next)
    if (next) all()
  }
  const list = desc ? [...eps.items].reverse() : eps.items

  if (playing && d) return <Player anime={d} ep={playing} streams={d.streams} pg={pg} onBack={() => setPlaying(null)} />

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

          <div className="det-act">
            <button className={'act' + (fav ? ' on' : '')} onClick={() => onFav(d)}>
              <Heart on={fav} />{fav ? 'Difavoritkan' : 'Favorit'}
            </button>
            <a className="act" href={`https://anilist.co/anime/${d.aid}`} target="_blank" rel="noreferrer">
              <Out />AniList
            </a>
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

          <div className="det-bar">
            <h3 className="det-h">{total ? `${total} episode` : 'Episode'}</h3>
            <button className="sort" onClick={toggleSort}>
              {desc ? 'Terbaru dulu' : 'Terlama dulu'}<UpDown />
            </button>
          </div>

          <div className="eps">
            {list.map((e) => {
              const p = pg.get(d.aid, e.no)
              return (
                <div key={e.no} className={'epb' + (e.filler ? ' fil' : '') + (p?.done ? ' seen' : '')} onClick={() => setPlaying(e)}>
                  <b>{e.no}</b>
                  {(e.title || e.aired) && <small>{e.title || e.aired}</small>}
                  {p && <small className="pg">{p.done ? 'Selesai' : `Terakhir ${fmt(p.t)}`}</small>}
                  {p && !p.done && p.d > 0 && <i className="bar" style={{ width: `${Math.min(100, (p.t / p.d) * 100)}%` }} />}
                </div>
              )
            })}
          </div>
          {eps.loading && <div className="empty" style={{ padding: 20 }}>Memuat episode…</div>}
          {!eps.loading && !eps.items.length && <div className="empty" style={{ padding: 20 }}>Belum ada daftar episode.</div>}
          {eps.hasNext && !eps.loading && !desc && <button className="more" onClick={more}>Muat lagi</button>}
        </>
      )}
    </div>
  )
}
