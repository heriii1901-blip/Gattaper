import { useState, useEffect } from 'react'
import { NAV, SEED } from './data/data.js'
import { Pills } from './components/Pills.jsx'
import { Media } from './components/Media.jsx'
import { AddDialog } from './components/AddDialog.jsx'
import { BottomNav } from './components/BottomNav.jsx'
import { Riwayat } from './pages/Riwayat.jsx'
import { Cari } from './pages/Cari.jsx'
import { Profil } from './pages/Profil.jsx'

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
    setPage('koleksi')
    setAdding(false)
  }

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
        <BottomNav page={page} setPage={setPage} onAdd={() => setAdding(true)} />
      {adding && <AddDialog onSave={save} onClose={() => setAdding(false)} />}
    </div>
  )
}
