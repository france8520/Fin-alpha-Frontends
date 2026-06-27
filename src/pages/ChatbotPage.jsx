import {
  Activity,
  BarChart2,
  Bot,
  CheckCircle2,
  Compass,
  ExternalLink,
  Gauge,
  LineChart,
  Loader2,
  MessageSquarePlus,
  Plug,
  Radio,
  RefreshCw,
  Search,
  Send,
  Settings2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Waves,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyzeStock, getApiBase, pingApi, setApiBase } from '../utils/api'
import styles from './ChatbotPage.module.css'

const tickerAliases = {
  apple: 'AAPL',
  microsoft: 'MSFT',
  tesla: 'TSLA',
  nvidia: 'NVDA',
  amazon: 'AMZN',
  google: 'GOOGL',
  alphabet: 'GOOGL',
  meta: 'META',
  netflix: 'NFLX',
  amd: 'AMD',
  palantir: 'PLTR',
}

const privateCompanyProfiles = [
  {
    name: 'Neuralink',
    aliases: ['neuralink', 'neural link'],
    text: 'Neuralink does not have a public stock ticker right now. It is a private company, so regular investors cannot buy Neuralink shares through normal stock exchanges like Nasdaq or NYSE. If it has an IPO in the future, then it would get a public ticker.',
  },
  {
    name: 'SpaceX',
    aliases: ['spacex', 'space x'],
    text: 'SpaceX is private and does not have a public stock ticker. Some private-market platforms may show estimated share values, but it is not available through normal public stock trading.',
  },
  {
    name: 'OpenAI',
    aliases: ['openai', 'open ai'],
    text: 'OpenAI is not publicly traded and does not have a public stock ticker. You cannot buy OpenAI stock directly through a normal brokerage account.',
  },
  {
    name: 'Stripe',
    aliases: ['stripe'],
    text: 'Stripe is still private and does not have a public stock ticker. Shares are generally limited to private-market transactions, not ordinary exchange trading.',
  },
]

const starters = [
  'Analyze NVDA and summarize the related news',
  'Does Neuralink have stock?',
  'What does sentiment say about AAPL?',
  'Compare MSFT momentum and risk',
]

const watchlist = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMD', 'META']

function extractTicker(text) {
  const clean = text.trim()
  const cashtag = clean.match(/\$([A-Za-z]{1,5})(?:\b|$)/)
  if (cashtag) return cashtag[1].toUpperCase()

  const alias = Object.entries(tickerAliases).find(([name]) =>
    new RegExp(`\\b${name}\\b`, 'i').test(clean)
  )
  if (alias) return alias[1]

  const candidates = clean.match(/\b[A-Z]{1,5}\b/g) || []
  const ignored = new Set(['AI', 'CEO', 'CFO', 'ETF', 'USA', 'USD', 'THE', 'AND', 'NEWS'])
  return candidates.find(symbol => !ignored.has(symbol)) || ''
}

function findPrivateCompany(text) {
  const clean = text.toLowerCase().replace(/[-_]/g, ' ')
  return privateCompanyProfiles.find(company =>
    company.aliases.some(alias => new RegExp(`\\b${alias.replace(/\s+/g, '\\s+')}\\b`, 'i').test(clean))
  )
}

function isCompanyStatusQuestion(text) {
  return /\b(stock|ticker|symbol|ipo|public|publicly traded|listed|shares|invest|buy)\b/i.test(text)
}

function buildGeneralFallback(text) {
  if (isCompanyStatusQuestion(text)) {
    return 'I can answer company and ticker questions too, but I do not know that company yet. Try the official company name, or ask about a public ticker like TSLA, NVDA, AAPL, MSFT, META, or AMD.'
  }

  return 'I can help with stock research questions: public ticker analysis, company-to-ticker lookup, private/public stock status, risk, sentiment, and related news. Try asking "Does Neuralink have stock?" or "Analyze Tesla news."'
}

function formatPercent(value) {
  if (typeof value !== 'number') return value
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

function sentimentTone(label) {
  if (label === 'positive') return styles.positive
  if (label === 'negative') return styles.negative
  return styles.neutral
}

function riskTone(label = '') {
  if (label.includes('Low')) return styles.positive
  if (label.includes('High')) return styles.negative
  return styles.warning
}

function buildAssistantText(result) {
  const move = result.total_return >= 0 ? 'up' : 'down'
  return `${result.ticker} is trading around $${result.price}. Over the last year it is ${move} ${Math.abs(result.total_return)}%, with ${result.risk_label.toLowerCase()} and ${result.sentiment?.label || 'neutral'} news sentiment. ${result.recommendation}`
}

function RiskArc({ score = 0 }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0))
  const offset = 157 - (safeScore / 100) * 157

  return (
    <div className={styles.riskArc}>
      <svg viewBox="0 0 120 70" role="img" aria-label={`Risk score ${safeScore} out of 100`}>
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="rgba(148, 199, 255, 0.16)" strokeWidth="9" strokeLinecap="round" />
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="157"
          strokeDashoffset={offset}
        />
        <text x="60" y="51" textAnchor="middle" fill="#ecf8ff" fontWeight="700" fontSize="20">{safeScore}</text>
        <text x="60" y="64" textAnchor="middle" fill="#89a9c7" fontSize="7">RISK</text>
      </svg>
    </div>
  )
}

