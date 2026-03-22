const API_BASE_DEFAULT = 'https://fin-alpha-backends-1.onrender.com'

export function getApiBase() {
  return localStorage.getItem('finalphaApiUrl') || API_BASE_DEFAULT
}

export function setApiBase(url) {
  localStorage.setItem('finalphaApiUrl', url)
}

export async function analyzeStock(ticker) {
  const base = getApiBase()
  const res = await fetch(`${base}/analyze?ticker=${encodeURIComponent(ticker)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Analysis failed')
  return data
}

export async function pingApi() {
  const base = getApiBase()
  try {
    const r = await fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) })
    return r.ok ? 'online' : 'error'
  } catch {
    return 'offline'
  }
}
