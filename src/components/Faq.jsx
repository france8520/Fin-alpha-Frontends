import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Plus, Minus } from 'lucide-react'
import styles from './Faq.module.css'

const faqs = [
  {
    q: 'What risk metrics does FinAlpha calculate?',
    a: 'FinAlpha calculates 10+ institutional-grade metrics including Annual Volatility, Value at Risk (95% & 99%), Beta, Sharpe Ratio, Sortino Ratio, CVAR (Expected Shortfall), Maximum Drawdown, RSI, Trend Analysis, and an overall AI Risk Score from 0-100.',
  },
  {
    q: 'How does the AI recommendation engine work?',
    a: 'Our AI aggregates all computed risk metrics, current market conditions, and trend indicators to generate a recommendation from "Strong Buy" to "Strong Sell" with detailed reasoning. It considers volatility-adjusted returns, momentum, and downside protection.',
  },
  {
    q: 'What assets can I analyze?',
    a: 'You can analyze stocks (AAPL, MSFT, etc.), ETFs (SPY, QQQ), cryptocurrencies (BTC-USD, ETH-USD), commodities (GC=F, CL=F), and indices. Any ticker available on Yahoo Finance is supported.',
  },
  {
    q: 'Is there a free plan available?',
    a: 'Yes! We offer a 14-day free trial with full access to all Professional features. No credit card required to start. After the trial, you can choose a plan that fits your needs.',
  },
  {
    q: 'How accurate are the AI predictions?',
    a: 'Our risk metrics are computed from real market data using industry-standard quantitative methods. Our backtesting shows that our risk scores correctly identify high-risk periods 87% of the time. All recommendations should be used alongside your own research.',
  },
]

function FaqItem({ faq, delay }) {
  const [open, setOpen] = useState(false)
  const ref = useScrollReveal()

  return (
    <div ref={ref} className={`reveal ${styles.item} ${open ? styles.open : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      <button className={styles.question} onClick={() => setOpen(v => !v)}>
        <span>{faq.q}</span>
        <div className={styles.icon}>{open ? <Minus size={16} /> : <Plus size={16} />}</div>
      </button>
      <div className={styles.answerWrap} style={{ maxHeight: open ? '300px' : '0' }}>
        <p className={styles.answer}>{faq.a}</p>
      </div>
    </div>
  )
}

export default function Faq() {
  const titleRef = useScrollReveal()
  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <div className="section-eyebrow">❓ FAQ</div>
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className={styles.list}>
          {faqs.map((f, i) => <FaqItem key={i} faq={f} delay={i * 60} />)}
        </div>
      </div>
    </section>
  )
}
