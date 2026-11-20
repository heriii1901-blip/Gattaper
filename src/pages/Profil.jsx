import { CATS, col } from '../data/data.js'
import { Icon } from '../components/Icon.jsx'

export function Profil({ data, toggleTheme }) {
  return (
    <>
      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <div style={{ width: 84, height: 84, borderRadius: '50%', margin: 'auto', background: col('Heri') }} />
        <h2 style={{ marginTop: 10 }}>Heri</h2>
        <p style={{ color: 'var(--mu)', fontSize: 14 }}>Kolektor anime, video, dan foto</p>
      </div>
      <div className="stat">
        {CATS.map(([k, l]) => (
          <span key={k} className="pill on"><Icon n={k} />{data.filter((d) => d.t === k).length} {l}</span>
        ))}
      </div>
      <div className="menu">Pengaturan</div>
      <div className="menu" onClick={toggleTheme}>Tema (terang/gelap)</div>
      <div className="menu">Backup &amp; Restore</div>
      <div className="menu">Tentang</div>
    </>
  )
}
