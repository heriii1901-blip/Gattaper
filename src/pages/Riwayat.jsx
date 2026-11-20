import { col, ago, cap } from '../data/data.js'
import { Icon } from '../components/Icon.jsx'

export function Riwayat({ data }) {
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
