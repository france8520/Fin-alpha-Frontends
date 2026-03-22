import { useScrollReveal } from '../hooks/useScrollReveal'
import { BarChart2, Bot, ShieldCheck, RefreshCw, Users, Smartphone } from 'lucide-react'
import styles from './Features.module.css'

const features = [
  {
    icon: <BarChart2 size={24} />,
    title: 'Real-Time Analytics',
    desc: 'Live dashboards with instant updates on volatility, price movements, and risk indicators across your portfolio.',
    accent: false,
  },
  {
    icon: <Bot size={24} />,
    title: 'AI Risk Engine',
    desc: 'Advanced ML algorithms compute Beta, Sortino, VaR, CVAR, RSI, and generate actionable buy/sell recommendations.',
    accent: true,
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Bank-Grade Security',
    desc: 'End-to-end encryption, SOC 2 compliance, multi-factor authentication, and continuous security monitoring.',
    accent: false,
  },
  {
    icon: <RefreshCw size={24} />,
    title: 'Automated Workflows',
    desc: 'Set up automated risk alerts, portfolio rebalancing triggers, and scheduled reporting with zero manual effort.',
    accent: true,
  },
  {
    icon: <Users size={24} />,
    title: 'Team Collaboration',
    desc: 'Shared workspaces with role-based access, real-time comments, and unified dashboards for your entire team.',
    accent: false,
  },
  {
    icon: <Smartphone size={24} />,
    title: 'Mobile & API Access',
    desc: 'Full-featured mobile app plus RESTful API for custom integrations with your existing trading infrastructure.',
    accent: true,
  },
]

function FeatureCard({ f, delay }) {
  const ref = useScrollReveal()
  return (
    <div ref={ref} className={`reveal ${styles.card} ${f.accent ? styles.accent : ''}`}
         style={{ transitionDelay: `${delay}ms` }}>
      <div className={`${styles.icon} ${f.accent ? styles.iconAccent : ''}`}>{f.icon}</div>
      <h3 className={styles.cardTitle}>{f.title}</h3>
      <p className={styles.cardDesc}>{f.desc}</p>
    </div>
  )
}

export default function Features() {
  const titleRef = useScrollReveal()
  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <div className="section-eyebrow">⚙️ Capabilities</div>
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need for professional-grade investment analysis</p>
        </div>
        <div className={styles.grid}>
          {features.map((f, i) => <FeatureCard key={i} f={f} delay={i * 80} />)}
        </div>
      </div>
    </section>
  )
}
