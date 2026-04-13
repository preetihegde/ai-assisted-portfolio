import { portfolioData, t as tr, Lang } from '../../data/portfolio'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const i18n = {
  en: { label:'03. projects', title1:"Things I've", title2:'Built', viewAll:'view all →' },
  de: { label:'03. projekte', title1:'Was ich',    title2:'gebaut habe', viewAll:'alle ansehen →' },
}

export default function Projects({ lang = 'en' }: { lang?: Lang }) {
  const s        = i18n[lang]
  const featured = portfolioData.projects.filter(p => p.featured)

  // Scroll animations
  const { ref: headRef }     = useScrollReveal<HTMLDivElement>({ type: 'fadeUp',    delay: 0   })
  const { ref: featuredRef } = useScrollReveal<HTMLDivElement>({ type: 'zoomIn',    delay: 100 })
  const { ref: othersRef }   = useScrollReveal<HTMLDivElement>({ type: 'flipUp',    delay: 180 })
  const others   = portfolioData.projects.filter(p => !p.featured)

  const GHIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
  const ExtIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  )
  const FolderIcon = ({ color }: { color: string }) => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
    </svg>
  )

  // Top bar gradient per project index
  const bars = [
    'linear-gradient(90deg, #8b5cf6, #f472b6)',
    'linear-gradient(90deg, #f472b6, #2dd4bf)',
    'linear-gradient(90deg, #2dd4bf, #8b5cf6)',
  ]
  const folderColors = ['var(--accent-bright)', 'var(--comp-rose)', 'var(--comp-teal)']

  return (
    <section id="projects" className="section">
      <div className="container">
        <div ref={headRef}>
          <p className="section-label">{s.label}</p>
          <h2 className="section-title">
            {s.title1}<br />
            <span style={{ color:'var(--accent-bright)', fontStyle:'italic' }}>{s.title2}</span>
          </h2>
        </div>

        {/* ── Featured: equal-height 2-col grid ── */}
        <div ref={featuredRef} style={{
          display:'grid',
          gridTemplateColumns:'repeat(2, 1fr)',
          gap:'18px',
          marginBottom:'18px',
          alignItems:'stretch',
        }}>
          {featured.map((proj, i) => (
            <div key={proj.id} style={{
              position:'relative', overflow:'hidden',
              background:'var(--bg-card)',
              border:'1px solid var(--border)',
              borderRadius:'14px',
              padding:'24px',
              display:'flex', flexDirection:'column',
              cursor:'default',
              transition:'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)' }}
            >

              {/* Coloured top bar */}
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:'2px',
                background: bars[i % bars.length],
              }} />

              {/* Header row */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'18px' }}>
                <FolderIcon color={folderColors[i % folderColors.length]} />
                <div style={{ display:'flex', gap:'14px' }}>
                  {proj.github && (
                    <a href={proj.github} style={{ color:'var(--text-muted)', transition:'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color='var(--accent-bright)')}
                      onMouseLeave={e => (e.currentTarget.style.color='var(--text-muted)')}><GHIcon /></a>
                  )}
                  {proj.demo && ( proj.demo.type === "chatbot" ? (
                      <a href="#"
                       onClick={(e) => {
                         e.preventDefault()
                         window.dispatchEvent(new Event("open-chatbot"))
                       }}
                       style={{ color:'var(--text-muted)', transition:'color 0.2s' }}
                       onMouseEnter={e => (e.currentTarget.style.color='var(--accent-bright)')}
                       onMouseLeave={e => (e.currentTarget.style.color='var(--text-muted)')}
                     ><ExtIcon /></a>
                     ):(
                    <a href={proj.demo} style={{ color:'var(--text-muted)', transition:'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color='var(--accent-bright)')}
                      onMouseLeave={e => (e.currentTarget.style.color='var(--text-muted)')}><ExtIcon /></a>
                      )
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily:'var(--font-display)',
                fontSize:'19px', fontWeight:700,
                color:'var(--text-primary)', marginBottom:'10px',
                letterSpacing:'-0.01em', lineHeight:1.25,
              }}>{tr(proj.title, lang)}</h3>

              {/* Description — flex-grow so cards stretch to same height */}
              <p style={{
                fontFamily:'var(--font-body)', fontWeight:300,
                color:'var(--text-secondary)', fontSize:'14px',
                lineHeight:1.8, marginBottom:'20px',
                flexGrow:1,
              }}>
                {tr(proj.description, lang)}
              </p>

              {/* Tech tags — always at bottom */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'auto' }}>
                {proj.tech.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* ── Others: 3-col grid, same equal-height approach ── */}
        <h3 style={{
          fontFamily:'var(--font-display)',
          fontSize:'20px',
          margin:'26px 0 14px',
          color:'var(--text-secondary)'
        }}>
          Other Projects
        </h3>

        {others.length > 0 && (
          <div ref={othersRef} style={{
            display:'grid',
            gridTemplateColumns:'repeat(3, 1fr)',
            gap:'16px',
            alignItems:'stretch',
          }}>
            {others.map((proj, i) => (
              <div key={proj.id} style={{
                position:'relative', overflow:'hidden',
                background:'var(--bg-card)',
                border:'1px solid var(--border)',
                borderRadius:'16px',
                padding:'22px',
                display:'flex', flexDirection:'column',
                transition:'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.background='var(--bg-card-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)';        e.currentTarget.style.background='var(--bg-card)' }}
              >
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:'2px',
                  background: bars[(i + 2) % bars.length],
                }} />

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                  <FolderIcon color={folderColors[(i + 2) % folderColors.length]} />
                  {proj.github && (
                    <a href={proj.github} style={{ color:'var(--text-muted)', transition:'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color='var(--accent-bright)')}
                      onMouseLeave={e => (e.currentTarget.style.color='var(--text-muted)')}><GHIcon /></a>
                  )}
                </div>

                <h4 style={{
                  fontFamily:'var(--font-display)',
                  fontSize:'16px', fontWeight:700,
                  color:'var(--text-primary)', marginBottom:'8px',
                  lineHeight:1.3,
                }}>{tr(proj.title, lang)}</h4>

                <p style={{
                  fontFamily:'var(--font-body)', fontWeight:300,
                  color:'var(--text-secondary)', fontSize:'13px',
                  lineHeight:1.75, marginBottom:'16px',
                  flexGrow:1,
                }}>
                  {tr(proj.description, lang)}
                </p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'auto' }}>
                  {proj.tech.map(t => (
                    <span key={t} className="tag" style={{ fontSize:'10px' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          #projects .container > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
