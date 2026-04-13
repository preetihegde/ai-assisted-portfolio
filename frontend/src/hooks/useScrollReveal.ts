import { useEffect, useRef, useState } from 'react'

export type AnimationType =
  | 'fadeUp' | 'fadeLeft' | 'fadeRight'
  | 'zoomIn' | 'flipUp'   | 'glide'

interface Options {
  type?:      AnimationType
  delay?:     number
  threshold?: number
  once?:      boolean
}

// Initial (hidden) styles and final (visible) styles per animation type
const ANIM: Record<AnimationType, [string, string, string]> = {
  // [easing, from transform, to transform]
  fadeUp:    ['cubic-bezier(0.22,1,0.36,1)', 'opacity:0;transform:translateY(40px)',                        'opacity:1;transform:translateY(0)'],
  fadeLeft:  ['cubic-bezier(0.22,1,0.36,1)', 'opacity:0;transform:translateX(-48px)',                      'opacity:1;transform:translateX(0)'],
  fadeRight: ['cubic-bezier(0.22,1,0.36,1)', 'opacity:0;transform:translateX(48px)',                       'opacity:1;transform:translateX(0)'],
  zoomIn:    ['cubic-bezier(0.34,1.56,0.64,1)', 'opacity:0;transform:scale(0.86)',                         'opacity:1;transform:scale(1)'],
  flipUp:    ['cubic-bezier(0.22,1,0.36,1)', 'opacity:0;transform:perspective(700px) rotateX(15deg) translateY(30px)', 'opacity:1;transform:perspective(700px) rotateX(0deg) translateY(0)'],
  glide:     ['cubic-bezier(0.22,1,0.36,1)', 'opacity:0;transform:translateX(-22px) skewX(4deg)',          'opacity:1;transform:translateX(0) skewX(0deg)'],
}

function applyStyle(el: HTMLElement, css: string) {
  css.split(';').forEach(rule => {
    const [k, v] = rule.split(':')
    if (k && v !== undefined) (el.style as Record<string,string>)[k.trim()] = v.trim()
  })
}

export function useScrollReveal<T extends HTMLElement>(opts: Options = {}) {
  const { type = 'fadeUp', delay = 0, threshold = 0.13, once = false } = opts
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const [ease, fromCSS, toCSS] = ANIM[type]
    applyStyle(el, fromCSS)
    el.style.transition = `opacity 0.7s ${ease} ${delay}ms, transform 0.7s ${ease} ${delay}ms`

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        applyStyle(el, toCSS)
        setVisible(true)
        if (once) obs.disconnect()
      } else if (!once) {
        applyStyle(el, fromCSS)
        setVisible(false)
      }
    }, { threshold })

    obs.observe(el)
    return () => obs.disconnect()
  }, [])   // eslint-disable-line

  return { ref, visible }
}
