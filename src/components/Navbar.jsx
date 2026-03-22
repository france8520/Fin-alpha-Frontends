import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll)
    onScroll() // Trigger on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'AI Demo', href: '#ai-demo' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <a href="#home" className={styles.brand} onClick={e => handleNavClick(e, '#home')}>
          <img src="/Fin.png" alt="FinAlpha" className={styles.logo} />
          <span className={styles.brandName}>FinAlpha</span>
        </a>

        <div className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {navLinks.map(link => (
            <a key={link.href} href={link.href} className={styles.link}
               onClick={e => handleNavClick(e, link.href)}>
              {link.label}
            </a>
          ))}
          <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <a href="#pricing" className={`btn-primary ${styles.cta}`}
             onClick={e => handleNavClick(e, '#pricing')}>Get Started Free</a>
        </div>

        <div className={styles.mobileActions}>
          <button className={styles.themeBtn} onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className={styles.hamburger} onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
