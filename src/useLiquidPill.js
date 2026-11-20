import { useLayoutEffect, useRef, useState } from 'react'

// Pill penanda yang pindahnya kayak cairan:
// melar dulu ke arah tujuan, lalu menyusut dan "mendarat" dengan sedikit mantul.
//
// boxRef   : elemen pembungkus (harus position: relative / absolute)
// itemRefs : ref berisi array elemen tiap item
// active   : index item yang aktif
// size     : opsional {w, h}. Kalau diisi, pill berukuran tetap dan ditaruh di tengah item.
//            Kalau kosong, pill menyesuaikan ukuran item.
export function useLiquidPill(boxRef, itemRefs, active, size) {
  const [style, setStyle] = useState({ opacity: 0 })
  const prev = useRef(null)
  const timer = useRef(0)

  useLayoutEffect(() => {
    const measure = () => {
      const box = boxRef.current
      const el = itemRefs.current[active]
      if (!box || !el) return null
      const b = box.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const width = size ? size.w : r.width
      const height = size ? size.h : r.height
      return {
        left: r.left - b.left - box.clientLeft + (r.width - width) / 2,
        top: r.top - b.top - box.clientTop + (r.height - height) / 2,
        width,
        height,
      }
    }

    const place = (animate) => {
      clearTimeout(timer.current)
      const to = measure()
      if (!to) {
        setStyle({ opacity: 0 })
        return
      }
      const from = prev.current
      prev.current = to

      // Pertama kali muncul / resize layar: langsung taruh, tanpa animasi
      if (!animate || !from || from.left === to.left) {
        setStyle({ opacity: 1, ...to, transition: 'none' })
        return
      }

      // Fase 1: melar menutupi posisi lama sampai posisi baru
      const left = Math.min(from.left, to.left)
      const right = Math.max(from.left + from.width, to.left + to.width)
      setStyle({
        opacity: 1,
        left,
        top: to.top,
        width: right - left,
        height: to.height,
        transition: 'left .16s ease-in, width .16s ease-in',
      })

      // Fase 2: menyusut ke posisi baru dengan sedikit mantul
      timer.current = setTimeout(() => {
        const spring = 'cubic-bezier(.34,1.4,.64,1)'
        setStyle({ opacity: 1, ...to, transition: `left .38s ${spring}, width .38s ${spring}` })
      }, 150)
    }

    place(true)
    const onResize = () => place(false)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer.current)
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  return style
}
