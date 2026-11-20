import { useState } from 'react'
import { CATS } from '../data/data.js'
import { Icon } from '../components/Icon.jsx'
import { Pills } from '../components/Pills.jsx'
import { Media } from '../components/Media.jsx'

export function Cari({ data }) {
  const [cat, setCat] = useState('anime')
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
