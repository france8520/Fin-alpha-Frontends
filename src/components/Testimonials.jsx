import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Testimonials.module.css'

const testimonials = [
  {
    stars: 5,
    text: '"FinAlpha\'s AI risk engine is remarkable. It replaced three separate tools we were paying for and gives us better insights in a fraction of the time."',
    name: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    stars: 5,
    text: '"The AI recommendations have been game-changing. We\'ve identified alpha opportunities we would have completely missed with traditional tools."',
    name: 'Michael Chen',
    role: 'CFO, Global Ventures',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    stars: 5,
    text: '"Outstanding platform. The Sortino and CVAR metrics give us a real edge in risk management. Best decision we made this year."',
    name: 'Emily Rodriguez',
    role: 'Finance Director, ScaleUp Co.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
]

function Card({ t, delay }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal ${styles.card}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className={styles.stars}>{'★'.repeat(t.stars)}</div>
      <p className={styles.text}>{t.text}</p>
      <div className={styles.author}>
        <img src={t.avatar} alt={t.name} className={styles.avatar} />
        <div>
          <div className={styles.name}>{t.name}</div>
          <div className={styles.role}>{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const titleRef = useScrollReveal()
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <div className="section-eyebrow">💬 Testimonials</div>
          <h2 className="section-title">Loved by Finance Teams</h2>
          <p className="section-subtitle">Join thousands of professionals using FinAlpha daily</p>
        </div>
        <div className={styles.grid}>
          {testimonials.map((t, i) => <Card key={i} t={t} delay={i * 120} />)}
        </div>
      </div>
    </section>
  )
}
