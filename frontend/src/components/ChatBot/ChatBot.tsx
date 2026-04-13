import { useState, useRef, useEffect, useCallback } from 'react'

interface Message { role: 'user' | 'bot'; text: string; id: string }
interface ChatHistory { question: string; answer: string }

const SESSION_ID = `session_${Date.now()}`
const SUGGESTIONS = [
  "What's Preeti working on?",
  "Tell me about her AI projects",
  "Surprise me 😉",
  "Is she open to work?",
  "What's her tech stack?",
]

export default function ChatBot() {
  const [open, setOpen]                     = useState(false)
  const [messages, setMessages]             = useState<Message[]>([{
    id: 'welcome', role: 'bot',
    text: "Heyy, I'm Uttara — Preeti's AI buddy 😄 Wanna know who is she, what she's good at, or what she's worked on? Go ahead, ask me anything 👀"
  }])
  const [input, setInput]                   = useState('')
  const [loading, setLoading]               = useState(false)
  const [chatHistory, setChatHistory]       = useState<ChatHistory[]>([])
  const [usedSugs, setUsedSugs]             = useState<Set<string>>(new Set())
  const messagesRef                         = useRef<HTMLDivElement>(null)
  const panelRef                            = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

useEffect(() => {
  const handleOpen = () => setOpen(true)

  window.addEventListener("open-chatbot", handleOpen)

  return () => {
    window.removeEventListener("open-chatbot", handleOpen)
  }
}, [])

  async function sendMessage(text?: string) {
    const question = (text ?? input).trim()
    if (!question || loading) return
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: question }])
    setInput('')
    setLoading(true)
    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': SESSION_ID },
        body: JSON.stringify({ question, chat_history: chatHistory })
      })
      const data = await res.json()
      const answer = data.answer || "Hmm, something went wrong. Try again?"
      setMessages(prev => [...prev, { id: `bot_${Date.now()}`, role: 'bot', text: answer }])
      setChatHistory(prev => [...prev, { question, answer }])
    } catch {
      setMessages(prev => [...prev, { id: `err_${Date.now()}`, role: 'bot', text: "Oops! Lost the connection. Try again in a sec." }])
    } finally {
      setLoading(false)
    }
  }

  function handleSuggestion(s: string) {
    setUsedSugs(prev => new Set([...prev, s]))
    sendMessage(s)
  }

  const visibleSugs = SUGGESTIONS.filter(s => !usedSugs.has(s))

  return (
    <>
      {/* ════════════════════════════════════════════
          CHAT PANEL — light purple gradient themed
          ════════════════════════════════════════════ */}
      {open && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed', bottom: '96px', right: '24px', zIndex: 999,
            width: '580px',
            height:'520px',
            display: 'flex', flexDirection: 'column',
            borderRadius: '22px',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(88,28,220,0.25), 0 0 0 1px rgba(139,92,246,0.2)',
            animation: 'chatSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1)',
            // Light purple gradient background — like the reference image
            background: 'linear-gradient(123deg, rgba(236, 222, 252) 20%, #dbadff 41%, rgba(197, 129, 252) 70%)'
          }}>

          {/* ── Header ── */}
          <div style={{
            position: 'relative', zIndex: 1,
            padding: '14px 18px 12px',
            background: 'linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(139,92,246,0.06) 100%)',
            borderBottom: '1px solid rgba(109,40,217,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              {/* Avatar — purple gradient circle */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 700, color: '#3b0764',
                fontFamily: 'var(--font-logo)',
                boxShadow: '0 0 0 3px rgba(139,92,246,0.2), 0 4px 12px rgba(109,40,217,0.35)',
                flexShrink: 0,
              }}>UT</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: '#3b0764', letterSpacing: '-0.01em' }}>
                  Uttara
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--bg-card)', letterSpacing: '0.05em' }}>
                  Answering Smartly
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Online status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0bdb58', boxShadow: '0 0 6px rgba(22,163,74,0.7)', animation: 'glow 2s ease infinite' }}/>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#15803d', animation: 'glow 2s ease infinite' }}>online</span>
              </div>
              {/* AI powered badge */}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.04em',
                color: '#7c3aed', background: 'rgba(139,92,246,0.12)',
                border: '1px solid rgba(139,92,246,0.25)',
                padding: '2px 8px', borderRadius: '20px',
              }}>AI powered</div>
              {/* Close */}
              <button onClick={() => setOpen(false)} style={{
                background: 'rgba(109,40,217,0.08)', border: '1px solid rgba(109,40,217,0.15)',
                borderRadius: '6px', cursor: 'pointer', color: 'rgba(109,40,217,0.5)',
                fontSize: '16px', lineHeight: 1, padding: '3px 7px', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#3b0764'; e.currentTarget.style.background = 'rgba(109,40,217,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(109,40,217,0.5)'; e.currentTarget.style.background = 'rgba(109,40,217,0.08)' }}
              >×</button>
            </div>
          </div>

          {/* ── Messages scroll area ── */}
          <div
            ref={messagesRef}
            style={{
              position: 'relative', zIndex: 1,
              flex: 1, overflowY: 'auto',
              padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
              height: '300px',          // fixed height so wheel events are contained
              maxHeight: '300px',
              // Custom scrollbar — purple tinted
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(139,92,246,0.3) transparent',
            }}
          >
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  // User bubble: rich purple gradient
                  // Bot bubble: white/translucent with light purple tint
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #6d28d9, #8b5cf6)'
                    : 'rgba(255,255,255,0.72)',
                  border: msg.role === 'bot' ? '1px solid rgba(139,92,246,0.15)' : 'none',
                  color: msg.role === 'user' ? '#fff' : '#3b0764',
                  fontSize: '13px', lineHeight: 1.65,
                  fontFamily: 'var(--font-body)',
                  fontWeight: msg.role === 'user' ? 500 : 400,
                  boxShadow: msg.role === 'user'
                    ? '0 4px 16px rgba(109,40,217,0.3)'
                    : '0 2px 8px rgba(139,92,246,0.08)',
                  backdropFilter: msg.role === 'bot' ? 'blur(8px)' : 'none',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '5px', padding: '8px 12px',
                background: 'rgba(255,255,255,0.6)', borderRadius: '12px',
                width: 'fit-content', backdropFilter: 'blur(6px)',
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '7px', height: '7px', borderRadius: '50%',
                    background: '#8b5cf6', opacity: 0.5,
                    animation: `bounce 0.9s ease ${i * 0.15}s infinite`,
                  }}/>
                ))}
              </div>
            )}
            <div/>
          </div>

          {/* ── Suggestion chips ── */}
          {visibleSugs.length > 0 && messages.length < 3 && (
            <div style={{
              position: 'relative', zIndex: 1,
              padding: '8px 14px 4px',
              display: 'flex', flexWrap: 'wrap', gap: '6px',
              borderTop: '1px solid rgba(139,92,246,0.12)',
            }}>
              {visibleSugs.slice(0, 4).map(s => (
                <button key={s} onClick={() => handleSuggestion(s)} style={{
                  fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500,
                  padding: '5px 11px', borderRadius: '20px',
                  background: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(109,40,217,0.2)',
                  color: '#6d28d9',
                  cursor: 'pointer', transition: 'all 0.15s', lineHeight: 1.4,
                  backdropFilter: 'blur(6px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,40,217,0.12)'; e.currentTarget.style.borderColor = 'rgba(109,40,217,0.4)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.65)'; e.currentTarget.style.borderColor = 'rgba(109,40,217,0.2)' }}
                >{s}</button>
              ))}
            </div>
          )}

          {/* ── Input row ── */}
          <div style={{
            position: 'relative', zIndex: 1,
            padding: '10px 12px 12px',
            borderTop: '1px solid rgba(139,92,246,0.12)',
            display: 'flex', gap: '8px', alignItems: 'center',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(10px)',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything about Preeti…"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(139,92,246,0.22)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#3b0764',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backdropFilter: 'blur(6px)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(109,40,217,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.22)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: 'linear-gradient(135deg, #6d28d9, #8b5cf6)',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading || !input.trim() ? 0.4 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.2s, transform 0.15s',
              boxShadow: '0 4px 14px rgba(109,40,217,0.4)',
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000,
          width: '60px', height: '60px',
          borderRadius: '18px',
          background: open
            ? 'rgba(237,233,254,0.95)'
            : 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 55%, #a78bfa 100%)',
          border: open ? '1px solid rgba(139,92,246,0.4)' : 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open
            ? '0 8px 32px rgba(109,40,217,0.2)'
            : '0 8px 32px rgba(109,40,217,0.5), 0 0 0 4px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.18)',
          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          color: open ? '#6d28d9' : '#fff',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 5h10a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4 3v-4a3 3 0 0 1-1-2V8a3 3 0 0 1 3-3z" opacity="0.4"/>
            <path d="M8 9h10a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3h-5l-4 3v-4a3 3 0 0 1-1-2v-4a3 3 0 0 1 3-3z"/>
          </svg>
        )}
      </button>

      {/* Pulse ring */}
      {!open && (
        <div style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 999,
          width: '60px', height: '60px', borderRadius: '18px',
          border: '2px solid rgba(139,92,246,0.4)',
          animation: 'ringPulse 2.5s ease infinite',
          pointerEvents: 'none',
        }}/>
      )}

      <style>{`
        @keyframes chatSlideUp { from{opacity:0;transform:translateY(18px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-5px);opacity:1} }
        @keyframes glow { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes ringPulse { 0%{transform:scale(1);opacity:0.6} 60%{transform:scale(1.22);opacity:0} 100%{transform:scale(1.22);opacity:0} }
        /* Custom scrollbar for messages area */
        div::-webkit-scrollbar { width: 4px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.25); border-radius: 4px; }
        div::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.45); }
      `}</style>
    </>
  )
}
