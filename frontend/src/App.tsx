import { useState } from 'react'
import './styles/globals.css'
import Navbar     from './components/Layout/Navbar'
import Hero       from './components/Hero/Hero'
import About      from './components/Hero/About'
import Experience from './components/Experience/Experience'
import Projects   from './components/Projects/Projects'
import Skills     from './components/Skills/Skills'
import Education  from './components/Education/Education'
import Contact    from './components/Contact/Contact'
import ChatBot    from './components/ChatBot/ChatBot'

export default function App() {
  const [lang, setLang] = useState<'en'|'de'>('en')

  return (
    <>
      <Navbar lang={lang} onLangChange={setLang} />
      <main>
        <Hero       lang={lang} />
        <About      lang={lang} />
        <Experience lang={lang} />
        <Projects   lang={lang} />
        <Skills     lang={lang} />
        <Education  lang={lang} />
        <Contact    lang={lang} />
      </main>
      <ChatBot />
    </>
  )
}
