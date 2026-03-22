import { useEffect, useRef } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Stats.module.css'

const stats = [
  { value: 10000, suffix: '+', label: 'Active Users' },
  { value: 5, prefix: '$', suffix: 'B+', label: 'Assets Analyzed' },
  { value: 99.9, suffix: '%', decimals: 1, label: 'Uptime SLA' },
  { value: 50, suffix: '+', label: 'Risk Metrics' },
]

function Counter({ stat }) {
  const ref = useRef(null)
  const watched = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !watched.current) {
        watched.current = true
        const { value, prefix = '', suffix = '', decimals = 0 } = stat
        const duration = 2000
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          const cur = (value * eased).toFixed(decimals)
          el.textContent = prefix + (decimals > 0 ? cur : Math.floor(cur).toLocaleString()) + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [stat])

  return <div ref={ref} className={styles.value}>0</div>
}

export default function Stats() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((s, i) => {
            const ref = useScrollReveal()
            return (
              <div key={i} ref={ref} className={`reveal ${styles.item}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <Counter stat={s} />
                <div className={styles.label}>{s.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
