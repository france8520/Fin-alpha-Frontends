import { ArrowDown, Play, Star } from 'lucide-react'
import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

const TICKER_DATA = [
  { sym: 'AAPL', price: '189.84', change: '+1.24%', up: true },
  { sym: 'MSFT', price: '415.20', change: '+0.87%', up: true },
  { sym: 'GOOGL', price: '175.98', change: '-0.32%', up: false },
  { sym: 'TSLA', price: '248.50', change: '+2.15%', up: true },
  { sym: 'AMZN', price: '185.62', change: '+0.95%', up: true },
  { sym: 'NVDA', price: '878.36', change: '+3.21%', up: true },
  { sym: 'META', price: '502.30', change: '-0.45%', up: false },
  { sym: 'BTC-USD', price: '67,450', change: '+1.78%', up: true },
  { sym: 'ETH-USD', price: '3,520', change: '+2.34%', up: true },
  { sym: 'JPM', price: '198.45', change: '+0.62%', up: true },
]

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    const particles = []
    const COUNT = 55

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    class P {
      constructor() { this.reset() }
      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.r = Math.random() * 2 + 0.5
        this.a = Math.random() * 0.45 + 0.05
      }
      tick() {
        this.x += this.vx; this.y += this.vy
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100,180,255,${this.a})`
        ctx.fill()
      }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new P())

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => { p.tick(); p.draw() })
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 140) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(100,180,255,${0.07 * (1 - d / 140)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animId); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} />
}

function TickerMarquee() {
  const items = [...TICKER_DATA, ...TICKER_DATA]
  return (
    <div className="ticker-marquee">
      <div className="ticker-track">
        {items.map((t, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-symbol">{t.sym}</span>
            ${t.price}
            <span className={t.up ? 'ticker-up' : 'ticker-down'}>{t.change}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const handleClick = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className={styles.hero}>
      <ParticleCanvas />
      <div className={styles.tickerWrapper}>
        <TickerMarquee />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className="section-eyebrow">
            <Star size={12} fill="currentColor" /> AI-Powered Financial Intelligence
          </div>
          <h1 className={styles.title}>
            Smarter Risk Analysis with{' '}
            <span className="gradient-text">FinAlpha AI</span>
          </h1>
          <p className={styles.subtitle}>
            Unlock institutional-grade stock risk analytics powered by machine learning.
            Volatility, VaR, Beta, Sortino, and AI recommendations — in seconds.
          </p>
          <div className={styles.buttons}>
            <a href="#ai-demo" className="btn-primary" onClick={e => handleClick(e, '#ai-demo')}>
              <Play size={16} fill="currentColor" /> Try AI Demo
            </a>
            <a href="#features" className="btn-outline" onClick={e => handleClick(e, '#features')}>
              <ArrowDown size={16} /> Learn More
            </a>
          </div>
          <div className={styles.trust}>
            {['No credit card required', '14-day free trial', 'Instant setup'].map(t => (
              <div key={t} className={styles.trustItem}>
                <span className={styles.check}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
