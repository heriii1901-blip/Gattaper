const P = {
  anime: <><rect x="3" y="5" width="18" height="12" rx="2" /><path d="M8 21h8M12 17v4" /></>,
  video: <><circle cx="12" cy="12" r="10" /><path d="M10 8l6 4-6 4z" fill="currentColor" /></>,
  foto: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  koleksi: <path d="M4 4h6v16H4zM14 4h6v16h-6z" />,
  riwayat: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  cari: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  profil: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
}
export const Icon = ({ n, s = 14 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{P[n]}</svg>
)
