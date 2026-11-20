import { useRef } from 'react'
import { useLiquidPill } from '../hooks/useLiquidPill.js'
import { NAV } from '../data/data.js'
import { Icon } from './Icon.jsx'

export function BottomNav({ page, setPage, onAdd }) {
  const box = useRef(null)
  const items = useRef([])
  const pill = useLiquidPill(box, items, NAV.findIndex((n) => n[0] === page))

  const item = ([k, l], i) => (
    <button key={k} ref={(el) => (items.current[i] = el)} className={page === k ? 'on' : ''} onClick={() => setPage(k)}>
      <i><Icon n={k} s={22} /></i>{l}
    </button>
  )

  return (
    <nav ref={box}>
      <span className="nav-pill" style={pill} />
      {NAV.slice(0, 2).map((n, i) => item(n, i))}
      <button className="nav-add" aria-label="Tambah" onClick={onAdd}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
      {NAV.slice(2).map((n, i) => item(n, i + 2))}
    </nav>
  )
}
