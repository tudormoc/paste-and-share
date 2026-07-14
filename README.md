# Paste.it - Share Code & Text with Expiring Links

A modern, beautiful paste-sharing app built with React + Cloudflare Pages + KV storage.

## Features
- 🚀 Create shareable links instantly
- ⏰ Auto-expiring pastes (1h, 24h, 7d, 30d)
- 🎨 Syntax highlighting
- 🌍 Global edge deployment
- 💯 100% free to host

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Cloudflare Pages Functions (serverless)
- **Storage**: Cloudflare KV (key-value store)
- **Deployment**: Cloudflare Pages

## Quick Start

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

```bash
# Install dependencies
npm install

# Login to Cloudflare
npx wrangler login

# Create KV namespace and update wrangler.toml
npx wrangler kv:namespace create PASTES

# Run locally
npm run pages:dev

# Deploy
npm run pages:deploy
```

## License
Apache-2.0
