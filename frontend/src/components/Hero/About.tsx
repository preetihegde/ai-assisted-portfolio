import { portfolioData, t, Lang } from '../../data/portfolio'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const i18n = {
  en: {
    label: '01. about', title1: 'About', title2: 'Me',
    location: 'Location', focus: 'Focus', values: 'Values', languages: 'Languages',
    focusVal: 'AI Engineering  · LLMs · Full-Stack AI',
    valuesVal: 'Communication · Ownership · Accountability',
    langsVal: 'English · German',

    subline: 'Based in {loc} · Open to Relocation & Remote',
  },
  de: {
    label: '01. über mich', title1: 'Über', title2: 'mich',
    location: 'Standort', focus: 'Schwerpunkt', values: 'Arbeitsweise', languages: 'Sprachen',
    focusVal: 'KI-Engineering · Backend · LLMs',
    valuesVal: 'Kommunikation · Ownership · Anpassung',
    langsVal: 'Englisch · Deutsch',
    subline: 'Wohnhaft in {loc} · Remote & Umzug möglich',
  },
}

export default function About({ lang = 'en' }: { lang?: Lang }) {
  const s = i18n[lang]
  const { ref: headRef }  = useScrollReveal<HTMLDivElement>({ type: 'glide',    delay: 0   })
  const { ref: textRef }  = useScrollReveal<HTMLDivElement>({ type: 'fadeLeft', delay: 100 })
  const { ref: cardsRef } = useScrollReveal<HTMLDivElement>({ type: 'fadeRight',delay: 180 })

  const locLabel = lang === 'de' ? 'Würzburg' : portfolioData.city

  return (
    <section id="about" className="section">
      <div className="container">
        <div ref={headRef}>
          <p className="section-label">{s.label}</p>
          <h2 className="section-title">
            {s.title1} <span style={{ color:'var(--accent-bright)', fontStyle:'italic' }}>{s.title2}</span>
          </h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'72px', alignItems:'start' }}>
          <div ref={textRef}>
            <p style={{ fontFamily:'var(--font-body)', fontWeight:300, fontSize:'16px', color:'var(--text-secondary)', lineHeight:1.9, marginBottom:'22px', whiteSpace:'pre-line' }}>
              {t(portfolioData.about, lang)}
            </p>
            <p style={{ fontFamily:'var(--font-sub)', fontStyle:'italic', fontSize:'18px', color:'var(--comp-teal)', lineHeight:1.7 }}>
              {s.subline.replace('{loc}', locLabel)}
            </p>
          </div>
          <div ref={cardsRef} style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {[
              { label: s.location,  value: locLabel,    color:'var(--accent-bright)' },
              { label: s.focus,     value: s.focusVal,  color:'var(--comp-rose)' },
              { label: s.values,    value: s.valuesVal, color:'var(--comp-teal)' },
              { label: s.languages, value: s.langsVal,  color:'var(--comp-amber)' },
            ].map(item => (

              <div key={item.label} style={{
                background:'var(--bg-card)',
                border:'1px solid var(--border)',
                borderRadius:'var(--radius)',
                padding:'13px 18px',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.1em' }}>{item.label}</span>
                <span style={{ fontFamily:'var(--font-body)', fontWeight:500, fontSize:'13px', color:item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){#about .container>div:nth-child(2){grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
