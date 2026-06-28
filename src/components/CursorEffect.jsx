import { useEffect, useRef, useState } from 'react'
import styles from './CursorEffect.module.css'

export default function CursorEffect() {
  const spotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const spot = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    let animId
    const animate = () => {
      // ปรับค่า easing ให้สูงขึ้นเพื่อการเคลื่อนไหวที่สมูทขึ้น
      spot.current.x += (mouse.current.x - spot.current.x) * 0.15
      spot.current.y += (mouse.current.y - spot.current.y) * 0.15
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1

      // ใช้ transform แทน left/top เพื่อประสิทธิภาพที่ดีขึ้น
      if (spotRef.current) {
        spotRef.current.style.transform = `translate(-50%, -50%) translate3d(${spot.current.x - window.innerWidth/2}px, ${spot.current.y - window.innerHeight/2}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(-50%, -50%) translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      }

      animId = requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)
    const interactives = document.querySelectorAll('a, button, .card-hover')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={spotRef} className={styles.spotlight} />
      <div ref={ringRef} className={`${styles.ring} ${hovered ? styles.hovered : ''}`} />
    </>
  )
}