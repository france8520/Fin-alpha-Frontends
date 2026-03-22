import styles from './Cta.module.css'

export default function Cta() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.glow} />
          <h2 className={styles.title}>Ready to Transform Your Risk Analysis?</h2>
          <p className={styles.subtitle}>Join 10,000+ professionals already using FinAlpha to invest smarter</p>
          <div className={styles.emailGroup}>
            <input type="email" className={styles.emailInput} placeholder="Enter your email" />
            <button className={`btn-primary ${styles.emailBtn}`}>Start Free Trial</button>
          </div>
          <p className={styles.fine}>No credit card required · 14-day free trial · Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}
