/**
 * Unified Configuration for AI Chat Application
 * Contains site settings, SEO, authentication, and API configuration
 */

export interface SiteConfig {
  name: string
  title: string
  description: string
  author: string
  version: string
  url: string
  logo?: string
  favicon?: string
  ogImage?: string
}

export interface ConfiguredModel {
  id: string
  name: string
  provider: string
  enabled: boolean
}

export interface AppConfig {
  site: SiteConfig
  apiKeys: string[]
  customModels: ConfiguredModel[]
  features: {
    allowUserApiKeys: boolean
    allowCustomModels: boolean
    imageGenerationEnabled: boolean
  }
}

// Main Application Configuration
export const CONFIG: AppConfig = {
  // Site SEO and Metadata
  site: {
    name: "AI Chat",
    title: "AI Chat - Powered by OpenRouter",
    description: "A simple and powerful AI chat application with support for multiple models and providers",
    author: "Your Name",
    version: "1.0.0",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    logo: "/logo.svg",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
  },
  // API Keys - Add your keys here or via environment variables
  apiKeys: [
    "sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXX", // OpenRouter API Key
    // "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Another API Key
    // Add more keys as needed
  ].filter(Boolean),

  // Custom Models
  customModels: [
    // Example custom model:
    // {
    //   id: "custom-gpt-4",
    //   name: "GPT-4 Custom",
    //   provider: "openai",
    //   enabled: true,
    // },
  ],

  // Feature Flags
  features: {
    allowUserApiKeys: false, // Allow users to add their own API keys
    allowCustomModels: true, // Show custom model management in admin panel
    imageGenerationEnabled: true, // Enable image generation feature
  },
}

// Utility Functions

/**
 * Get enabled API keys
 */
export function getEnabledApiKeys(): string[] {
  return CONFIG.apiKeys.filter((k) => k && k.length > 0)
}

/**
 * Get all API keys
 */
export function getAllApiKeys(): string[] {
  return CONFIG.apiKeys
}

/**
 * Get enabled custom models
 */
export function getEnabledCustomModels(): ConfiguredModel[] {
  return CONFIG.customModels.filter((m) => m.enabled)
}

/**
 * Check if API keys are configured
 */
export function hasConfiguredApiKeys(): boolean {
  return getEnabledApiKeys().length > 0
}

/**
 * Get first available enabled API key
 */
export function getDefaultApiKey(): string | null {
  const enabled = getEnabledApiKeys()
  return enabled.length > 0 ? enabled[0] : null
}

/**
 * Get random enabled API key for load balancing
 */
export function getRandomApiKey(): string | null {
  const enabled = getEnabledApiKeys()
  if (enabled.length === 0) return null
  return enabled[Math.floor(Math.random() * enabled.length)]
}
