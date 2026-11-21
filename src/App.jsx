import { useState, useEffect } from 'react'
import { NAV, SEED } from './data/data.js'
import { Pills } from './components/Pills.jsx'
import { Media } from './components/Media.jsx'
import { AddDialog } from './components/AddDialog.jsx'
import { BottomNav } from './components/BottomNav.jsx'
import { Riwayat } from './pages/Riwayat.jsx'
import { AnimeDetail } from './pages/AnimeDetail.jsx'
import { usePersisted } from './hooks/usePersisted.js'
import { Cari } from './pages/Cari.jsx'
import { Profil } from './pages/Profil.jsx'

export default function App() {
  const [page, setPage] = useState('koleksi')
  const [cat, setCat] = useState('anime')
  const [data, setData] = usePersisted('gattaper:data', SEED) // tersimpan di browser, gak hilang pas refresh
  const [view, setView] = useState(null) // aid anime yang lagi dibuka dari Koleksi
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
          return prev.map((x) => x === ex ? { ...x, seasons: x.seasons.includes(s) ? x.seasons : [...x.seasons, s], ts: Date.now(), hid: false } : x)
        return [{ id: Date.now(), t, n, seasons: [s], ts: Date.now() }, ...prev]
      }
      return [{ id: Date.now(), t, n, h: 1 + Math.random() * 0.9, c: 3 + Math.floor(Math.random() * 8), ts: Date.now() }, ...prev]
    })
    setCat(t)
    setPage('koleksi')
    setAdding(false)
  }

  // hapus dari Riwayat doang (item di Koleksi tetap ada)
  const removeHist = (ids) => setData((prev) => prev.map((x) => (ids.includes(x.id) ? { ...x, hid: true } : x)))

  // Favorit dari halaman detail anime (Cari): klik sekali masuk Koleksi, klik lagi keluar. Gak pindah halaman.
  const toggleFav = (a) =>
    setData((prev) =>
      prev.some((x) => x.aid === a.aid)
        ? prev.filter((x) => x.aid !== a.aid)
        : [{ id: Date.now(), aid: a.aid, t: 'anime', n: a.title, cover: a.cover, seasons: [1], ts: Date.now() }, ...prev]
    )

  const title = NAV.find((n) => n[0] === page)[1]

  // pindah menu = tab Koleksi balik ke Anime (Cari punya state sendiri, reset otomatis pas ditinggal)
  const go = (p) => {
    if (p !== page) setCat('anime')
    setView(null)
    setPage(p)
  }

  return (
    <div id="app">
      <header><h1>{title}</h1></header>
      {page === 'koleksi' && !view && <Pills cat={cat} setCat={setCat} />}
      <main>
        {page === 'koleksi' && view && (
          <AnimeDetail aid={view} fav={data.some((x) => x.aid === view)} onFav={toggleFav} onBack={() => setView(null)} />
        )}
        {page === 'koleksi' && !view && <Media type={cat} list={data.filter((d) => d.t === cat)} onOpen={setView} />}
        {page === 'riwayat' && <Riwayat data={data} onRemove={removeHist} />}
        {page === 'cari' && <Cari data={data} onFav={toggleFav} />}
        {page === 'profil' && <Profil data={data} toggleTheme={toggleTheme} />}
      </main>
        <BottomNav page={page} setPage={go} onAdd={() => setAdding(true)} />
      {adding && <AddDialog onSave={save} onClose={() => setAdding(false)} />}
    </div>
  )
}
