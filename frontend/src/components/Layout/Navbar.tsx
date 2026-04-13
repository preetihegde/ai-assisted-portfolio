import { useState, useEffect } from 'react'
import { portfolioData } from '../../data/portfolio'

const navLinks = {
  en: [
    { label: 'about',      href: '#about' },
    { label: 'experience', href: '#experience' },
    { label: 'projects',   href: '#projects' },
    { label: 'skills',     href: '#skills' },
    { label: 'education',  href: '#education' },
    { label: 'contact',    href: '#contact' },
  ],
  de: [
    { label: 'über mich',  href: '#about' },
    { label: 'erfahrung',  href: '#experience' },
    { label: 'projekte',   href: '#projects' },
    { label: 'kenntnisse', href: '#skills' },
    { label: 'bildung',    href: '#education' },
    { label: 'kontakt',    href: '#contact' },
  ],
}

interface NavbarProps {
  lang: 'en' | 'de'
  onLangChange: (l: 'en' | 'de') => void
}

export default function Navbar({ lang, onLangChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = navLinks[lang]

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      padding:'0 32px',
      background: scrolled ? 'rgba(8,8,15,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(139,92,246,0.1)' : '1px solid transparent',
      transition:'all 0.3s ease',
      height:'68px',
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>

      {/* Logo — Bebas Neue */}
      <a href="#hero" style={{
        fontFamily:'var(--font-logo)',
        fontWeight:400, fontSize:'26px',
        color:'var(--text-primary)',
        letterSpacing:'0.12em', lineHeight:1,
        textDecoration:'none',
      }}>
        PH<span style={{ color:'var(--accent)', fontSize:'28px' }}>.</span>
      </a>

      {/* Desktop nav */}
      <div style={{ display:'flex', alignItems:'center', gap:'24px' }} className="desktop-nav">
        {links.map(link => (
          <a key={link.label} href={link.href} style={{
            fontFamily:'var(--font-body)', fontWeight:400,
            fontSize:'13px', letterSpacing:'0.03em',
            color:'var(--text-muted)',
            transition:'color 0.2s', textDecoration:'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >{link.label}</a>
        ))}

        {/* EN / DE toggle */}
        <div style={{
          display:'flex', gap:'2px',
          background:'rgba(139,92,246,0.08)',
          border:'0.5px solid rgba(139,92,246,0.2)',
          borderRadius:'8px', padding:'3px',
        }}>
          {(['en','de'] as const).map(l => (
            <button key={l} onClick={() => onLangChange(l)} style={{
              fontFamily:'var(--font-mono)', fontSize:'11px',
              letterSpacing:'0.08em',
              padding:'5px 12px', borderRadius:'5px',
              border:'none', cursor:'pointer',
              background: lang === l ? 'var(--accent)' : 'transparent',
              color: lang === l ? '#fff' : 'var(--text-muted)',
              transition:'all 0.18s',
              fontWeight: lang === l ? 700 : 400,
            }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Hire me CTA */}
        <a href={`mailto:${portfolioData.email}`} style={{
          fontFamily:'var(--font-body)', fontWeight:600,
          fontSize:'13px', letterSpacing:'0.04em',
          border:'1px solid var(--accent-border)',
          color:'var(--accent-bright)',
          padding:'7px 18px', borderRadius:'var(--radius)',
          transition:'all 0.2s', textDecoration:'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='var(--accent-dim)'; e.currentTarget.style.borderColor='var(--accent)' }}
        onMouseLeave={e => { e.currentTarget.style.background='transparent';       e.currentTarget.style.borderColor='var(--accent-border)' }}
        >
          {lang === 'en' ? 'Contact Me' : 'Kontaktieren'}
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  )
}
