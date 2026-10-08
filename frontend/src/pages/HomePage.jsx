import Navbar from '../components/layout/Navbar'
import Contact from '../components/home/Contact'
import Cursor from '../components/common/Cursor'
import Preloader from '../components/common/Preloader'
import useReveal from '../hooks/useReveal'
import useInteractions from '../hooks/useInteractions'
import Hero from '../components/home/Hero'
import Marquee from '../components/home/Marquee'
import Manifesto from '../components/home/Manifesto'
import About from '../components/home/About'
import Live from '../components/home/Live'
import Events from '../components/home/Events'
import Post from '../components/home/Post'
import Values from '../components/home/Values'
import Commitment from '../components/home/Commitment'
import Footer from '../components/layout/Footer'
import WhatsAppButton from '../components/common/WhatsAppButton'

export default function HomePage() {
  useReveal()
  useInteractions()

  return (
    <>
      <Preloader />
      <Cursor />
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Marquee />
        <div id="manifiesto">
          <Manifesto />
        </div>
        <About />
        <Live />
        <Events />
        <Post />
        <Values />
        <Commitment />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
