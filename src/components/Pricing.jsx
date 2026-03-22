import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Check } from 'lucide-react'
import styles from './Pricing.module.css'

const plans = [
  {
    name: 'Starter',
    monthly: 29,
    annual: 23,
    features: ['Up to 5 team members', 'Basic analytics dashboard', '10,000 analyses/month', 'Email support', 'Standard integrations'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    monthly: 79,
    annual: 63,
    features: ['Up to 20 team members', 'Advanced AI analytics', 'Unlimited analyses', 'Priority support', 'API access', 'Custom integrations'],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 199,
    annual: 159,
    features: ['Unlimited team members', 'Full AI suite + custom models', 'Unlimited everything', '24/7 dedicated support', 'Custom development', 'SSO & SLA guarantee'],
    cta: 'Contact Sales',
    popular: false,
  },
]

function PlanCard({ plan, annual, delay }) {
  const ref = useScrollReveal()
  const price = annual ? plan.annual : plan.monthly
  return (
    <div ref={ref} className={`reveal ${styles.card} ${plan.popular ? styles.popular : ''}`}
         style={{ transitionDelay: `${delay}ms` }}>
      {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
      <div className={styles.cardHead}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <div className={styles.price}>
          <span className={styles.currency}>$</span>
          <span className={styles.amount}>{price}</span>
          <span className={styles.period}>/mo</span>
        </div>
      </div>
      <ul className={styles.features}>
        {plan.features.map(f => (
          <li key={f} className={styles.feature}>
            <Check size={15} className={styles.check} /> {f}
          </li>
        ))}
      </ul>
      <button className={`${styles.cta} ${plan.popular ? styles.ctaPrimary : styles.ctaOutline}`}>
        {plan.cta}
      </button>
    </div>
  )
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const titleRef = useScrollReveal()

  return (
    <section id="pricing" className={styles.section}>
      <div className={styles.container}>
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <div className="section-eyebrow">🏷️ Pricing</div>
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Start free. Scale as you grow.</p>
        </div>

        <div className={styles.toggle}>
          <span className={`${styles.toggleLabel} ${!annual ? styles.toggleActive : ''}`}>Monthly</span>
          <button className={`${styles.switch} ${annual ? styles.switchOn : ''}`} onClick={() => setAnnual(v => !v)}>
            <div className={styles.switchThumb} />
          </button>
          <span className={`${styles.toggleLabel} ${annual ? styles.toggleActive : ''}`}>Annual</span>
          <span className={styles.saveBadge}>Save 20%</span>
        </div>

        <div className={styles.grid}>
          {plans.map((p, i) => <PlanCard key={p.name} plan={p} annual={annual} delay={i * 120} />)}
        </div>
      </div>
    </section>
  )
}
