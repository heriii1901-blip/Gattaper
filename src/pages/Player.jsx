import { useEffect, useRef, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

// 754 -> "12:34", 3725 -> "1:02:05"
export const fmt = (s) => {
  s = Math.floor(s || 0)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`
}

export function Player({ anime, ep, streams, pg, onBack }) {
  const vid = useRef(null)
  const last = useRef({ t: 0, d: 0, saved: 0 })
  const url = pg.link(anime.aid, ep.no)
  const [input, setInput] = useState('')
  const [editing, setEditing] = useState(!url)
  const [err, setErr] = useState(false)
  const old = pg.get(anime.aid, ep.no)
  const [resumed, setResumed] = useState(0)

  const flush = () => {
    const { t, d } = last.current
    if (d > 0) pg.save(anime.aid, ep.no, t, d)
  }

  // simpan pas keluar halaman player, tab disembunyiin, atau browser ditutup
  useEffect(() => {
    const hide = () => document.visibilityState === 'hidden' && flush()
    document.addEventListener('visibilitychange', hide)
    window.addEventListener('pagehide', flush)
    return () => {
      document.removeEventListener('visibilitychange', hide)
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [])

  const onMeta = (e) => {
    const v = e.currentTarget
    last.current.d = v.duration
    // lanjut dari menit terakhir (kecuali episode sudah tamat -> mulai dari awal)
    if (old && !old.done && old.t > 5 && old.t < v.duration - 5) {
      v.currentTime = old.t
      setResumed(old.t)
    }
  }

  const onTime = (e) => {
    const v = e.currentTarget
    last.current.t = v.currentTime
    last.current.d = v.duration || last.current.d
    // simpan tiap ~5 detik
    if (Math.abs(v.currentTime - last.current.saved) >= 5) {
      last.current.saved = v.currentTime
      flush()
    }
  }

  const submit = () => {
    const v = input.trim()
    if (!/^https?:\/\//i.test(v)) return
    pg.setLink(anime.aid, ep.no, v)
    setInput('')
    setErr(false)
    setEditing(false)
  }

  return (
    <div className="det ply">
      <button className="back" onClick={onBack}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 5l-7 7 7 7" /></svg>
        Kembali
      </button>

      <h3>{anime.title}</h3>
      <p className="note">Episode {ep.no}{ep.title ? ` · ${ep.title}` : ''}</p>

      {url && (
        <video
          key={url}
          ref={vid}
          src={url}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={onMeta}
          onTimeUpdate={onTime}
          onPause={flush}
          onEnded={flush}
          onError={() => setErr(true)}
        />
      )}

      {url && resumed > 0 && <p className="note">Lanjut dari menit {fmt(resumed)}</p>}
      {err && <p className="note err">Video gagal diputar. Cek linknya, atau formatnya bukan .mp4/.webm, atau server videonya memblokir.</p>}

      {url && !editing && (
        <div className="det-act">
          <button className="act" onClick={() => setEditing(true)}>Ganti link</button>
          <button className="act" onClick={() => pg.setLink(anime.aid, ep.no, '')}>Hapus link</button>
        </div>
      )}

      {editing && (
        <>
          <p className="note">
            {url ? 'Tempel link video baru:' : 'Episode ini belum punya video. Tempel link video langsung (.mp4 / .webm), misalnya file kamu di Cloudflare R2:'}
          </p>
          <input
            placeholder="https://…/episode-1.mp4"
            value={input}
            inputMode="url"
            enterKeyHint="done"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
          <div className="det-act">
            <button className="act on" onClick={submit}>Simpan &amp; putar</button>
            {url && <button className="act" onClick={() => setEditing(false)}>Batal</button>}
          </div>
        </>
      )}

      {streams?.length > 0 && (
        <>
          <p className="note">Tonton resmi di:</p>
          <div className="chips lnk">
            {streams.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.site}</a>
            ))}
          </div>
          <p className="note">Kalau nonton lewat situs resmi, menit terakhirnya gak bisa ikut kecatat di Gattaper.</p>
        </>
      )}
    </div>
  )
}
