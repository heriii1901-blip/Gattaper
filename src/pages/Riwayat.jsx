import { useRef, useState } from 'react'
import { col, ago, cap } from '../data/data.js'
import { Icon } from '../components/Icon.jsx'

export function Riwayat({ data, onRemove }) {
  const [selecting, setSelecting] = useState(false)
  const [picked, setPicked] = useState([])
  const timer = useRef(null)
  const fired = useRef(false)
  const start = useRef({ x: 0, y: 0 })

  // paling baru di atas, yang udah dihapus dari riwayat disembunyiin
  const list = data.filter((d) => !d.hid).sort((a, b) => b.ts - a.ts)

  const cancel = () => {
    clearTimeout(timer.current)
    timer.current = null
  }

  // tahan 400ms = masuk mode pilih (sama kayak list lagu di PAM)
  const press = (d, e) => {
    start.current = { x: e.clientX, y: e.clientY }
    fired.current = false
    cancel()
    timer.current = setTimeout(() => {
      fired.current = true
      if (navigator.vibrate) navigator.vibrate(30)
      setSelecting(true)
      setPicked((p) => (p.includes(d.id) ? p : [...p, d.id]))
    }, 400)
  }

  // jari geser = lagi scroll, batalin tahan
  const move = (e) => {
    if (!timer.current) return
    if (Math.abs(e.clientX - start.current.x) > 10 || Math.abs(e.clientY - start.current.y) > 10) cancel()
  }

  const tap = (d) => {
    if (fired.current) {
      fired.current = false
      return
    }
    if (!selecting) return
    setPicked((p) => (p.includes(d.id) ? p.filter((x) => x !== d.id) : [...p, d.id]))
  }

  const exit = () => {
    setSelecting(false)
    setPicked([])
  }

  const del = () => {
    if (!picked.length) return
    if (!window.confirm(`Hapus ${picked.length} dari riwayat?`)) return
    onRemove(picked)
    exit()
  }

  if (!list.length) return <div className="empty">Riwayat kosong.</div>

  return (
    <>
      {selecting && (
        <div className="sel-bar">
          <span>{picked.length} dipilih</span>
          <button onClick={exit}>Batal</button>
        </div>
      )}

      {list.map((d) => {
        const on = picked.includes(d.id)
        return (
          <div
            key={d.id}
            className={'row' + (on ? ' sel' : '')}
            onClick={() => tap(d)}
            onPointerDown={(e) => press(d, e)}
            onPointerMove={move}
            onPointerUp={cancel}
            onPointerLeave={cancel}
            onPointerCancel={cancel}
            onContextMenu={(e) => e.preventDefault()}
          >
            {selecting && <span className={'check' + (on ? ' on' : '')} />}
            <div className="th" style={{ background: col(d.n) }} />
            <div>
              <b>{d.n}</b>
              <span className="tag"><Icon n={d.t} />{cap(d.t)}</span>
              <p>{ago(d.ts)}</p>
            </div>
          </div>
        )
      })}

      {selecting && (
        <button className="fab-del" aria-label="Hapus" disabled={!picked.length} onClick={del}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </button>
      )}
    </>
  )
}
