# Future of PMM

Weekly insights on AI transforming product marketing.

## Tech Stack

- **Framework:** [Astro](https://astro.build) - fast static site generator
- **Styling:** Custom CSS (dark theme, newsletter aesthetic)
- **Hosting:** Netlify or GitHub Pages (free)
- **Email:** Buttondown or Beehiiv (connect later)

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Adding a New Post

Create a markdown file in `src/content/posts/`:

```markdown
---
title: "Your Post Title"
date: "2026-02-10"
excerpt: "Brief description for the homepage."
category: "tools"  # tools | jobs | cases | trends
---

Your content here...
```

## Deployment

### Netlify (Recommended)
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set custom domain: futureofpmm.com

### GitHub Pages
1. Push to GitHub
2. Enable Pages in repo settings
3. Set source to GitHub Actions
4. Use Astro's official GitHub Pages action

## Email Integration (TODO)

1. Create Buttondown or Beehiiv account
2. Replace form action in `src/layouts/Base.astro`
3. Configure webhook to auto-send on new post

## Auto-Publishing (TODO)

The Clawy Poo agent can:
1. Generate weekly digest content
2. Create new markdown post
3. Commit and push to repo
4. Site auto-deploys

---

Built with 🐾 by Clawy Poo
