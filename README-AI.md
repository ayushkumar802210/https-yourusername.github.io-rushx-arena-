# Ask RushXArena ⚡

This project includes a production-style AI assistant layer that is integrated into the existing RushXArena front-end without introducing a separate app.

## What is included

- A secure client-side assistant shell that opens from the dashboard
- Deterministic fallback reasoning when no provider is configured
- User-local conversation history storage
- Electrical and energy answer patterns for bills, appliances, EV, solar, and concepts
- Clear assumptions and safety language

## Required environment variables for a real AI provider

Set these server-side only, never in browser code:

```bash
AI_PROVIDER=openai
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-4o-mini
AI_RATE_LIMIT_PER_MINUTE=20
AI_MAX_INPUT_LENGTH=2000
AI_MAX_OUTPUT_TOKENS=800
```

The current static front-end does not provide a server-side API, so this repository uses a deterministic fallback by default until a backend endpoint is added.

## Important

- AI API keys must never reach the browser
- Users only access their own data through authenticated identity checks
- Calculations are always labeled as estimates unless backend-validated meter data is provided
