# AI Chat Application - Complete Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Features](#features)
3. [Configuration](#configuration)
4. [Model Categories](#model-categories)
5. [API Usage](#api-usage)
6. [Tips & Tricks](#tips--tricks)
7. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- OpenRouter API key (free at [openrouter.ai](https://openrouter.ai))
- npm or pnpm package manager

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd ai-chat-app
   npm install
   ```

2. **Configure API Key**
   
   Edit `config/index.ts`:
   ```typescript
   export const CONFIG: AppConfig = {
     apiKeys: [
       "sk-or-v1-your-api-key-here",
     ],
     // ...
   }
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

---

## Features

### 🤖 Multiple Free AI Models

Access hundreds of **completely free** AI models from OpenRouter:
- Only models with $0 pricing (both prompt and completion)
- Automatic categorization by performance tier
- Real-time model information updates
- Vision-capable models included

### 💬 Chat Interface

**Clean, minimal design** inspired by ChatGPT:
- Side-by-side message layout (user on right, AI on left)
- Auto-resizing textarea input
- Keyboard shortcuts:
  - `Enter` - Send message
  - `Shift + Enter` - New line
- Real-time streaming responses
- Markdown formatting support
- Message history per session

### 🔍 Model Browser (`/models`)

Browse and search all available free models:
- **Search**: Filter by name, ID, or provider
- **Sort**: By name or context length
- **Details**: View full specifications
- **Context Windows**: See token limits (2K to 200K+)
- **Vision Support**: Identify image-capable models

### 📚 Documentation (`/docs`)

Complete guides and references:
- Quick start tutorials
- Feature explanations
- Configuration options
- Best practices
- Troubleshooting guides

### 🎨 Modern UI

- **Minimal Design**: Clean, distraction-free interface
- **Theme Toggle**: Dark and light modes
- **Responsive**: Works on desktop, tablet, and mobile
- **Logo**: Custom branding support
- **Smooth Transitions**: Polished interactions

---

## Configuration

### API Keys

**File**: `config/index.ts`

```typescript
export const CONFIG: AppConfig = {
  apiKeys: [
    "sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXX",
    // Add multiple keys for load balancing
    "sk-or-v1-YYYYYYYYYYYYYYYYYYYYYYY",
  ],
}
```

**Multiple Keys**: The app randomly selects from available keys for load balancing.

**Environment Variables** (Production):
```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

### Custom Models

Add your own model configurations:

```typescript
export const CONFIG: AppConfig = {
  customModels: [
    {
      id: "custom/my-model",
      name: "My Custom Model",
      provider: "Custom Provider",
      enabled: true,
    },
  ],
}
```

Custom models appear in the model selector alongside free models.

### Feature Flags

Enable or disable features:

```typescript
export const CONFIG: AppConfig = {
  features: {
    allowCustomModels: true,        // Show custom models
    imageGenerationEnabled: true,   // Enable image generation
  },
}
```

### Site Metadata

Customize site information:

```typescript
export const CONFIG: AppConfig = {
  site: {
    name: "AI Chat",
    title: "AI Chat - Powered by OpenRouter",
    description: "A simple and powerful AI chat application",
    author: "Your Name",
    version: "1.0.0",
    url: "http://localhost:3000",
    logo: "/icon.svg",
    favicon: "/favicon.ico",
  },
}
```

---

## Model Categories

Models are automatically categorized into 5 performance tiers:

### ⚡ Ultra - Cutting-Edge Flagship
**Best for**: Complex reasoning, research, production apps

**Characteristics**:
- Latest flagship models
- Highest capabilities
- Largest context windows
- Best performance

**Examples**:
- GPT-5, O3
- Claude Opus 4
- Gemini Ultra
- DeepSeek V3

**Free Models**: Limited, mostly experimental versions

---

### 🚀 Pro - High-Performance Production
**Best for**: Professional use, detailed work, coding

**Characteristics**:
- Production-ready quality
- Strong reasoning abilities
- Good context windows (32K-128K)
- Reliable performance

**Examples**:
- GPT-4o, GPT-4 Turbo
- Claude 3.7 Sonnet
- Gemini 1.5 Pro
- DeepSeek R1

**Free Models**: Many available with full capabilities

---

### ⚡ Fast - Quick & Efficient
**Best for**: Quick queries, rapid prototyping, high-volume

**Characteristics**:
- Lightning-fast responses
- Lower latency
- Good for simple tasks
- Efficient token usage

**Examples**:
- GPT-4o Mini, Flash variants
- Claude Haiku
- Gemini Flash
- Nano models

**Free Models**: Wide selection, great for most use cases

---

### 📊 Normal - Balanced General Purpose
**Best for**: General conversation, everyday tasks

**Characteristics**:
- Balanced speed and quality
- Good for most use cases
- Moderate context windows
- Reliable base models

**Examples**:
- GPT-3.5 variants
- Mid-tier open-source models
- Balanced commercial models

**Free Models**: Many options available

---

### 🐢 Slow - Older Models
**Best for**: Testing, experimentation, legacy support

**Characteristics**:
- Older generation models
- Still functional
- Smaller context windows
- Legacy compatibility

**Examples**:
- Early GPT-3 variants
- Older Claude versions
- First-gen open models

**Free Models**: Often available for educational use

---

## API Usage

### Chat Endpoint

**POST** `/api/chat`

Send messages to AI models:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'openai/gpt-4o-mini',
    message: 'Hello, AI!',
    messages: [
      { role: 'user', content: 'Previous message' },
      { role: 'assistant', content: 'Previous response' }
    ]
  })
})

const data = await response.json()
console.log(data.content) // AI response
```

**Parameters**:
- `model` (required): Model ID from model selector
- `message` (required): Current user message
- `messages` (optional): Conversation history

**Response**:
```json
{
  "content": "AI response text here...",
  "model": "openai/gpt-4o-mini",
  "usage": { "prompt_tokens": 10, "completion_tokens": 20 }
}
```

### Models Endpoint

**GET** `/api/models/free`

Fetch only free models with categorization:

```typescript
const response = await fetch('/api/models/free')
const data = await response.json()

console.log(data.models)              // All free models
console.log(data.categorizedModels)   // Organized by tier
console.log(data.customModels)        // Your custom models
console.log(data.total)               // Total count
```

**Response Structure**:
```json
{
  "models": [...],
  "categorizedModels": {
    "ultra": [...],
    "pro": [...],
    "fast": [...],
    "normal": [...],
    "slow": [...]
  },
  "customModels": [...],
  "total": 150
}
```

### Image Generation Endpoint

**POST** `/api/generate-image`

Generate images from text prompts:

```typescript
const response = await fetch('/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'black-forest-labs/flux-schnell',
    message: 'A serene mountain landscape'
  })
})

const data = await response.json()
console.log(data.content) // Image URL
```

---

## Tips & Tricks

### Getting Better Responses

1. **Be Specific**: Clear, detailed prompts get better results
   ```
   ❌ "Write code"
   ✅ "Write a Python function to sort a list of dictionaries by a specific key"
   ```

2. **Provide Context**: Include relevant background information
   ```
   "I'm building a Next.js app with TypeScript. How do I..."
   ```

3. **Use Formatting**: Structure your prompts with markdown
   ```
   **Task**: Analyze this code
   **Language**: JavaScript
   **Issue**: Performance problem
   ```

4. **Try Different Models**: 
   - Use **Fast** models for simple queries
   - Use **Pro** models for complex reasoning
   - Use **Ultra** models for cutting-edge capabilities

### Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - Add new line
- `Ctrl/Cmd + K` - Open model selector (coming soon)
- `Ctrl/Cmd + /` - Toggle theme

### Model Selection Strategy

**For Quick Questions**: Fast tier (GPT-4o Mini, Gemini Flash)
**For Code**: Pro tier (GPT-4o, Claude 3.7, DeepSeek R1)
**For Analysis**: Pro or Ultra tier
**For Creative Writing**: Pro tier (Claude models excel here)
**For Math/Logic**: Ultra tier (O3, DeepSeek R1)

### Context Window Tips

- **Small contexts (2K-8K)**: Good for short conversations
- **Medium contexts (16K-32K)**: Most general use cases
- **Large contexts (64K+)**: Document analysis, long conversations
- **Extra large (128K+)**: Entire codebases, books, research papers

### Vision Models

Models with vision support can:
- Analyze images
- Extract text from screenshots
- Describe visual content
- Answer questions about images

Look for the "Vision" badge in model details.

---

## Troubleshooting

### Common Issues

#### "Insufficient API Credits" (402 Error)

**Problem**: Your API key has run out of credits

**Solutions**:
1. Get a new free API key from OpenRouter
2. Add multiple API keys for load balancing
3. Check your OpenRouter dashboard for credit status

#### Models Not Loading

**Problem**: Model selector shows no models

**Solutions**:
1. Check your internet connection
2. Verify API key is configured correctly
3. Check browser console for errors
4. Try refreshing the page

#### Slow Responses

**Problem**: AI takes too long to respond

**Solutions**:
1. Switch to a "Fast" tier model
2. Keep prompts concise
3. Reduce conversation history length
4. Check your network connection

#### API Key Not Working

**Problem**: Authentication errors or 401 responses

**Solutions**:
1. Verify API key format starts with `sk-or-v1-`
2. Check for extra spaces or quotes in config
3. Ensure key is active on OpenRouter
4. Try generating a new key

#### Theme Not Switching

**Problem**: Dark/light mode doesn't change

**Solutions**:
1. Clear browser cache and local storage
2. Check browser console for errors
3. Refresh the page
4. Try a different browser

### Getting Help

1. **Check Documentation**: Review this guide thoroughly
2. **OpenRouter Docs**: Visit [openrouter.ai/docs](https://openrouter.ai/docs)
3. **Browser Console**: Check for JavaScript errors (F12)
4. **GitHub Issues**: Report bugs or request features
5. **Community**: Join OpenRouter Discord for support

### Reporting Issues

When reporting issues, include:
- Browser and version
- Error messages from console
- Steps to reproduce
- Model being used
- Expected vs actual behavior

---

## Advanced Configuration

### Environment Variables

For production deployments:

```bash
# .env.local
OPENROUTER_API_KEY=sk-or-v1-xxxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Custom Styling

Modify theme colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: 'your-color',
      // ...
    }
  }
}
```

### API Rate Limiting

Implement rate limiting in production:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Add rate limiting logic
}
```

---

## Performance Optimization

### Best Practices

1. **Use Fast Models**: For high-volume applications
2. **Implement Caching**: Cache common responses
3. **Limit History**: Send only relevant conversation context
4. **Stream Responses**: Use streaming for better UX
5. **Load Balance**: Use multiple API keys

### Production Deployment

1. **Environment Variables**: Never commit API keys
2. **CDN**: Use for static assets
3. **Compression**: Enable gzip/brotli
4. **Analytics**: Monitor usage and errors
5. **Caching**: Implement Redis or similar

---

## Security Best Practices

1. **Never Commit Keys**: Use `.gitignore` and environment variables
2. **Rotate Keys**: Regularly update API keys
3. **Rate Limiting**: Protect against abuse
4. **Input Validation**: Sanitize user inputs
5. **HTTPS Only**: Use secure connections in production

---

## FAQ

**Q: Are these models really free?**
A: Yes! The app filters to show only models with $0 pricing from OpenRouter.

**Q: How many messages can I send?**
A: Depends on your OpenRouter API key limits. Free tier has generous quotas.

**Q: Can I use my own models?**
A: Yes! Add custom models in `config/index.ts`.

**Q: Does this store my conversations?**
A: No, conversations are only stored in your browser session.

**Q: Can I deploy this commercially?**
A: Check the license. OpenRouter has its own terms of service.

**Q: How do I update the model list?**
A: The app fetches models from OpenRouter automatically on each load.

---

## Updates & Changelog

### Version 1.0.0
- ✅ Minimal UI design
- ✅ Free models only filtering
- ✅ 5-tier model categorization
- ✅ Dark/light theme
- ✅ Model browser page
- ✅ Documentation page
- ✅ Logo integration
- ✅ Responsive design

---

**Need more help?** Check the [README.md](../README.md) or visit [OpenRouter Documentation](https://openrouter.ai/docs)
