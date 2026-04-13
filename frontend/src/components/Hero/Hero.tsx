import { useEffect, useRef, useState } from 'react'
import { portfolioData } from '../../data/portfolio'

const i18n = {
  en: {
    eyebrow: 'Hello, World',
    title2: 'Software Developer',
    tagline: 'Building intelligent systems that bridge the gap between cutting-edge AI and real-world impact.',
    btn1: 'View projects',
    btn2: 'GitHub',
    chipLoc: 'Germany',
    chipAvail: 'Open to new challenges',
    chipExp: 'yrs exp.',
    sub: 'AI Engineer · Software Developer',
  },
  de: {
    eyebrow: 'Hallo, Welt',
    title2: 'Software-Entwicklerin',
    tagline: 'Ich baue intelligente Systeme, die modernste KI mit realer Wirkung verbinden.',
    btn1: 'Projekte ansehen',
    btn2: 'GitHub',
    chipLoc: 'Deutschland',
    chipAvail: 'offen für Stellen',
    chipExp: 'J. Erfahrung',
    sub: 'KI-Ingenieurin · Software-Entwicklerin',
  },
}

export default function Hero({ lang = 'en' }: { lang?: 'en' | 'de' }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const t = i18n[lang]

  // scroll-based fade
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const fade      = Math.min(scrollY / 360, 1)
  const heroOpa   = 1 - fade
  const heroShift = fade * 36

  // particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const pts: { x:number;y:number;vx:number;vy:number;r:number;a:number }[] = []
    for (let i = 0; i < 55; i++) pts.push({
      x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      vx:(Math.random()-.5)*.22, vy:(Math.random()-.5)*.22,
      r: Math.random()*1.5+.3, a: Math.random()*.28+.06,
    })
    let id: number
    const draw = () => {
      if (!ctx||!canvas) return
      ctx.clearRect(0,0,canvas.width,canvas.height)
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0||p.x>canvas.width)  p.vx*=-1
        if(p.y<0||p.y>canvas.height) p.vy*=-1
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(139,92,246,${p.a})`; ctx.fill()
      })
      pts.forEach((p,i)=>pts.slice(i+1).forEach(q=>{
        const d=Math.hypot(p.x-q.x,p.y-q.y)
        if(d<115){
          ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y)
          ctx.strokeStyle=`rgba(139,92,246,${.042*(1-d/115)})`
          ctx.lineWidth=.5; ctx.stroke()
        }
      }))
      id=requestAnimationFrame(draw)
    }
    draw()
    const onR=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight}
    window.addEventListener('resize',onR)
    return()=>{cancelAnimationFrame(id);window.removeEventListener('resize',onR)}
  },[])

  const firstName = portfolioData.name.split(' ')[0]
  const lastName  = portfolioData.name.split(' ')[1]

  return (
    <section id="hero" style={{
      minHeight:'80vh', display:'flex', alignItems:'flex-start',
      position:'relative', overflow:'hidden', paddingTop:'68px',
    }}>
      {/* Canvas */}
      <canvas ref={canvasRef} style={{position:'absolute',inset:0,zIndex:0,opacity:.45}}/>

      {/* Deep purple ambient — concentrated left where photo sits */}
      <div style={{
        position:'absolute',inset:0,zIndex:0,
        background:[
          'radial-gradient(ellipse 60% 80% at 18% 55%, rgba(88,28,220,0.38) 0%, transparent 60%)',
          'radial-gradient(ellipse 35% 40% at 55% 45%, rgba(139,92,246,0.06) 0%, transparent 55%)',
        ].join(','),
      }}/>

      {/* Fixed top fade-in overlay when scrolling */}
      <div style={{
        position:'fixed',top:0,left:0,right:0,height:'150px',
        zIndex:50,pointerEvents:'none',
        background:'linear-gradient(to bottom, rgba(8,8,15,1) 0%, rgba(8,8,15,.55) 55%, transparent 100%)',
        opacity:Math.min(scrollY/70,1),
      }}/>

      {/* Main scrollable wrapper */}
      <div style={{
        position:'relative',zIndex:1,width:'100%',
        opacity: heroOpa,
        transform:`translateY(-${heroShift}px)`,
        willChange:'opacity,transform',
      }}>
        <div className="container">
          <div style={{
            display:'grid',
            gridTemplateColumns:'400px 1fr',
            gap:'72px',
            alignItems:'center',
            minHeight:'calc(100vh - 120px)',
          }}>

            {/* ═══════════════════════════════
                LEFT — photo, NO frame/box
                ═══════════════════════════════ */}
            <div style={{
              position:'relative',
              opacity:0,
              animation:'fadeInLeft .85s cubic-bezier(.22,1,.36,1) .12s forwards',
            }}>

              {/* Photo — no border, no box, just bleeds into page */}
              <div style={{
                position:'relative',
                width:'100%',
                // Tall portrait ratio
                aspectRatio:'3/4',
                borderRadius:'25px',
                overflow:'hidden',
              }}>
                {/* Actual photo */}
                <img
                  src="/profile_picture.jpg"
                  alt={portfolioData.name}
                  style={{
                    width:'100%',height:'100%',
                    objectFit:'cover',
                    objectPosition:'center top',
                    display:'block',
                    // Desaturate slightly so it blends with dark bg
                    filter:'brightness(.95) contrast(1.04)',
                  }}
                  onError={e=>{
                    const el=e.currentTarget as HTMLImageElement
                    el.style.display='none'
                    const fb=el.nextElementSibling as HTMLElement
                    if(fb) fb.style.display='flex'
                  }}
                />

                {/* Fallback initials */}
                <div style={{
                  display:'none',position:'absolute',inset:0,
                  alignItems:'center',justifyContent:'center',
                  background:'linear-gradient(160deg,#1a1535,#0e0c22)',
                }}>
                  <div style={{
                    width:'110px',height:'110px',borderRadius:'50%',
                    background:'linear-gradient(135deg,#6d28d9,#9333ea)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'var(--font-display)',fontSize:'40px',fontWeight:800,
                    color:'rgba(238,237,254,.9)',
                    border:'2px solid rgba(167,139,250,.3)',
                  }}>{firstName[0]}{lastName[0]}</div>
                </div>

                {/* Bottom gradient — photo fades INTO the page bg, no hard edge */}
                <div style={{
                  position:'absolute',bottom:0,left:0,right:0,
                  height:'55%',
                  background:'linear-gradient(to top, rgba(8,8,15,1) 0%, rgba(8,8,15,.7) 35%, transparent 100%)',
                  zIndex:3,pointerEvents:'none',
                }}/>

                {/* Right-edge gradient — bleeds into text column */}
                <div style={{
                  position:'absolute',top:0,right:0,bottom:0,
                  width:'40%',
                  background:'linear-gradient(to left, rgba(8,8,15,.9) 0%, transparent 100%)',
                  zIndex:3,pointerEvents:'none',
                }}/>

                {/* Left-edge soft purple glow bleed */}
                <div style={{
                  position:'absolute',top:0,left:0,bottom:0,
                  width:'35%',
                  background:'linear-gradient(to right, rgba(88,28,220,.18) 0%, transparent 100%)',
                  zIndex:3,pointerEvents:'none',
                }}/>

                {/* Name watermark — inside photo at bottom */}
                <div style={{
                  position:'absolute',bottom:'22px',left:'22px',right:'22px',zIndex:5,
                }}>
                  <p style={{
                    fontFamily:'var(--font-display)',fontStyle:'italic',
                    fontSize:'14px',color:'rgba(200,185,255,.55)',
                    letterSpacing:'.04em',marginBottom:'3px',
                  }}>{portfolioData.name}</p>
                  <p style={{
                    fontFamily:'var(--font-mono)',fontSize:'9px',
                    color:'rgba(139,92,246,.45)',letterSpacing:'.12em',
                    textTransform:'uppercase',
                  }}>{t.sub}</p>
                </div>
              </div>

              {/* ── Floating chips — outside the photo, float over its edge ── */}

              {/* "open to work" — top right, overlaps photo */}
              <div style={{
                position:'absolute',top:'20px',right:'-10px',zIndex:10,
                background:'rgba(8,24,18,.92)',
                border:'1px solid rgba(45,212,191,.42)',
                borderRadius:'10px',padding:'8px 14px',
                backdropFilter:'blur(14px)',
                display:'flex',alignItems:'center',gap:'8px',
                boxShadow:'0 8px 28px rgba(0,0,0,.45), 0 0 0 1px rgba(45,212,191,.08)',
                animation:'floatA 4s ease-in-out infinite',
              }}>
                <div style={{
                  width:'8px',height:'8px',borderRadius:'50%',
                  background:'#2dd4bf',
                  boxShadow:'0 0 10px rgba(45,212,191,.8)',
                  animation:'pulseG 2s ease infinite',flexShrink:0,
                }}/>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'#2dd4bf',letterSpacing:'.04em'}}>
                  {t.chipAvail}
                </span>
              </div>

              {/* "Germany" — bottom left, overlaps photo */}
              <div style={{
                position:'absolute',bottom:'80px',left:'-14px',zIndex:10,
                background:'rgba(10,8,22,.9)',
                border:'1px solid rgba(139,92,246,.32)',
                borderRadius:'10px',padding:'8px 14px',
                backdropFilter:'blur(16px)',
                display:'flex',alignItems:'center',gap:'7px',
                boxShadow:'0 8px 28px rgba(0,0,0,.45)',
                fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-secondary)',
                animation:'floatB 5s ease-in-out infinite',
              }}>
                <span style={{fontSize:'13px'}}>📍</span> {t.chipLoc}
              </div>

              {/* "3+ yrs exp" — middle left */}
              <div style={{
                position:'absolute',top:'42%',right:'-10px',zIndex:10,
                transform:'translateY(-50%)',zIndex:10,
                background:'rgba(10,8,22,.9)',
                border:'1px solid rgba(139,92,246,.22)',
                borderRadius:'10px',padding:'11px 14px',
                backdropFilter:'blur(14px)',
                textAlign:'center',minWidth:'72px',
                boxShadow:'0 8px 28px rgba(0,0,0,.4)',
                animation:'floatC 4.5s ease-in-out infinite',
              }}>
                <div style={{
                  fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:800,
                  color:'var(--comp-blue)',lineHeight:1,
                }}>2.5+</div>
                <div style={{
                  fontFamily:'var(--font-mono)',fontSize:'10px',
                  color:'var(--comp-blue)',marginTop:'4px',lineHeight:1.3,
                }}>{t.chipExp}</div>
              </div>

              {/* Decorative purple orb glow behind photo — like reference image */}
              <div style={{
                position:'absolute',
                bottom:'-60px',left:'-60px',
                width:'280px',height:'280px',
                borderRadius:'50%',
                background:'radial-gradient(circle, rgba(109,40,217,.32) 0%, transparent 80%)',
                zIndex:-1,pointerEvents:'none',
              }}/>
          </div>

            {/* ═══════════════════════════════
                RIGHT — Text
                ═══════════════════════════════ */}
            <div>
              {/* Eyebrow */}
              <p style={{
                fontFamily:'var(--font-hello-world)',fontSize:'24px',
                color:'var(--accent-bright)',letterSpacing:'.2em',
                textTransform:'uppercase',marginBottom:'25px',
                display:'flex',alignItems:'center',gap:'9px',
                opacity:0,animation:'fadeUp .6s ease .32s forwards',
              }}>
                <span style={{opacity:0.6}}>&gt;</span>{t.eyebrow}
              </p>

              {/* Big name */}
              <h1 style={{
                fontFamily:'var(--font-display)',fontWeight:800,
                fontSize:'clamp(52px,6.5vw,90px)',
                lineHeight:.98,letterSpacing:'-.03em',
                marginBottom:'8px',
                opacity:0,animation:'fadeUp .65s ease .44s forwards',
              }}>
                {firstName}&nbsp;
                <span style={{color:'var(--accent-bright)',fontStyle:'italic'}}>{lastName}</span>
              </h1>

              {/* Sub title */}
              <h2 style={{
                fontFamily:'var(--font-sub)',fontStyle:'italic',fontWeight:500,
                fontSize:'clamp(17px,2.1vw,24px)',
                color:'var(--text-secondary)',marginBottom:'22px',
                letterSpacing:'.02em',
                opacity:0,animation:'fadeUp .6s ease .56s forwards',
              }}>
                AI Engineer &amp; {t.title2}
              </h2>

              {/* Tagline */}
              <p style={{
                fontFamily:'var(--font-body)',fontWeight:300,
                fontSize:'15px',color:'var(--text-secondary)',
                lineHeight:1.5,maxWidth:'440px',marginBottom:'38px',
                opacity:0,animation:'fadeUp .6s ease .66s forwards',
              }}>{t.tagline}</p>

              {/* CTAs */}
              <div style={{
                display:'flex',gap:'8px',flexWrap:'wrap',
                opacity:0,animation:'fadeUp .6s ease .76s forwards',
                marginTop:'-15px',
              }}>
                <a href="#projects" style={{
                  fontFamily:'var(--font-body)',fontWeight:500,fontSize:'13px',
                  background:'var(--accent)',color:'#fff',
                  padding:'10px 24px',borderRadius:'8px',
                  letterSpacing:'.03em',textDecoration:'none',
                  transition:'opacity .2s,transform .2s,box-shadow .2s',
                  boxShadow:'0 4px 20px var(--accent-glow)',
                }}
                onMouseEnter={e=>{e.currentTarget.style.opacity='.88';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 32px var(--accent-glow)'}}
                onMouseLeave={e=>{e.currentTarget.style.opacity='1';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px var(--accent-glow)'}}
                >{t.btn1}</a>
              </div>

              {/* Social + location row */}
              <div style={{
                display:'flex',gap:'20px',alignItems:'center',
                marginTop:'5px',paddingTop:'24px',
                borderTop:'1px solid rgba(139,92,246,.1)',
                opacity:0,animation:'fadeUp .6s ease .88s forwards',
              }}>
                <div style={{width:'2px',height:'20px',background:'rgba(139,92,246,.18)'}}/>
                {[
                  {label:'GitHub',   href:portfolioData.github},
                  {label:'LinkedIn', href:portfolioData.linkedin},
                  {label:'Medium', href:portfolioData.medium},
                ].map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                    fontFamily:'var(--font-mono)',fontSize:'14px',
                    color:'var(--text-muted)',letterSpacing:'.08em',
                    transition:'color .2s',textDecoration:'none',
                  }}
                  onMouseEnter={e=>(e.currentTarget.style.color='var(--accent-hover)')}
                  onMouseLeave={e=>(e.currentTarget.style.color='var(--accent-bright)')}
                  >{s.label}</a>
                ))}
               </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp      { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInLeft  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulseG      { 0%,100%{box-shadow:0 0 8px rgba(45,212,191,.6)} 50%{box-shadow:0 0 16px rgba(45,212,191,1)} }
        @keyframes scrollPulse { 0%,100%{opacity:.3;transform:scaleY(.8);transform-origin:top} 50%{opacity:.9;transform:scaleY(1);transform-origin:top} }
        @keyframes floatA      { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes floatB      { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
        @keyframes floatC      { 0%,100%{transform:translateY(-50%)} 50%{transform:translateY(calc(-50% - 5px))} }
        @media (max-width:960px){
          #hero .container>div { grid-template-columns:1fr!important; gap:40px!important; }
        }
      `}</style>
    </section>
  )
}
