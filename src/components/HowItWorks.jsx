import { useScrollReveal } from '../hooks/useScrollReveal'
import { Terminal, Cpu, Sparkles } from 'lucide-react'
import styles from './HowItWorks.module.css'

const steps = [
  {
    number: '01',
    icon: <Terminal size={22} />,
    title: 'Enter a Ticker',
    desc: 'Type any stock, ETF, crypto, or commodity symbol into our analyzer.',
  },
  {
    number: '02',
    icon: <Cpu size={22} />,
    title: 'AI Crunches the Data',
    desc: 'Our engine fetches real-time data and runs 10+ risk metrics including Beta, VaR, Sortino, and RSI.',
  },
  {
    number: '03',
    icon: <Sparkles size={22} />,
    title: 'Get AI Recommendations',
    desc: 'Receive a risk score, actionable recommendation, and detailed breakdown — all in seconds.',
  },
]

function StepCard({ step, delay }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal ${styles.step}`} style={{ transitionDelay: `${delay}ms` }}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNum}>{step.number}</div>
        <div className={styles.stepIcon}>{step.icon}</div>
      </div>
      <h3 className={styles.stepTitle}>{step.title}</h3>
      <p className={styles.stepDesc}>{step.desc}</p>
    </div>
  )
}

export default function HowItWorks() {
  const titleRef = useScrollReveal()
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <div className="section-eyebrow">⚡ Simple & Fast</div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three steps to institutional-grade risk intelligence</p>
        </div>
        <div className={styles.grid}>
          {steps.map((s, i) => <StepCard key={i} step={s} delay={i * 120} />)}
        </div>
      </div>
    </section>
  )
}
