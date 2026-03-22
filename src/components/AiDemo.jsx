import { useState, useEffect, useRef } from 'react'
import { Cpu, Plug, BarChart2 } from 'lucide-react'
import { analyzeStock, getApiBase, setApiBase, pingApi } from '../utils/api'
import styles from './AiDemo.module.css'

function RiskGauge({ score }) {
  const offset = 157 - (Math.min(Math.max(score, 0), 100) / 100) * 157
  return (
    <div className={styles.gauge}>
      <svg viewBox="0 0 120 65">
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(152,70%,50%)" />
            <stop offset="50%" stopColor="hsl(38,95%,55%)" />
            <stop offset="100%" stopColor="hsl(0,85%,55%)" />
          </linearGradient>
        </defs>
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="var(--border-strong)" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="url(#gauge-grad)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray="157" strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }} />
        <text x="60" y="55" textAnchor="middle" fill="var(--text-primary)" fontFamily="Space Grotesk" fontWeight="700" fontSize="18">{score}</text>
        <text x="60" y="64" textAnchor="middle" fill="var(--text-tertiary)" fontSize="7">/100</text>
      </svg>
    </div>
  )
}

export default function AiDemo() {
  const [ticker, setTicker] = useState('')
  const [apiUrl, setApiUrlState] = useState(getApiBase)
  const [apiStatus, setApiStatus] = useState('idle') // idle | online | offline | error
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    pingApi().then(setApiStatus)
    const interval = setInterval(() => pingApi().then(setApiStatus), 15000)
    return () => clearInterval(interval)
  }, [])

  const handleApiUrlChange = (v) => {
    setApiUrlState(v)
    setApiBase(v)
  }

  const analyze = async () => {
    const t = ticker.trim().toUpperCase()
    if (!t) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await analyzeStock(t)
      setResult(data)
    } catch (e) {
      setError(e.message || 'Analysis failed. Try another ticker.')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = { online: '#22c55e', offline: '#ef4444', error: '#f59e0b', idle: '#64748b' }

  const badgeClass = result
    ? result.risk_label?.includes('Low') ? styles.badgeLow
      : result.risk_label?.includes('Medium') ? styles.badgeMedium : styles.badgeHigh
    : ''

  const sentIcon = result?.sentiment?.label === 'positive' ? '📈'
    : result?.sentiment?.label === 'negative' ? '📉' : '➡️'

  return (
    <section id="ai-demo" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className="section-eyebrow">✨ Try It Now</div>
          <h2 className="section-title">AI Risk Analyzer</h2>
          <p className="section-subtitle">Experience our AI engine — enter a ticker and get instant analysis</p>
        </div>

        <div className={styles.widget}>
          {/* API Bar */}
          <div className={styles.apiBar}>
            <Plug size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <span className={styles.apiLabel}>API:</span>
            <input
              className={styles.apiInput}
              value={apiUrl}
              onChange={e => handleApiUrlChange(e.target.value)}
              placeholder="https://fin-alpha-backends-1.onrender.com"
            />
            <div className={styles.dot} style={{ background: statusColor[apiStatus] }} title={`API ${apiStatus}`} />
          </div>

          {/* Input */}
          <div className={styles.inputGroup}>
            <input
              ref={inputRef}
              className={styles.tickerInput}
              value={ticker}
              onChange={e => setTicker(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && analyze()}
              placeholder="Enter ticker (AAPL, GOOGL, TSLA, MSFT)"
              maxLength={8}
            />
            <button className={`btn-primary ${styles.analyzeBtn}`} onClick={analyze} disabled={loading}>
              {loading
                ? <><span className={styles.spinner} /> Analyzing...</>
                : <><Cpu size={15} /> Analyze</>}
            </button>
          </div>

          {/* Error */}
          {error && <div className={styles.errorMsg}>{error}</div>}

          {/* Result */}
          {result && (
            <div className={styles.result}>
              <div className={styles.resultHeader}>
                <div>
                  <div className={styles.resultTicker}>{result.ticker}</div>
                  <small className={styles.resultSub}>
                    ${result.price} · {result.total_return > 0 ? '+' : ''}{result.total_return}% (1Y) · {result.news_count} news analyzed
                  </small>
                </div>
                <span className={`${styles.badge} ${badgeClass}`}>{result.risk_label}</span>
              </div>

              <RiskGauge score={result.risk_score} />

              <div className={styles.metrics}>
                {[
                  { label: 'Volatility', value: result.vol },
                  { label: 'Beta', value: result.beta },
                  { label: 'Sharpe Ratio', value: result.sharpe },
                  { label: 'Sortino Ratio', value: result.sortino },
                  { label: 'VaR (95%)', value: result.var },
                  { label: 'RSI (14d)', value: result.rsi },
                ].map(m => (
                  <div key={m.label} className={styles.metric}>
                    <div className={styles.metricLabel}>{m.label}</div>
                    <div className={styles.metricValue}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div className={styles.recommendation}>
                <div className={styles.recLabel}>AI Recommendation</div>
                <div className={styles.recText}>{sentIcon} {result.recommendation}</div>
              </div>

              <div className={styles.chartLink}>
                <a href={`/chart?ticker=${result.ticker}&period=1y`}
                   className="btn-outline" style={{ gap: '8px', fontSize: '0.88rem' }}>
                  <BarChart2 size={15} /> View Interactive Chart
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
