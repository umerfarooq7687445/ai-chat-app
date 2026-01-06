"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import ChatArea from "@/components/chat-area"
import ThemeProvider from "@/components/theme-provider"
import ModelSelector from "@/components/model-selector"
import { API_CONFIG } from "@/lib/api-config"
import { hasConfiguredApiKeys, getDefaultApiKey, DEVELOPER_CONFIG } from "@/lib/developer-config"
import type { ModelCategory, CategorizedModel } from "@/lib/model-categories"

interface Message {
  role: string
  content: string
  isImage?: boolean
  isError?: boolean
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [categorizedModels, setCategorizedModels] = useState<Record<ModelCategory, CategorizedModel[]>>({
    ultra: [],
    pro: [],
    fast: [],
    normal: [],
    slow: [],
  })
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedModelName, setSelectedModelName] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [apiKeySet, setApiKeySet] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageMode, setImageMode] = useState(false)
  const [theme, setTheme] = useState("light")
  const [hasImageModel, setHasImageModel] = useState(false)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    if (hasConfiguredApiKeys()) {
      const defaultKey = getDefaultApiKey()
      if (defaultKey) {
        setApiKey(defaultKey)
        setApiKeySet(true)
        fetchModels()
      }
    } else {
      const savedKey = localStorage.getItem(API_CONFIG.STORAGE_KEYS.API_KEY)
      if (savedKey && DEVELOPER_CONFIG.features.allowUserApiKeys) {
        setApiKey(savedKey)
        setApiKeySet(true)
        fetchModels()
      }
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem(API_CONFIG.STORAGE_KEYS.THEME) || "light"
    setTheme(savedTheme)
    document.documentElement.classList.toggle("dark", savedTheme === "dark")
  }, [])

  const handleSetApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.API_KEY, key)
    setApiKeySet(true)
    fetchModels()
  }

  const fetchModels = async () => {
    try {
      const response = await fetch("/api/models/free")
      const data = await response.json()

      if (data.categorizedModels) {
        setCategorizedModels(data.categorizedModels)

        // Find first available model
        const categories: ModelCategory[] = ["ultra", "pro", "fast", "normal", "slow"]
        for (const category of categories) {
          const models = data.categorizedModels[category]
          if (models && models.length > 0) {
            setSelectedModel(models[0].id)
            setSelectedModelName(models[0].name)
            break
          }
        }

        const hasImage = data.models?.some((m: any) => m.provider === "vision")
        setHasImageModel(hasImage && DEVELOPER_CONFIG.features.imageGenerationEnabled)
      }
    } catch (error) {
      console.error("Failed to fetch models:", error)
    }
  }

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !apiKeySet || !selectedModel) return

    const newMessage: Message = { role: "user", content: userMessage }
    setMessages((prev) => [...prev, newMessage])
    setLoading(true)

    try {
      const endpoint = imageMode ? API_CONFIG.ENDPOINTS.IMAGE : API_CONFIG.ENDPOINTS.CHAT
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          model: selectedModel,
          message: userMessage,
          messages: imageMode ? [] : messages.concat(newMessage),
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      const aiMessage: Message = {
        role: "assistant",
        content: data.content,
        isImage: imageMode,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error: any) {
      console.error("Error:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: `Error: ${error.message}`,
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
    // Find model name
    const categories: ModelCategory[] = ["ultra", "pro", "fast", "normal", "slow"]
    for (const category of categories) {
      const model = categorizedModels[category]?.find((m) => m.id === modelId)
      if (model) {
        setSelectedModelName(model.name)
        break
      }
    }
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem(API_CONFIG.STORAGE_KEYS.THEME, newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }



  if (!apiKeySet && !DEVELOPER_CONFIG.features.allowUserApiKeys) {
    return (
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 border-border/50 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">AI Chat</h1>
              <p className="text-muted-foreground">Powered by OpenRouter</p>
            </div>
            <p className="text-muted-foreground mb-6 text-center">
              No API keys configured. Please configure API keys in the developer settings.
            </p>
            <a href="/docs" className="w-full">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                View Documentation
              </Button>
            </a>
          </Card>
        </div>
      </ThemeProvider>
    )
  }

  if (!apiKeySet && DEVELOPER_CONFIG.features.allowUserApiKeys) {
    return (
      <ThemeProvider theme={theme}>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 border-border/50 shadow-xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">AI Chat</h1>
              <p className="text-muted-foreground">Powered by OpenRouter</p>
            </div>
            <p className="text-muted-foreground mb-6 text-center">
              Enter your OpenRouter API key to get started. Get one for free at{" "}
              <a
                href="https://openrouter.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 hover:text-cyan-400 underline"
              >
                openrouter.ai
              </a>
            </p>
            <input
              type="password"
              placeholder="sk-or-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 border border-input bg-background rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Button onClick={() => handleSetApiKey(apiKey)} disabled={!apiKey.trim()} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Connect
            </Button>
          </Card>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      {showModelSelector && (
        <ModelSelector
          categorizedModels={categorizedModels}
          selectedModel={selectedModel}
          onSelectModel={handleModelChange}
          onClose={() => setShowModelSelector(false)}
        />
      )}
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation
          selectedModelName={selectedModelName}
          onModelClick={() => setShowModelSelector(true)}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          imageMode={imageMode}
          onImageModeToggle={setImageMode}
          hasImageModel={hasImageModel}
        />
        <ChatArea messages={messages} onSendMessage={handleSendMessage} loading={loading} imageMode={imageMode} />
      </div>
    </ThemeProvider>
  )
}
