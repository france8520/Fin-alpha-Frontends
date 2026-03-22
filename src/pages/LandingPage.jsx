import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import TrustBar from '../components/TrustBar'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import AiDemo from '../components/AiDemo'
import Stats from '../components/Stats'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import Cta from '../components/Cta'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import CursorEffect from '../components/CursorEffect'

export default function LandingPage() {
  return (
    <>
      <CursorEffect />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <Features />
        <AiDemo />
        <Stats />
        <Pricing />
        <Testimonials />
        <Faq />
        <Cta />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
