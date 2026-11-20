import { useRef } from 'react'
import { useLiquidPill } from '../hooks/useLiquidPill.js'
import { CATS } from '../data/data.js'
import { Icon } from './Icon.jsx'

export function Pills({ cat, setCat }) {
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
