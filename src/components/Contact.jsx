import { useScrollReveal } from '../hooks/useScrollReveal'
import { MapPin, Send } from 'lucide-react'
import styles from './Contact.module.css'

export default function Contact() {
  const titleRef = useScrollReveal()
  const formRef = useScrollReveal()
  const mapRef = useScrollReveal()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire up form submission
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <div className="section-eyebrow"><MapPin size={12} /> Visit Us</div>
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle mx-auto">
            Have questions about our AI models? Want a custom enterprise demo? Drop us a message.
          </p>
        </div>

        <div className={styles.grid}>
          <div ref={formRef} className={`reveal ${styles.formCard}`} style={{ transitionDelay: '80ms' }}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input type="text" className={styles.input} placeholder="John Doe" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email</label>
                <input type="email" className={styles.input} placeholder="john@example.com" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Message</label>
                <textarea className={styles.textarea} rows={4} placeholder="How can we help you?" />
              </div>
              <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                Send Message <Send size={14} />
              </button>
            </form>
          </div>

          <div ref={mapRef} className={`reveal ${styles.mapCard}`} style={{ transitionDelay: '160ms' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564756836!5m2!1sen!2s"
              title="office-location"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 'inherit' }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
