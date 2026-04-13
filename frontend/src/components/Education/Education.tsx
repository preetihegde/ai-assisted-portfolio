import { portfolioData, t, Lang } from '../../data/portfolio'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const i18n = {
  en: { label:'05. education', title1:'Academic',   title2:'Background',  thesis:'Thesis', viewThesis:'View thesis →' },
  de: { label:'05. bildung',   title1:'Akademische', title2:'Laufbahn',   thesis:'Abschlussarbeit', viewThesis:'Abschlussarbeit ansehen →' },
}

export default function Education({ lang = 'en' }: { lang?: Lang }) {
  const s = i18n[lang]
  const { ref: headRef } = useScrollReveal<HTMLDivElement>({ type: 'fadeLeft', delay: 0   })
  const { ref: listRef } = useScrollReveal<HTMLDivElement>({ type: 'flipUp',   delay: 130 })

  return (
    <section id="education" className="section">
      <div className="container">
        <div ref={headRef}>
          <p className="section-label">{s.label}</p>
          <h2 className="section-title">
            {s.title1}<br/>
            <span style={{ color:'var(--accent-bright)', fontStyle:'italic' }}>{s.title2}</span>
          </h2>
        </div>

        <div ref={listRef} style={{ display:'flex', flexDirection:'column', gap:'24px', position:'relative' }}>
          {/* Timeline line */}
          <div style={{
            position:'absolute', left:'19px', top:'24px', bottom:'24px',
            width:'1px', background:'linear-gradient(to bottom, var(--accent), transparent)',
          }} />

          {portfolioData.education.map((edu, i) => {
            const thesisText = t(edu.thesis, lang)
            const thesisUrl  = edu.thesis.url

            return (
              <div key={i} style={{ display:'flex', gap:'32px', alignItems:'flex-start' }}>
                {/* Index circle */}
                <div style={{
                  width:'40px', height:'40px', flexShrink:0,
                  border:'1px solid var(--accent-border)', background:'var(--bg-card)',
                  borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--accent-bright)', zIndex:1,
                }}>
                  {String(i+1).padStart(2,'0')}
                </div>

                {/* Card — no hover since it's informational only */}
                <div style={{
                  flex:1,
                  background:'var(--bg-card)',
                  border:'1px solid var(--border)',
                  borderRadius:'var(--radius-lg)',
                  padding:'28px',
                }}>
                  {/* Degree + period row */}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'19px', fontWeight:700, color:'var(--text-primary)', letterSpacing:'-0.01em' }}>
                      {t(edu.degree, lang)}
                    </h3>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--accent-bright)', border:'1px solid var(--accent-border)', padding:'3px 10px', borderRadius:'var(--radius)', flexShrink:0 }}>
                      {edu.period}
                    </span>
                  </div>

                  {/* Institution */}
                  <p style={{ fontFamily:'var(--font-sub)', fontStyle:'italic', fontSize:'16px', fontWeight:400, color:'var(--accent-bright)', marginBottom:'3px' }}>
                    {edu.institution}
                  </p>

                  {/* Location */}
                  <p style={{ fontFamily:'var(--font-body)', fontSize:'12px', color:'var(--text-muted)', marginBottom: thesisText ? '14px' : '0' }}>
                    {t(edu.location, lang)}
                  </p>

                  {/* Thesis block */}
                  {thesisText && (
                    <div style={{
                      marginTop:'14px', padding:'14px 16px',
                      background:'rgba(139,92,246,0.07)',
                      borderLeft:'2px solid var(--accent)',
                      borderRadius:'0 var(--radius) var(--radius) 0',
                    }}>
                      {/* Label row */}
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
                        <p style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-muted)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
                          {s.thesis}
                        </p>
                        {/* Thesis link — only shown if URL exists */}
                        {thesisUrl && (
                          <a
                            href={thesisUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              fontFamily:'var(--font-mono)', fontSize:'10px',
                              color:'var(--accent-bright)',
                              letterSpacing:'0.06em',
                              display:'flex', alignItems:'center', gap:'5px',
                              padding:'3px 10px',
                              border:'1px solid var(--accent-border)',
                              borderRadius:'20px',
                              transition:'all 0.2s',
                              textDecoration:'none',
                              flexShrink:0,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background='rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor='var(--accent)' }}
                            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='var(--accent-border)' }}
                          >
                            {/* External link icon */}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            {s.viewThesis}
                          </a>
                        )}
                      </div>

                      {/* Thesis title text */}
                      <p style={{ fontFamily:'var(--font-body)', fontWeight:300, fontSize:'13px', color:'var(--text-secondary)', lineHeight:1.7 }}>
                        {thesisText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
