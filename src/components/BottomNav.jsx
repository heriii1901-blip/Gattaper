import { useRef } from 'react'
import { useLiquidPill } from '../hooks/useLiquidPill.js'
import { NAV } from '../data/data.js'
import { Icon } from './Icon.jsx'

export function BottomNav({ page, setPage }) {
  const box = useRef(null)
  const items = useRef([])
  const pill = useLiquidPill(box, items, NAV.findIndex((n) => n[0] === page), { w: 56, h: 32 })

  return (
    <nav ref={box}>
      <span className="nav-pill" style={pill} />
      {NAV.map(([k, l], i) => (
        <button key={k} className={page === k ? 'on' : ''} onClick={() => setPage(k)}>
          <i ref={(el) => (items.current[i] = el)}><Icon n={k} s={22} /></i>{l}
        </button>
      ))}
    </nav>
  )
}
