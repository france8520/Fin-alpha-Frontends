import styles from './TrustBar.module.css'

const logos = ['Bloomberg', 'Goldman Sachs', 'JP Morgan', 'Citadel', 'BlackRock', 'Fidelity']

export default function TrustBar() {
  return (
    <section className={styles.trust}>
      <div className={styles.container}>
        <p className={styles.label}>Trusted by teams at</p>
        <div className={styles.logos}>
          {logos.map(l => <span key={l} className={styles.logo}>{l}</span>)}
        </div>
      </div>
    </section>
  )
}
