"use client"

import Link from "next/link"
import { Sun, Moon, Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  selectedModelName?: string
  onModelClick?: () => void
  theme: string
  onThemeToggle: () => void
  imageMode?: boolean
  onImageModeToggle?: (value: boolean) => void
  hasImageModel?: boolean
  hideControls?: boolean
}

export default function Navigation({
  selectedModelName,
  onModelClick,
  theme,
  onThemeToggle,
  imageMode,
  onImageModeToggle,
  hasImageModel,
  hideControls = false,
}: NavigationProps) {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-7 h-7">
              <img 
                src="/icon.svg" 
                alt="Logo" 
                className="w-full h-full object-contain dark:invert"
              />
            </div>
            <span className="font-semibold text-lg">AI Chat</span>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {!hideControls && onModelClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onModelClick}
              className="text-sm font-medium"
            >
              {selectedModelName || "Select Model"}
            </Button>
          )}
          <Link href="/models">
            <Button variant="ghost" size="icon" title="Models">
              <Menu className="w-4 h-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onThemeToggle} 
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </nav>
  )
}
