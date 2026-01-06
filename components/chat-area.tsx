"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"
import ChatMessage from "./chat-message"

interface Message {
  role: string
  content: string
  isImage?: boolean
  isError?: boolean
}

export default function ChatArea({ 
  messages, 
  onSendMessage, 
  loading, 
  imageMode 
}: {
  messages: Message[]
  onSendMessage: (message: string) => void
  loading: boolean
  imageMode: boolean
}) {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px"
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !loading) {
      onSendMessage(input)
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
              <div className="text-center max-w-2xl px-4">
                <h1 className="text-3xl sm:text-4xl font-semibold mb-3">{imageMode ? "Generate Images" : "How can I help you today?"}</h1>
                <p className="text-muted-foreground text-lg mb-8">
                  {imageMode 
                    ? "Describe the image you want to create" 
                    : "Ask me anything, I'm here to help"}
                </p>
                {!imageMode && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
                    <button 
                      onClick={() => setInput("Explain quantum computing")}
                      className="p-4 border rounded-xl hover:bg-muted/50 transition text-left"
                    >
                      <div className="text-sm font-medium mb-1">Explain a concept</div>
                      <div className="text-xs text-muted-foreground">Learn about complex topics</div>
                    </button>
                    <button 
                      onClick={() => setInput("Write code for")}
                      className="p-4 border rounded-xl hover:bg-muted/50 transition text-left"
                    >
                      <div className="text-sm font-medium mb-1">Get code help</div>
                      <div className="text-xs text-muted-foreground">Programming assistance</div>
                    </button>
                    <button 
                      onClick={() => setInput("Help me with")}
                      className="p-4 border rounded-xl hover:bg-muted/50 transition text-left"
                    >
                      <div className="text-sm font-medium mb-1">Plan & organize</div>
                      <div className="text-xs text-muted-foreground">Get things done</div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="text-sm text-muted-foreground">Thinking...</div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t bg-background">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={imageMode ? "Describe the image..." : "Ask anything..."}
              className="w-full px-4 py-3 pr-12 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-ring resize-none min-h-[52px] max-h-[200px] bg-background"
              rows={1}
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || loading}
              className="absolute bottom-2.5 right-2.5 h-7 w-7 rounded-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
