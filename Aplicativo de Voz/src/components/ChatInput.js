'use client'

import { useState, useRef } from 'react'

export default function ChatInput({ onEnviar, carregando }) {
  const [pergunta, setPergunta] = useState('')
  const [ouvindo, setOuvindo] = useState(false)
  const textareaRef = useRef(null)
  const recognitionRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const texto = pergunta.trim()
    if (!texto || carregando) return
    onEnviar(texto)
    setPergunta('')
  }

  function handleInput(e) {
    setPergunta(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  function toggleMicrofone() {
    if (ouvindo) {
      recognitionRef.current?.stop()
      setOuvindo(false)
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Reconhecimento de voz não suportado neste navegador.')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = true
    recognitionRef.current = recognition

    recognition.onresult = (e) => {
      const transcript = Array.from(e.results).map((r) => r[0].transcript).join('')
      setPergunta(transcript)
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
      }
    }

    recognition.onend = () => {
      setOuvindo(false)
      setPergunta((prev) => {
        if (prev.trim()) {
          setTimeout(() => {
            const form = textareaRef.current?.closest('form')
            form?.requestSubmit()
          }, 300)
        }
        return prev
      })
    }

    recognition.onerror = () => setOuvindo(false)
    recognition.start()
    setOuvindo(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={pergunta}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua pergunta..."
            rows={1}
            disabled={carregando}
            className="w-full resize-none rounded-xl border border-white/20 px-4 py-[11px] text-white placeholder-white/40 bg-white/10 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors backdrop-blur-sm"
          />
        </div>

        <div className="flex gap-1.5 sm:self-center">
          <button
            type="button"
            onClick={toggleMicrofone}
            disabled={carregando}
            className={`rounded-xl border px-3 py-[11px] transition-all ${ouvindo ? 'bg-amber-500/30 border-amber-400/60 text-amber-300 shadow-lg shadow-amber-500/20 animate-pulse' : 'bg-white/10 hover:bg-white/20 border-white/20 text-white/60 hover:text-white'}`}
            title={ouvindo ? 'Parar gravação' : 'Falar'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button
            type="submit"
            disabled={carregando || !pergunta.trim()}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-[11px] text-white font-medium hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            {carregando ? (
              <span className="flex items-center gap-1 text-sm whitespace-nowrap">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="hidden sm:inline">Pensando...</span>
              </span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>

    </form>
  )
}
