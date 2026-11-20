import { useEffect, useState } from 'react'
import { CATS } from '../data/data.js'
import { useSearch } from '../hooks/useSearch.js'
import { Icon } from '../components/Icon.jsx'
import { Pills } from '../components/Pills.jsx'
import { SearchResults } from '../components/SearchResults.jsx'
import { AnimeDetail } from './AnimeDetail.jsx'

const DEBOUNCE = 600 // ms setelah berhenti ngetik, pencarian jalan otomatis
const MIN = 2 // minimal huruf

export function Cari({ data, onFav }) {
  const [cat, setCat] = useState('anime')
  const [text, setText] = useState('') // isi kolom
  const [q, setQ] = useState('') // kata yang benar-benar dicari
  const [open, setOpen] = useState(null) // anime yang lagi dibuka detailnya
  const res = useSearch(q)

  // Berhenti ngetik sebentar -> cari otomatis
  useEffect(() => {
    const v = text.trim()
    if (v.length < MIN) {
      setQ('')
      return
    }
    const t = setTimeout(() => setQ(v), DEBOUNCE)
    return () => clearTimeout(t)
  }, [text])

  // Tiap pencarian baru, arahkan ke tab utama (anime)
  useEffect(() => {
    if (q) setCat('anime')
  }, [q])

  // Enter = langsung cari tanpa nunggu jeda
  const onKeyDown = (e) => {
    const v = text.trim()
    if (e.key === 'Enter' && v.length >= MIN) {
      setQ(v)
      e.target.blur()
    }
  }

  if (open)
    return <AnimeDetail aid={open.aid} fav={data.some((x) => x.aid === open.aid)} onFav={onFav} onBack={() => setOpen(null)} />

  const cur = res[cat]
  const label = (CATS.find(([k]) => k === cat) || [])[1] || cat
  // tab sekarang kosong tapi tab lain ada hasilnya -> tawarkan pindah
  const others = q && cur.status === 'done' && !cur.items.length ? CATS.filter(([k]) => k !== cat && res[k].items.length) : []

  return (
    <>
      <Pills cat={cat} setCat={setCat} />
      <input
        placeholder="Cari anime, video, foto…"
        value={text}
        enterKeyHint="search"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
      />
      {others.length > 0 && (
        <p className="empty" style={{ padding: 14 }}>
          Gak ada di {label.toLowerCase()}. Ketemu di:{' '}
          {others.map(([k, l]) => (
            <button key={k} className="pill" style={{ display: 'inline-flex' }} onClick={() => setCat(k)}>
              <Icon n={k} />{l} ({res[k].items.length})
            </button>
          ))}
        </p>
      )}
      {q ? <SearchResults type={cat} state={cur} onOpen={setOpen} /> : <div className="empty">Ketik untuk mencari.</div>}
    </>
  )
}
