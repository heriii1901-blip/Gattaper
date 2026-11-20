import { useState, useEffect, useRef } from 'react'
import { useLiquidPill } from './useLiquidPill.js'
import { NAME_KOLEKSI, CATS, SEED, col, ago } from './data.js'

const P = {
  anime: <><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  video: <><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="currentColor" /></>,
  foto: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  koleksi: <path d="M4 4h6v16H4zM14 4h6v16h-6z" />,
  riwayat: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  cari: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  profil: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
}
const Icon = ({ n, s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{P[n]}</svg>
)

const NAV = [
  ['koleksi', NAME_KOLEKSI],
  ['riwayat', 'Riwayat'],
  ['cari', 'Cari'],
  ['profil', 'Profil'],
]
const cap = (s) => s[0].toUpperCase() + s.slice(1)

function Pills({ cat, setCat }) {
  const box = useRef(null)
  const items = useRef([])
  const pill = useLiquidPill(box, items, CATS.findIndex(([k]) => k === cat))
  return (
    <div className="pills" ref={box}>
      <span className="pill-ind" style={pill} />
      {CATS.map(([k, l], i) => (
        <button key={k} ref={(el) => (items.current[i] = el)} className={'pill' + (cat === k ? ' on' : '')} onClick={() => setCat(k)}>
          <Icon n={k} />{l}
        </button>
      ))}
    </div>
  )
}

function Media({ type, list }) {
  if (!list.length) return <div className="empty">Belum ada isinya.</div>
  if (type === 'anime')
    return (
      <div className="grid">
        {list.map((d) => (
          <div key={d.id} className="card" style={{ background: col(d.n) }}>
            {d.seasons.length > 1 && <b className="bdg">{d.seasons.length} season</b>}
            <span>{d.n}</span>
          </div>
        ))}
      </div>
    )
  if (type === 'foto')
    return (
      <div className="fan">
        {list.map((d) => {
          const k = Math.min(d.c, 5)
          return (
            <div key={d.id} className="stack">
              <em>{d.c} lembar</em>
              {Array.from({ length: k }, (_, i) => {
                const a = (i - (k - 1) / 2) * 7
                return <i key={i} style={{ background: col(d.n + i), transform: `rotate(${a}deg) translateX(${a * 1.5}px)`, zIndex: i }} />
              })}
              <b>{d.n}</b>
            </div>
          )
        })}
      </div>
    )
  return (
    <div className="mas">
      {list.map((d) => (
        <div key={d.id} className="m" style={{ background: col(d.n), aspectRatio: `1/${d.h || 1.3}` }}>
          <svg className="play" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="#fff" />
          </svg>
          <span>{d.n}</span>
        </div>
      ))}
    </div>
  )
}

function Riwayat({ data }) {
  return [...data].sort((a, b) => a.ts - b.ts).map((d) => (
    <div className="row" key={d.id}>
      <div className="th" style={{ background: col(d.n) }} />
      <div>
        <b>{d.n}</b>
        <span className="tag"><Icon n={d.t} />{cap(d.t)}</span>
        <p>{ago(d.ts)}</p>
      </div>
    </div>
  ))
}

function Cari({ data, cat, setCat }) {
  const [q, setQ] = useState('')
  const find = (t) => data.filter((d) => d.t === t && d.n.toLowerCase().includes(q.toLowerCase()))

  const onChange = (v) => {
    setQ(v)
    if (!v) return
    const has = (t) => data.some((d) => d.t === t && d.n.toLowerCase().includes(v.toLowerCase()))
    // langsung diarahkan ke tab utama (anime); kalau kosong, pindah ke tab yang ada hasilnya
    const target = has('anime') ? 'anime' : (CATS.find(([k]) => has(k)) || ['anime'])[0]
    setCat(target)
  }

  const list = find(cat)
  const others = CATS.filter(([k]) => k !== cat && find(k).length)

  return (
    <>
      <Pills cat={cat} setCat={setCat} />
      <input placeholder="Cari anime, video, foto…" value={q} onChange={(e) => onChange(e.target.value)} />
      {q && !list.length && others.length > 0 && (
        <p className="empty" style={{ padding: 14 }}>
          Gak ada di {cat}. Ketemu di:{' '}
          {others.map(([k, l]) => (
            <button key={k} className="pill" style={{ display: 'inline-flex' }} onClick={() => setCat(k)}>
              <Icon n={k} />{l} ({find(k).length})
            </button>
          ))}
        </p>
      )}
      {q || list.length ? <Media type={cat} list={list} /> : <div className="empty">Ketik untuk mencari.</div>}
    </>
  )
}

function Profil({ data, toggleTheme }) {
  return (
    <>
      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', margin: 'auto', background: col('Heri') }} />
        <h2 style={{ marginTop: 10 }}>Heri</h2>
        <p style={{ color: 'var(--mu)', fontSize: 14 }}>Kolektor anime, video, dan foto</p>
      </div>
      <div className="stat">
        {CATS.map(([k, l]) => (
          <span key={k} className="pill on"><Icon n={k} />{data.filter((d) => d.t === k).length} {l}</span>
        ))}
      </div>
      <div className="menu">Pengaturan</div>
      <div className="menu" onClick={toggleTheme}>Tema (terang/gelap)</div>
      <div className="menu">Backup &amp; Restore</div>
      <div className="menu">Tentang</div>
    </>
  )
}

function AddDialog({ onSave, onClose }) {
  const [t, setT] = useState('anime')
  const [n, setN] = useState('')
  const [s, setS] = useState(1)
  return (
    <div className="dlg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div>
        <h3>Tambah ke {NAME_KOLEKSI}</h3>
        <select value={t} onChange={(e) => setT(e.target.value)}>
          {CATS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <input placeholder="Judul" value={n} onChange={(e) => setN(e.target.value)} />
        {t === 'anime' && <input type="number" min="1" value={s} onChange={(e) => setS(+e.target.value || 1)} />}
        <button className="btn" onClick={() => n.trim() && onSave(t, n.trim(), s)}>Simpan</button>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('koleksi')
  const [cat, setCat] = useState('anime')
  const [data, setData] = useState(SEED)
  const [adding, setAdding] = useState(false)
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => {
    const dark = theme ? theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(dark ? 'light' : 'dark')
  }

  const save = (t, n, s) => {
    setData((prev) => {
      if (t === 'anime') {
        const ex = prev.find((x) => x.t === 'anime' && x.n.toLowerCase() === n.toLowerCase())
        if (ex) // season baru menyatu ke wadah anime yang sama
          return prev.map((x) => x === ex ? { ...x, seasons: x.seasons.includes(s) ? x.seasons : [...x.seasons, s], ts: 0 } : x)
        return [{ id: Date.now(), t, n, seasons: [s], ts: 0 }, ...prev]
      }
      return [{ id: Date.now(), t, n, h: 1 + Math.random() * 0.9, c: 3 + Math.floor(Math.random() * 8), ts: 0 }, ...prev]
    })
    setCat(t)
    setAdding(false)
  }

  const navBox = useRef(null)
  const navItems = useRef([])
  const navPill = useLiquidPill(navBox, navItems, NAV.findIndex((n) => n[0] === page), { w: 56, h: 32 })

  const title = NAV.find((n) => n[0] === page)[1]

  return (
    <div id="app">
      <header><h1>{title}</h1></header>
      {page === 'koleksi' && <Pills cat={cat} setCat={setCat} />}
      <main>
        {page === 'koleksi' && <Media type={cat} list={data.filter((d) => d.t === cat)} />}
        {page === 'riwayat' && <Riwayat data={data} />}
        {page === 'cari' && <Cari data={data} cat={cat} setCat={setCat} />}
        {page === 'profil' && <Profil data={data} toggleTheme={toggleTheme} />}
      </main>
      {page === 'koleksi' && <button className="fab" aria-label="Tambah" onClick={() => setAdding(true)}>+</button>}
      <nav ref={navBox}>
        <span className="nav-pill" style={navPill} />
        {NAV.map(([k, l], i) => (
          <button key={k} className={page === k ? 'on' : ''} onClick={() => setPage(k)}>
            <i ref={(el) => (navItems.current[i] = el)}><Icon n={k} s={22} /></i>{l}
          </button>
        ))}
      </nav>
      {adding && <AddDialog onSave={save} onClose={() => setAdding(false)} />}
    </div>
  )
}
