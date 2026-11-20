// Hasil pencarian online: grid cover (anime), grid ala Pinterest (video & foto), plus skeleton/kosong/error

const Skeleton = ({ type }) => (
  <div className={type === 'anime' ? 'grid' : 'mas'}>
    {Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        className="sk"
        style={type === 'anime' ? { aspectRatio: '2/3' } : { aspectRatio: i % 2 ? '1/1.3' : '1/1', breakInside: 'avoid', marginBottom: 10 }}
      />
    ))}
  </div>
)

export function SearchResults({ type, state, onOpen }) {
  const { status, items, failed } = state

  if (status === 'loading') return <Skeleton type={type} />
  if (status === 'error') return <div className="empty">Gagal memuat hasil. Cek koneksi lalu coba lagi.</div>
  if (!items.length) return <div className="empty">Tidak ada hasil.</div>

  return (
    <>
      {type === 'anime' ? (
        <div className="grid">
          {items.map((d) => (
            <div key={d.id} className="card" onClick={() => onOpen(d)}>
              {d.cover && <img src={d.cover} alt="" loading="lazy" referrerPolicy="no-referrer" />}
              {d.sub && <b className="bdg">{d.sub}</b>}
              <span>{d.title}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="mas">
          {items.map((d) => (
            <a key={d.id} className="rv" href={d.url} target="_blank" rel="noreferrer">
              <img src={d.cover} alt="" loading="lazy" referrerPolicy="no-referrer" style={{ aspectRatio: d.ratio || 1 }} />
              {type === 'video' && (
                <svg className="play" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
                  <circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="#fff" />
                </svg>
              )}
              {type === 'video' && d.sub && <em>{d.sub}</em>}
              {d.title && <span>{d.title}</span>}
            </a>
          ))}
        </div>
      )}
      {failed.length > 0 && <p className="note">Sumber gagal dimuat: {failed.join(', ')}</p>}
    </>
  )
}
