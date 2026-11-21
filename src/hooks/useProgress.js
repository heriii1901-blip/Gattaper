import { useState } from 'react'

const PK = 'gattaper:progress' // { "aid:eps": { t: detik terakhir, d: durasi, done, ts } }
const LK = 'gattaper:links' // { "aid:eps": "url video" }

const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {}
  } catch {
    return {}
  }
}

// Ditulis langsung & sinkron ke localStorage (bukan lewat effect), biar tetap kesimpan
// walau halaman ditutup / pindah pas lagi nonton.
const write = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    // penuh/diblok
  }
}

const k = (aid, no) => `${aid}:${no}`

// Progres tonton per episode (kayak "terakhir baca hal. 5" di Tachiyomi) + link video per episode
export function useProgress() {
  const [prog, setProg] = useState(() => load(PK))
  const [links, setLinks] = useState(() => load(LK))

  const get = (aid, no) => prog[k(aid, no)]
  const link = (aid, no) => links[k(aid, no)] || ''

  const save = (aid, no, t, d) => {
    if (!(t >= 0)) return
    const next = { ...load(PK), [k(aid, no)]: { t, d: d || 0, done: d > 0 && t / d >= 0.9, ts: Date.now() } }
    write(PK, next)
    setProg(next)
  }

  const setLink = (aid, no, url) => {
    const next = { ...load(LK) }
    if (url) next[k(aid, no)] = url
    else delete next[k(aid, no)]
    write(LK, next)
    setLinks(next)
  }

  return { get, link, save, setLink }
}
