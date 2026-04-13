import { useState } from 'react'
import { portfolioData, t, Lang } from '../../data/portfolio'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const i18n = {
  en: { label: '02. experience', title1: "Where I've", title2: 'Worked' },
  de: { label: '02. erfahrung',  title1: 'Wo ich',     title2: 'gearbeitet habe' },
}

export default function Experience({ lang = 'en' }: { lang?: Lang }) {
  const [active, setActive] = useState(0)
  const s   = i18n[lang]
  const exp = portfolioData.experience

  const { ref: headRef }    = useScrollReveal<HTMLDivElement>({ type: 'flipUp',    delay: 0   })
  const { ref: tabsRef }    = useScrollReveal<HTMLDivElement>({ type: 'fadeLeft',  delay: 120 })
  const { ref: contentRef } = useScrollReveal<HTMLDivElement>({ type: 'fadeRight', delay: 200 })

  return (
    <section id="experience" className="section" style={{ background:'var(--bg-secondary)' }}>
      <div className="container">
        <div ref={headRef}>
          <p className="section-label">{s.label}</p>
          <h2 className="section-title">
            {s.title1}<br/>
            <span style={{ color:'var(--accent-bright)', fontStyle:'italic' }}>{s.title2}</span>
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:'40px' }}>
          {/* Tab list — interactive, hover is appropriate */}
          <div ref={tabsRef} style={{ display:'flex', flexDirection:'column', borderLeft:'1px solid var(--border)' }}>
            {exp.map((e, i) => (
              <button key={e.id} onClick={() => setActive(i)} style={{
                background: active === i ? 'rgba(139,92,246,0.08)' : 'none',
                border: 'none', cursor: 'pointer',
                padding: '14px 24px', textAlign: 'left',
                borderLeft: `2px solid ${active === i ? 'var(--accent-bright)' : 'transparent'}`,
                marginLeft: '-1px', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (active !== i) e.currentTarget.style.background = 'rgba(139,92,246,0.04)' }}
              onMouseLeave={e => { if (active !== i) e.currentTarget.style.background = 'none' }}
              >
                <p style={{ fontFamily:'var(--font-body)', fontWeight: active===i ? 600 : 400, fontSize:'13px', color: active===i ? 'var(--accent-bright)' : 'var(--text-secondary)', transition:'color 0.2s' }}>
                  {e.company}
                </p>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-muted)', marginTop:'3px', letterSpacing:'0.05em' }}>
                  {e.period}
                </p>
              </button>
            ))}
          </div>

          {/* Content — translated role, location, description */}
          <div ref={contentRef} style={{ padding:'4px 0' }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'22px', fontWeight:700, fontStyle:'italic', color:'var(--text-primary)', marginBottom:'4px', letterSpacing:'-0.01em' }}>
              {t(exp[active].role, lang)}
            </h3>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-muted)', marginBottom:'20px', letterSpacing:'0.07em' }}>
              {exp[active].period} · {t(exp[active].location, lang)}
            </p>
            <p style={{ whiteSpace:'pre-line', fontFamily:'var(--font-body)', fontWeight:300, color:'var(--text-secondary)', lineHeight:1.9, fontSize:'15px', marginBottom:'24px' }}>
              {t(exp[active].description, lang)}
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
              {exp[active].tech.map(tech => <span key={tech} className="tag">{tech}</span>)}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#experience .container>div:last-child{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
