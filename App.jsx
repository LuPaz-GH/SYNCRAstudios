import Navbar from './components/Navbar'
import Contact from './components/Contact'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import useReveal from './hooks/useReveal'
import useInteractions from './hooks/useInteractions'
import Hero from './sections/Hero'
import Marquee from './sections/Marquee'
import Manifesto from './sections/Manifesto'
import About from './sections/About'
import Live from './sections/Live'
import Events from './sections/Events'
import Post from './sections/Post'
import Values from './sections/Values'
import Commitment from './sections/Commitment'
import Footer from './sections/Footer'

export default function App() {
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
    </>
  )
}
