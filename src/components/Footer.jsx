import styles from './Footer.module.css'

const handleNavClick = (e, href) => {
  if (!href.startsWith('#')) return
  e.preventDefault()
  document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
              <img src="/Fin.png" alt="FinAlpha" className={styles.logo} />
              FinAlpha
            </div>
            <p className={styles.desc}>AI-powered financial intelligence for modern investors and institutions.</p>
            <div className={styles.socials}>
              {[
                { href: '#', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l16 16M4 20L20 4"/></svg>, label: 'X (Twitter)' },
                { href: '#', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>, label: 'LinkedIn' },
                { href: '#', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>, label: 'GitHub' },
              ].map(s => (
                <a key={s.label} href={s.href} className={styles.socialLink} aria-label={s.label}>{s.icon}</a>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Product',
              links: [
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'AI Demo', href: '#ai-demo' },
                { label: 'API Docs', href: '#' },
                { label: 'Changelog', href: '#' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Press', href: '#' },
                { label: 'Contact', href: '#contact' },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Cookie Policy', href: '#' },
                { label: 'Security', href: '#' },
                { label: 'SOC 2', href: '#' },
              ],
            },
          ].map(col => (
            <div key={col.title}>
              <h4 className={styles.colTitle}>{col.title}</h4>
              <ul className={styles.links}>
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className={styles.link} onClick={e => handleNavClick(e, l.href)}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>© {year} FinAlpha. All rights reserved. Built with ❤️ for investors worldwide.</p>
        </div>
      </div>
    </footer>
  )
}
