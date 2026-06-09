'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Message } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Send } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function MessagesPage() {
  const { token } = useParams<{ token: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    // Authenticate first
    await fetch('/api/auth/client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    const res = await fetch('/api/client/messages')
    if (res.ok) setMessages(await res.json())
    setLoading(false)
  }, [token])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!newMessage.trim()) return
    setSending(true)
    await fetch('/api/client/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMessage }),
    })
    setNewMessage('')
    setSending(false)
    fetchMessages()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#0a1628] text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href={`/client/${token}`} className="text-gray-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-[#1a6dff] font-bold">Azure Média</p>
            <p className="text-gray-400 text-sm">Messages</p>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {loading ? (
            <p className="text-center text-gray-400 mt-20">Chargement...</p>
          ) : messages.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-gray-400">Aucun message pour le moment</p>
              <p className="text-gray-400 text-sm mt-1">Envoyez un message à votre agence</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                  msg.sender === 'client'
                    ? 'bg-[#1a6dff] text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                }`}>
                  {msg.sender === 'admin' && (
                    <p className="text-xs font-semibold mb-1 text-[#1a6dff]">Azure Média</p>
                  )}
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'client' ? 'text-blue-200' : 'text-gray-400'}`}>
                    {format(new Date(msg.created_at), "dd/MM à HH'h'mm", { locale: fr })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 bg-white border rounded-xl p-2 shadow-sm">
          <Textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            className="flex-1 resize-none border-0 focus-visible:ring-0 min-h-0"
            rows={1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button onClick={sendMessage} disabled={sending || !newMessage.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
