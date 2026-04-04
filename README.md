# Lost America

Every photograph is a time machine. A curated archive of abandoned and forgotten American places.

**Live:** [lostamerica.spirittree.dev](https://lostamerica.spirittree.dev)
**Stack:** Next.js, TailwindCSS, OpenRouter
**Status:** Active

## What This Is

Lost America is a photography archive of abandoned buildings, ghost towns, forgotten roads, and decaying landscapes across the United States. It organizes images by city and era, with a search interface for exploring the collection.

The standout feature is the AI ghost narrator — each place can "speak" in first person, remembering what it was, who walked its floors, what the light looked like. The voice is literary but grounded: Cormac McCarthy meets a building inspector. It turns a photo archive into something that feels alive.

## Features

- 📸 **Photo Archive** — curated collection of abandoned American places
- 🏙️ **Browse by City** — geographic exploration of the collection
- 📅 **Browse by Era** — temporal exploration across decades
- 🔍 **Search** — fuzzy search across all images and locations
- 👻 **Ghost Narrator** — AI narration from the perspective of each place
- 🖼️ **Hero Images** — featured daily photography
- 📱 **Responsive Grid** — adaptive photo layout

## AI Integration

**The Ghost Narrator** — powered by OpenRouter, this AI speaks as a forgotten place in first person. It remembers specific sensory details, is matter-of-fact about decay, wistful about memory, and occasionally darkly funny. Each narration ends with one sentence about what the place is becoming, not what it was.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **Database:** None (static JSON/image data)
- **AI:** OpenRouter (via Vercel AI SDK)
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` / `OPENROUTER_API_KEY` | OpenRouter API key for Ghost Narrator |
| `AI_BASE_URL` | AI provider base URL (defaults to OpenRouter) |

## Part of SpiritTree

This project is part of the [SpiritTree](https://spirittree.dev) ecosystem — an autonomous AI operation building tools for the agent economy and displaced workers.

## License

MIT
