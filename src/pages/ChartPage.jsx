import { ArrowLeft, BarChart2, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getApiBase } from '../utils/api'
import styles from './ChartPage.module.css'

export default function ChartPage() {
  const [params] = useSearchParams()
  const ticker = params.get('ticker') || 'AAPL'
  const period = params.get('period') || '1y'

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [activePeriod, setActivePeriod] = useState(period)
  const canvasRef = useRef(null)
  const [hoverData, setHoverData] = useState(null)

  const periods = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y']

  const fetchData = async (p) => {
    setLoading(true)
    setError('')
    try {
      const base = getApiBase()
      const res = await fetch(`${base}/chart/${encodeURIComponent(ticker)}?period=${p}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.detail || 'Failed to fetch chart data')
      setData(json)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData(activePeriod) }, [ticker, activePeriod])

  useEffect(() => {
    if (!data?.data || !canvasRef.current) return
    const canvas = canvasRef.current
    let currentHoverIndex = null

    const render = () => drawChart(canvas, data.data, currentHoverIndex)
    render()

    const resizeObserver = new ResizeObserver(() => render())
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const PAD = { top: 20, right: 20, bottom: 40, left: 60 }
      const w = rect.width - PAD.left - PAD.right

      if (x < PAD.left || x > rect.width - PAD.right || w <= 0) {
        if (currentHoverIndex !== null) {
          currentHoverIndex = null
          setHoverData(null)
          render()
        }
        return
      }

      const fraction = (x - PAD.left) / w
      let idx = Math.round(fraction * (data.data.length - 1))
      idx = Math.max(0, Math.min(data.data.length - 1, idx))

      if (idx !== currentHoverIndex) {
        currentHoverIndex = idx
        render()
        const p = data.data[idx]
        setHoverData({
          date: p.date,
          price: p.close,
          x: e.clientX,
          y: e.clientY
        })
      }
    }

    const handleMouseLeave = () => {
      currentHoverIndex = null
      setHoverData(null)
      render()
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      resizeObserver.disconnect()
    }
  }, [data])

  function drawChart(canvas, rawPrices, hoverIndex = null) {
    if (!rawPrices || !rawPrices.length) return;
    
    // Filter out nulls
    const validData = [];
    const validIndices = [];
    for (let i = 0; i < rawPrices.length; i++) {
      if (rawPrices[i] && typeof rawPrices[i].close === 'number' && !isNaN(rawPrices[i].close)) {
        validData.push(rawPrices[i].close);
        validIndices.push(i);
      }
    }
    if (validData.length === 0) return;

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return;
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    const W = rect.width, H = rect.height
    const PAD = { top: 20, right: 20, bottom: 40, left: 60 }
    const w = W - PAD.left - PAD.right
    const h = H - PAD.top - PAD.bottom

    const min = Math.min(...validData), max = Math.max(...validData)
    const range = (max - min) || 1

    const toX = i => PAD.left + (i / (rawPrices.length - 1 || 1)) * w
    const toY = v => PAD.top + h - ((v - min) / range) * h

    // Background - clear canvas properly
    ctx.clearRect(0, 0, W, H)

    // Grid lines
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = PAD.top + (i / gridLines) * h
      const val = max - (i / gridLines) * range
      ctx.beginPath()
      ctx.moveTo(PAD.left, y)
      ctx.lineTo(W - PAD.right, y)
      ctx.strokeStyle = 'hsla(210,20%,60%,0.1)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.fillStyle = 'hsla(210,20%,70%,0.5)'
      ctx.font = '11px Inter'
      ctx.textAlign = 'right'
      ctx.fillText('$' + val.toFixed(0), PAD.left - 8, y + 4)
    }

    // Area gradient
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + h)
    grad.addColorStop(0, 'hsla(210,100%,60%,0.25)')
    grad.addColorStop(1, 'hsla(210,100%,60%,0.0)')
    ctx.beginPath()
    ctx.moveTo(toX(validIndices[0]), toY(validData[0]))
    for (let i = 1; i < validIndices.length; i++) {
        ctx.lineTo(toX(validIndices[i]), toY(validData[i]))
    }
    ctx.lineTo(toX(validIndices[validIndices.length - 1]), PAD.top + h)
    ctx.lineTo(toX(validIndices[0]), PAD.top + h)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // Line
    ctx.beginPath()
    ctx.moveTo(toX(validIndices[0]), toY(validData[0]))
    for (let i = 1; i < validIndices.length; i++) {
        ctx.lineTo(toX(validIndices[i]), toY(validData[i]))
    }
    ctx.strokeStyle = 'hsl(210,100%,60%)'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Date labels
    const labelCount = Math.min(6, rawPrices.length)
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor(i * (rawPrices.length - 1) / (labelCount - 1 || 1))
      if (rawPrices[idx]) {
        const x = toX(idx)
        const date = new Date(rawPrices[idx].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ctx.fillStyle = 'hsla(210,20%,70%,0.5)'
        ctx.font = '11px Inter'
        ctx.textAlign = 'center'
        ctx.fillText(date, x, H - 10)
      }
    }

    // Hover overlay
    if (hoverIndex !== null && rawPrices[hoverIndex] && typeof rawPrices[hoverIndex].close === 'number') {
      const hx = toX(hoverIndex)
      const hy = toY(rawPrices[hoverIndex].close)

      ctx.beginPath()
      ctx.moveTo(hx, PAD.top)
      ctx.lineTo(hx, PAD.top + h)
      ctx.strokeStyle = 'hsla(210, 20%, 70%, 0.4)'
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath()
      ctx.arc(hx, hy, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#0f172a'
      ctx.fill()
      ctx.strokeStyle = 'hsl(210,100%,60%)'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  const isUp = data?.change_pct >= 0

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/" className={`btn-outline ${styles.backBtn}`}>
            <ArrowLeft size={15} /> Back
          </Link>
          <div className={styles.tickerInfo}>
            <h1 className={styles.ticker}>{ticker}</h1>
            {data && (
              <div className={styles.priceRow}>
                <span className={styles.price}>${data.current_price?.toFixed(2)}</span>
                <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
                  {isUp ? '+' : ''}{data.change_pct?.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          <button className={`btn-outline ${styles.refreshBtn}`} onClick={() => fetchData(activePeriod)}>
            <RefreshCw size={14} />
          </button>
        </div>

        <div className={styles.periods}>
          {periods.map(p => (
            <button key={p} className={`${styles.periodBtn} ${activePeriod === p ? styles.periodActive : ''}`}
                    onClick={() => setActivePeriod(p)}>
              {p.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.chartCard}>
          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              <span>Loading chart data...</span>
            </div>
          )}
          {error && !loading && (
            <div className={styles.errorMsg}>
              <BarChart2 size={32} style={{ color: 'var(--text-tertiary)' }} />
              <p>{error}</p>
            </div>
          )}
          {!error && <canvas ref={canvasRef} className={styles.canvas} />}
          {hoverData && !loading && !error && (
            <div className={styles.tooltip} style={{ left: hoverData.x, top: hoverData.y - 40 }}>
              <div className={styles.tooltipDate}>
                {new Date(hoverData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className={styles.tooltipPrice}>${hoverData.price.toFixed(2)}</div>
            </div>
          )}
        </div>

        {data && !loading && (
          <div className={styles.statsGrid}>
            {[
              { label: '52w High', value: `$${data.high_52w?.toFixed(2)}` },
              { label: '52w Low', value: `$${data.low_52w?.toFixed(2)}` },
              { label: 'Avg Vol', value: data.avg_volume?.toLocaleString() },
              { label: 'Latest Close', value: `$${data.data[data.data.length - 1]?.close?.toFixed(2)}` },
            ].map(s => (
              <div key={s.label} className={styles.statItem}>
                <div className={styles.statLabel}>{s.label}</div>
                <div className={styles.statValue}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