function StockAnswer({ result }) {
  const sentiment = result.sentiment || {}
  const newsItems = Array.isArray(result.news_items) ? result.news_items.slice(0, 3) : []

  return (
    <div className={styles.answer}>
      <div className={styles.answerHeader}>
        <div>
          <div className={styles.symbolRow}>
            <span>{result.ticker}</span>
            <span className={`${styles.pill} ${riskTone(result.risk_label)}`}>{result.risk_label}</span>
          </div>
          <p>{buildAssistantText(result)}</p>
        </div>
        <RiskArc score={result.risk_score} />
      </div>

      <div className={styles.metricGrid}>
        <div className={styles.metric}>
          <span>Price</span>
          <strong>${result.price}</strong>
        </div>
        <div className={styles.metric}>
          <span>1Y return</span>
          <strong className={result.total_return >= 0 ? styles.positiveText : styles.negativeText}>
            {formatPercent(result.total_return)}
          </strong>
        </div>
        <div className={styles.metric}>
          <span>Volatility</span>
          <strong>{result.vol}</strong>
        </div>
        <div className={styles.metric}>
          <span>Beta</span>
          <strong>{result.beta}</strong>
        </div>
        <div className={styles.metric}>
          <span>Sharpe</span>
          <strong>{result.sharpe}</strong>
        </div>
        <div className={styles.metric}>
          <span>RSI</span>
          <strong>{result.rsi}</strong>
        </div>
      </div>

      <div className={styles.sentimentCard}>
        <div className={styles.cardTitle}>
          <Radio size={15} />
          News sentiment
        </div>
        <span className={`${styles.pill} ${sentimentTone(sentiment.label)}`}>
          {sentiment.label || 'neutral'} {typeof sentiment.score === 'number' ? sentiment.score.toFixed(2) : ''}
        </span>
        <p>
          The backend analyzed {result.news_count || 0} related news items for the recommendation.
          {newsItems.length === 0 ? ' Deploy the updated backend to show headline links here.' : ''}
        </p>
      </div>

      {newsItems.length > 0 && (
        <div className={styles.newsList}>
          {newsItems.map((item, index) => (
            <a key={`${item.title}-${index}`} href={item.link || '#'} target="_blank" rel="noreferrer" className={styles.newsItem}>
              <span>{item.publisher || 'Market news'}</span>
              <strong>{item.title}</strong>
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      )}

      <div className={styles.answerActions}>
        <Link to={`/chart?ticker=${result.ticker}&period=1y`} className={styles.secondaryButton}>
          <BarChart2 size={16} />
          Open chart
        </Link>
      </div>
    </div>
  )
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <article className={`${styles.message} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
      <div className={styles.avatar} aria-hidden="true">
        {isUser ? <User size={17} /> : <Bot size={18} />}
      </div>
      <div className={styles.bubble}>
        {message.loading ? (
          <div className={styles.typing}>
            <Loader2 size={16} />
            Reading market data and news sentiment...
          </div>
        ) : (
          <>
            {message.text && <p>{message.text}</p>}
            {message.result && <StockAnswer result={message.result} />}
          </>
        )}
      </div>
    </article>
  )
}

export default function ChatbotPage() {
  const [apiUrl, setApiUrlState] = useState(getApiBase)
  const [apiStatus, setApiStatus] = useState('idle')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Ask me about a public ticker, company name, stock status, risk, or related news. Try "Analyze NVDA news", "Is Tesla risky?", or "Does Neuralink have stock?"',
    },
  ])
  const [activeResult, setActiveResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    pingApi().then(setApiStatus)
    const interval = setInterval(() => pingApi().then(setApiStatus), 20000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const statusMeta = useMemo(() => {
    if (apiStatus === 'online') return { label: 'Live API', className: styles.online }
    if (apiStatus === 'offline') return { label: 'API offline', className: styles.offline }
    if (apiStatus === 'error') return { label: 'API error', className: styles.warningDot }
    return { label: 'Checking API', className: styles.idle }
  }, [apiStatus])

  const updateApiUrl = value => {
    setApiUrlState(value)
    setApiBase(value)
  }

  const sendPrompt = async (prompt = input) => {
    const trimmed = prompt.trim()
    if (!trimmed || isLoading) return

    const ticker = extractTicker(trimmed)
    const privateCompany = findPrivateCompany(trimmed)
    const userMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed }
    setMessages(current => [...current, userMessage])
    setInput('')

    if (!ticker) {
      if (privateCompany) {
        setMessages(current => [
          ...current,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            text: privateCompany.text,
          },
        ])
        return
      }

      setMessages(current => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: buildGeneralFallback(trimmed),
        },
      ])
      return
    }

    setIsLoading(true)
    const loadingId = crypto.randomUUID()
    setMessages(current => [...current, { id: loadingId, role: 'assistant', loading: true }])

    try {
      const result = await analyzeStock(ticker)
      setActiveResult(result)
      setMessages(current => current.map(message =>
        message.id === loadingId
          ? { id: loadingId, role: 'assistant', result }
          : message
      ))
    } catch (error) {
      setMessages(current => current.map(message =>
        message.id === loadingId
          ? {
              id: loadingId,
              role: 'assistant',
              text: error.message || `I could not analyze ${ticker}. Try another ticker or check the API URL.`,
            }
          : message
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: 'New chat ready. Which stock should we investigate?',
      },
    ])
    setActiveResult(null)
    setInput('')
  }

  return (
    <main className={styles.page}>
      <aside className={styles.sidebar}>
        <a className={styles.brand} href="/">
          <img src="/Fin.png" alt="FinAlpha" />
          <span>FinAlpha</span>
        </a>

        <button className={styles.newChatButton} onClick={startNewChat}>
          <MessageSquarePlus size={17} />
          New chat
        </button>

        <div className={styles.sideSection}>
          <div className={styles.sideTitle}>
            <Compass size={15} />
            Watchlist
          </div>
          <div className={styles.watchlist}>
            {watchlist.map(symbol => (
              <button key={symbol} onClick={() => sendPrompt(`Analyze ${symbol} and related news`)}>
                <span>{symbol}</span>
                <Search size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sideSection}>
          <div className={styles.sideTitle}>
            <Settings2 size={15} />
            Data connection
          </div>
          <label className={styles.apiField}>
            <span>API URL</span>
            <input value={apiUrl} onChange={event => updateApiUrl(event.target.value)} />
          </label>
          <div className={styles.statusLine}>
            <span className={`${styles.statusDot} ${statusMeta.className}`} />
            {statusMeta.label}
          </div>
        </div>
      </aside>

      <section className={styles.chatShell}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.kicker}>
              <Waves size={16} />
              Ocean intelligence
            </div>
            <h1>Stock news chatbot</h1>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.iconButton} onClick={() => pingApi().then(setApiStatus)} title="Refresh API status">
              <RefreshCw size={17} />
            </button>
            <Link to="/chart?ticker=AAPL&period=1y" className={styles.iconButton} title="Open chart page">
              <LineChart size={17} />
            </Link>
          </div>
        </header>

        <div className={styles.chatBody}>
          <div className={styles.messages} ref={listRef}>
            {messages.map(message => <MessageBubble key={message.id} message={message} />)}
          </div>

          <div className={styles.promptStrip}>
            {starters.map(prompt => (
              <button key={prompt} onClick={() => sendPrompt(prompt)}>
                <Sparkles size={14} />
                {prompt}
              </button>
            ))}
          </div>

          <form className={styles.composer} onSubmit={event => {
            event.preventDefault()
            sendPrompt()
          }}>
            <div className={styles.inputWrap}>
              <Search size={18} />
              <input
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder="Ask about a stock, company, ticker, risk, sentiment, or news..."
                disabled={isLoading}
              />
            </div>
            <button
              className={`${styles.sendButton} ${isLoading ? styles.loadingSend : ''}`}
              disabled={isLoading || !input.trim()}
              title="Send message"
            >
              {isLoading ? <Loader2 size={18} /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </section>

      <aside className={styles.insightPanel}>
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <Activity size={17} />
            Current focus
          </div>
          {activeResult ? (
            <>
              <div className={styles.focusSymbol}>{activeResult.ticker}</div>
              <div className={styles.focusPrice}>
                ${activeResult.price}
                <span className={activeResult.total_return >= 0 ? styles.positiveText : styles.negativeText}>
                  {activeResult.total_return >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                  {formatPercent(activeResult.total_return)}
                </span>
              </div>
              <RiskArc score={activeResult.risk_score} />
              <div className={styles.panelMetric}>
                <span>Recommendation</span>
                <strong>{activeResult.recommendation}</strong>
              </div>
              <div className={styles.panelMetric}>
                <span>Sentiment</span>
                <strong>{activeResult.sentiment?.label || 'neutral'}</strong>
              </div>
            </>
          ) : (
            <div className={styles.emptyFocus}>
              <Gauge size={32} />
              <p>Ask about a ticker and the latest analysis will anchor here.</p>
            </div>
          )}
        </div>

        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <Plug size={17} />
            Capabilities
          </div>
          <ul className={styles.capabilityList}>
            <li><CheckCircle2 size={15} /> Price and 1Y return</li>
            <li><CheckCircle2 size={15} /> Risk score and volatility</li>
            <li><CheckCircle2 size={15} /> FinBERT news sentiment</li>
            <li><CheckCircle2 size={15} /> Chart handoff by ticker</li>
          </ul>
        </div>
      </aside>
    </main>
  )
}
