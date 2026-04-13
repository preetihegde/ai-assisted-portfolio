import { portfolioData, Lang } from '../../data/portfolio'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const i18n = {
  en: { label:'04. skills', title1:'What I', title2:'Work With' },
  de: { label:'04. kenntnisse', title1:'Womit ich', title2:'arbeite' },
}

const categoryConfig: Record<string, { color: string }> = {
  'AI & ML':            { color:'#622dfc' },
  'Backend':            { color:'#f472b6' },
  'Frontend':           { color:'#2dd4bf' },
  'Databases':          { color:'#3e86fa' },
  'DevOps & Cloud':     {color: '#fbbf24'},
  'Tools & Practices':  {color: ' #f4fb24'},
}

export default function Skills({ lang = 'en' }: { lang?: Lang }) {
  const t = i18n[lang]
  const { ref: headRef }  = useScrollReveal<HTMLDivElement>({ type: 'zoomIn',   delay: 0   })
  const { ref: gridRef }  = useScrollReveal<HTMLDivElement>({ type: 'fadeUp',   delay: 120 })
  return (
    <section id="skills" className="section" style={{ background:'var(--bg-secondary)' }}>
      <div className="container">
        <div ref={headRef}><p className="section-label">{t.label}</p>
        <h2 className="section-title">
          {t.title1}<br />
          <span style={{ color:'var(--accent-bright)', fontStyle:'italic' }}>{t.title2}</span>
        </h2>
        </div><div ref={gridRef} style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'20px' }}>
          {Object.entries(portfolioData.skills).map(([category, skills]) => {
            const cfg = categoryConfig[category] || { color:'var(--bg-card)' }
            return (
              <div key={category} className="card">
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                  <div style={{ width:'3px', height:'18px', background:cfg.color, borderRadius:'2px', flexShrink:0 }} />
                  <h3 style={{ fontFamily:'var(--font-sub)', fontStyle:'italic', fontSize:'18px', fontWeight:500, letterSpacing:'0.02em', color:cfg.color }}>
                    {category}
                  </h3>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                  {(skills as string[]).map(skill => (
                    <span key={skill} style={{
                      padding:'6px 13px',
                      background:`${cfg.color}10`,
                      border:`1px solid ${cfg.color}28`,
                      borderRadius:'6px',
                      fontFamily:'var(--font-body)', fontWeight:400, fontSize:'13px',
                      color:'var(--text-secondary)', transition:'all 0.2s', cursor:'default',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color=cfg.color; e.currentTarget.style.borderColor=`${cfg.color}55`; e.currentTarget.style.background=`${cfg.color}18` }}
                    onMouseLeave={e => { e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.borderColor=`${cfg.color}28`; e.currentTarget.style.background=`${cfg.color}10` }}
                    >{skill}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { #skills .container > div { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  )
}
