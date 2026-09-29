import { useEffect, useRef, useState } from 'react'
import { GREETING, FALLBACK, findReply, askGemini } from './knowledge.js'

let msgId = 0

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: msgId++, from: 'bot', text: GREETING.text, chips: GREETING.chips },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const logRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [messages, typing, open])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const send = (raw) => {
    const text = raw.trim()
    if (!text || typing) return
    setInput('')
    const history = messages.slice(1) // skip the canned greeting
    setMessages((m) => [
      // Chips stay on the latest bot message only
      ...m.map((msg) => ({ ...msg, chips: undefined })),
      { id: msgId++, from: 'user', text },
    ])
    setTyping(true)

    const showReply = (reply) => {
      setTyping(false)
      setMessages((m) => [
        ...m,
        { id: msgId++, from: 'bot', text: reply.text, chips: reply.chips },
      ])
    }

    const reply = findReply(text)
    if (reply) {
      setTimeout(() => showReply(reply), 450 + Math.min(reply.text.length * 4, 700))
    } else {
      // No scripted answer — ask Gemini (kept on-brand by its system
      // prompt); if it fails or is offline, fall back to the canned reply.
      askGemini(text, history).then((aiText) =>
        showReply(aiText ? { text: aiText } : FALLBACK)
      )
    }
  }

  return (
    <div className="chatbot">
      {open && (
        <div className="chatbot__panel" role="dialog" aria-label="Chat with Snappy">
          <header className="chatbot__head">
            <img src="/images/chatbot-icon.jpeg" alt="" className="chatbot__mascot" />
            <div className="chatbot__headtext">
              <strong>Snappy</strong>
              <small>the kiosk mascot · usually instant</small>
            </div>
            <button
              type="button"
              className="chatbot__close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="chatbot__log" ref={logRef}>
            {messages.map((m) => (
              <div key={m.id} className={`chatbot__row chatbot__row--${m.from}`}>
                {m.from === 'bot' && <img src="/images/chatbot-icon.jpeg" alt="" className="chatbot__avatar" />}
                <div className={`chatbot__bubble chatbot__bubble--${m.from}`}>
                  {m.text.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {typing && (
              <div className="chatbot__row chatbot__row--bot">
                <img src="/images/chatbot-icon.jpeg" alt="" className="chatbot__avatar" />
                <div className="chatbot__bubble chatbot__bubble--bot chatbot__bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            {!typing && messages[messages.length - 1]?.chips?.length > 0 && (
              <div className="chatbot__chips">
                {messages[messages.length - 1].chips.map((chip) => (
                  <button key={chip} type="button" className="chatbot__chip" onClick={() => send(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="chatbot__inputrow"
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="chatbot__input"
              placeholder="Ask Snappy anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Type your message"
            />
            <button type="submit" className="chatbot__send" aria-label="Send message">
              ✈
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className={open ? 'chatbot__fab chatbot__fab--open' : 'chatbot__fab'}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Chat with Snappy'}
      >
        {open ? '×' : <img src="/images/chatbot-icon.jpeg" alt="" className="chatbot__fabmascot" />}
        {!open && <span className="chatbot__fabhint">chat!</span>}
      </button>
    </div>
  )
}
