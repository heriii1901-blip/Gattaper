import { col } from '../data/data.js'

export function Media({ type, list }) {
  if (!list.length) return <div className="empty">Belum ada isinya.</div>
  if (type === 'anime')
    return (
      <div className="grid">
        {list.map((d) => (
          <div key={d.id} className="card" style={{ background: col(d.n) }}>
            {d.seasons.length > 1 && <b className="bdg">{d.seasons.length} season</b>}
            <span>{d.n}</span>
          </div>
        ))}
      </div>
    )
  if (type === 'foto')
    return (
      <div className="fan">
        {list.map((d) => {
          const k = Math.min(d.c, 5)
          return (
            <div key={d.id} className="stack">
              <em>{d.c} lembar</em>
              {Array.from({ length: k }, (_, i) => {
                const a = (i - (k - 1) / 2) * 7
                return <i key={i} style={{ background: col(d.n + i), transform: `rotate(${a}deg) translateX(${a * 1.5}px)`, zIndex: i }} />
              })}
              <b>{d.n}</b>
            </div>
          )
        })}
      </div>
    )
  return (
    <div className="mas">
      {list.map((d) => (
        <div key={d.id} className="m" style={{ background: col(d.n), aspectRatio: `1/${d.h || 1.3}` }}>
          <svg className="play" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="#fff" />
          </svg>
          <span>{d.n}</span>
        </div>
      ))}
    </div>
  )
}
