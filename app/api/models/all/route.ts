import { NextResponse } from "next/server"
import { getRandomApiKey } from "@/lib/developer-config"

export async function GET() {
  try {
    const apiKey = getRandomApiKey()
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key configured" },
        { status: 500 }
      )
    }

    // Fetch all models from OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`)
    }

    const data = await response.json()
    
    // Filter only free models
    const freeModels = data.data?.filter((model: any) => {
      return model.pricing?.prompt === "0" && model.pricing?.completion === "0"
    }) || []

    return NextResponse.json({
      models: freeModels,
      total: freeModels.length,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Error fetching models:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch models" },
      { status: 500 }
    )
  }
}
