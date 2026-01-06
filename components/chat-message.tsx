"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple markdown rendering
  const renderContent = (content) => {
    if (message.isImage) {
      return <img src={content || "/placeholder.svg"} alt="Generated" className="max-w-xl rounded-lg border" />
    }

    if (message.isError) {
      return <p className="text-red-600 dark:text-red-400">{content}</p>
    }

    const parts = content.split(/```([\s\S]*?)```/)
    return (
      <div className="space-y-2">
        {parts.map((part, i) => {
          if (i % 2 === 0) {
            // Regular text
            return (
              <div key={i} className="whitespace-pre-wrap">
                {part.split("\n").map((line, j) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h3 key={j} className="text-xl font-semibold mt-4 mb-2">
                        {line.slice(2)}
                      </h3>
                    )
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h4 key={j} className="text-lg font-medium mt-3 mb-1">
                        {line.slice(3)}
                      </h4>
                    )
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <li key={j} className="ml-4 my-1">
                        {line.slice(2)}
                      </li>
                    )
                  }
                  return <p key={j} className="leading-7">{line}</p>
                })}
              </div>
            )
          } else {
            // Code block
            const codeContent = part.trim()
            return (
              <div key={i} className="bg-muted rounded-xl p-4 relative group my-4">
                <pre className="text-sm overflow-x-auto">
                  <code>{codeContent}</code>
                </pre>
                <button
                  onClick={() => copyToClipboard(codeContent)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-background/80 hover:bg-background rounded-lg border"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )
          }
        })}
      </div>
    )
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-sm">{isUser ? "👤" : "🤖"}</span>
      </div>
      <div className="flex-1 space-y-2 pt-1">
        <div className="text-sm font-medium">{isUser ? "You" : "AI"}</div>
        <div className="text-[15px]">
          {renderContent(message.content)}
        </div>
      </div>
    </div>
  )
}
