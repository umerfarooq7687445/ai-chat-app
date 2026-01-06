import { type NextRequest, NextResponse } from "next/server"
import { getRandomApiKey, getEnabledCustomModels } from "@/lib/developer-config"
import { categorizeModels } from "@/lib/model-categories"

const OPENROUTER_API = "https://openrouter.ai/api/v1"

export async function GET(request: NextRequest) {
  try {
    const apiKey = getRandomApiKey()

    if (!apiKey) {
      return NextResponse.json({ 
        error: "No API keys configured", 
        models: [],
        categorizedModels: { ultra: [], pro: [], fast: [], normal: [], slow: [] },
        customModels: [] 
      }, { status: 200 })
    }

    // Fetch all models from OpenRouter
    const response = await fetch(`${OPENROUTER_API}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      console.log("[API] Failed to fetch models from OpenRouter, returning custom models only")
      return NextResponse.json({
        models: [],
        categorizedModels: { ultra: [], pro: [], fast: [], normal: [], slow: [] },
        customModels: getEnabledCustomModels(),
      })
    }

    const data = await response.json()

    // Filter only truly free models (both prompt and completion must be $0)
    const freeModels = data.data
      .filter((model: any) => {
        const pricing = model.pricing
        return pricing && 
               pricing.prompt === "0" && 
               pricing.completion === "0"
      })
      .map((model: any) => ({
        id: model.id,
        name: model.name,
        provider: model.architecture?.modality?.includes("image") ? "vision" : "text",
        context_length: model.context_length || 8192,
        pricing: model.pricing,
      }))

    // Categorize models by performance tier
    const categorizedModels = categorizeModels(freeModels)
    const customModels = getEnabledCustomModels()

    return NextResponse.json({
      models: freeModels,
      categorizedModels,
      customModels,
      total: freeModels.length + customModels.length,
    })
  } catch (error) {
    console.log("[API] Error fetching models:", error)
    return NextResponse.json(
      {
        models: [],
        categorizedModels: { ultra: [], pro: [], fast: [], normal: [], slow: [] },
        customModels: getEnabledCustomModels(),
        error: error instanceof Error ? error.message : "Failed to fetch models",
      },
      { status: 200 },
    )
  }
}
