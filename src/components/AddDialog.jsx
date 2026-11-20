import { useState } from 'react'
import { NAME_KOLEKSI, CATS } from '../data/data.js'

export function AddDialog({ onSave, onClose }) {
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
