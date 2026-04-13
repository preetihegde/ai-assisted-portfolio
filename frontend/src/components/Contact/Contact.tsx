import { portfolioData, Lang } from '../../data/portfolio'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const i18n = {
  en: {
    label:'06. contact', title1:"Let's", title2:'Connect',
    body:"I'm currently open to new opportunities. Whether you have a question, a project in mind, or just want to say hi — my inbox is always open.",
    cta:'say hello →',
    built:'✦ designed & built by Preeti ✦',
  },
  de: {
    label:'06. kontakt', title1:'Lass uns', title2:'verbinden',
    body:'Ich bin offen für neue Möglichkeiten. Ob Fragen, Projektideen oder einfach Hallo sagen — mein Postfach steht immer offen.',
    cta:'Hallo sagen →',
    built:'✦ designt & gebaut von Preeti ✦',
  },
}

export default function Contact({ lang = 'en' }: { lang?: Lang }) {
  const t = i18n[lang]
  const { ref: wrapRef } = useScrollReveal<HTMLDivElement>({ type: 'zoomIn', delay: 0 })
  return (
    <section id="contact" className="section" style={{ background:'var(--bg-secondary)' }}>
      <div className="container" style={{ textAlign:'center', maxWidth:'600px', margin:'0 auto' }}><div ref={wrapRef}>
        <p className="section-label" style={{ justifyContent:'center' }}>{t.label}</p>
        <h2 className="section-title" style={{ textAlign:'center' }}>
          {t.title1}{' '}
          <span style={{ color:'var(--accent-bright)', fontStyle:'italic' }}>{t.title2}</span>
        </h2>
        <p style={{ fontFamily:'var(--font-body)', fontWeight:300, color:'var(--text-secondary)', lineHeight:1.9, marginBottom:'44px', fontSize:'16px' }}>
          {t.body}
        </p>
        <a href={`mailto:${portfolioData.email}`} style={{
          display:'inline-block',
          fontFamily:'var(--font-body)', fontWeight:600, fontSize:'14px',
          border:'1px solid var(--accent)', color:'var(--accent-bright)',
          padding:'13px 40px', borderRadius:'var(--radius)',
          letterSpacing:'0.04em', marginBottom:'52px',
          transition:'all 0.25s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='var(--accent)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.boxShadow='0 4px 24px var(--accent-glow)' }}
        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--accent-bright)'; e.currentTarget.style.boxShadow='none' }}
        >{t.cta}</a>
        <div style={{ display:'flex', justifyContent:'center', gap:'32px', paddingTop:'28px', borderTop:'1px solid var(--border)' }}>
          {[
            { label:'GitHub',   href:portfolioData.github },
            { label:'LinkedIn', href:portfolioData.linkedin },
            { label:'Email',    href:`mailto:${portfolioData.email}` },
          ].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{
              fontFamily:'var(--font-body)', fontWeight:500, fontSize:'13px',
              color:'var(--text-muted)', letterSpacing:'0.04em', transition:'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color='var(--accent-bright)')}
            onMouseLeave={e => (e.currentTarget.style.color='var(--text-muted)')}
            >{link.label}</a>
          ))}
        </div>
        <p style={{ marginTop:'44px', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-end)', letterSpacing:'0.05em' }}>
          {t.built}
        </p>
      </div></div>
    </section>
  )
}
