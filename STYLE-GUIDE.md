# Future of PMM Style Guide

Reference for maintaining consistent styling across all pages.

---

## Required Scripts (in `<head>`)

```html
<script src="/assets/js/auth-guard.js"></script>
<script src="/assets/js/user-menu.js" defer></script>
```

Plus Google Analytics:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LL6G27YPXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-LL6G27YPXX');
</script>
```

---

## Header HTML Structure

```html
<header>
    <div class="header-inner">
        <a href="/" class="logo"><img src="/assets/images/logo.svg" alt="The Future of PMM"></a>
        <nav id="main-nav">
            <a href="/">Home</a>
            <div class="nav-dropdown">
                <button class="nav-trigger">Learn</button>
                <div class="nav-menu">
                    <a href="/curriculum/">📚 Curriculum</a>
                    <a href="/blog.html">📝 Articles</a>
                    <a href="/where-do-you-sit-article.html">🧠 Assessments</a>
                </div>
            </div>
            <div class="nav-dropdown">
                <button class="nav-trigger">Resources</button>
                <div class="nav-menu">
                    <a href="/digests/">📰 Daily Digest</a>
                    <a href="/competitive-intel.html">🎯 Competitive Intel</a>
                    <a href="/ai-tools.html">🛠️ AI Tools Guide</a>
                </div>
            </div>
            <a href="/newsletters.html">Newsletter</a>
        </nav>
        <button class="hamburger" id="hamburger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </div>
</header>
```

---

## Header CSS

```css
/* Header */
header {
    background: #fff;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.logo img {
    height: 135px;
    width: auto;
}

/* Nav - use plain "nav" selectors, NOT "header nav" */
nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

nav > a, .nav-dropdown > .nav-trigger {
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #6b7280;
    font-size: 0.9rem;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s;
}

nav > a:hover, .nav-dropdown:hover > .nav-trigger {
    color: var(--pmm-blue);
    background: #f3f4f6;
}

.nav-dropdown { position: relative; }

.nav-trigger {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
}

.nav-trigger::after {
    content: '';
    border: solid #9ca3af;
    border-width: 0 1.5px 1.5px 0;
    padding: 2.5px;
    transform: rotate(45deg);
    margin-top: -2px;
    transition: transform 0.2s;
}

.nav-dropdown:hover .nav-trigger::after {
    transform: rotate(-135deg);
    margin-top: 2px;
}

.nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    min-width: 200px;
    padding: 0.5rem 0;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.2s;
    z-index: 1000;
}

.nav-dropdown:hover .nav-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.nav-menu a {
    display: block;
    padding: 0.6rem 1rem;
    color: #374151;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.15s;
}

.nav-menu a:hover {
    background: #f3f4f6;
    color: var(--pmm-blue);
}

/* Hamburger */
.hamburger {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 28px;
    height: 24px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
}

.hamburger span {
    width: 100%;
    height: 3px;
    background: var(--pmm-dark);
    border-radius: 2px;
    transition: all 0.3s ease;
}

/* Mobile */
@media (max-width: 900px) {
    .hamburger { display: flex; }
    .logo img { height: 70px; }
    nav { display: none; }
}
```

---

## Color Variables

```css
:root {
    --pmm-blue: #3b82f6;
    --pmm-dark: #1e3a5f;
    --pmm-light: #f5f6f7;
}
```

For article pages using Newsreader font:
```css
:root {
    --ink: #1a1a2e;
    --paper: #fefefe;
    --accent: #6366f1;
    --accent-light: #e0e7ff;
    --muted: #64748b;
    --border: #e2e8f0;
}
```

---

## Typography

**Primary font (UI):** Inter
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Article body font:** Newsreader
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
```

---

## Common Components

### CTA Box (purple gradient)
```html
<div class="cta-box">
    <h3>Title Here</h3>
    <p>Description text.</p>
    <a href="mailto:christopher.ohara@sap.com">Button Text →</a>
</div>
```

### Problem Box (red)
```html
<div class="problem-box">
    <h4>🔴 Title</h4>
    <ul>
        <li>Item</li>
    </ul>
</div>
```

### Solution Box (green)
```html
<div class="solution-box">
    <h4>✅ Title</h4>
    <ul>
        <li>Item</li>
    </ul>
</div>
```

### Warning Box (yellow)
```html
<div class="warning-box">
    <h4>⚠️ Title</h4>
    <ul>
        <li>Item</li>
    </ul>
</div>
```

---

## Footer

```html
<div class="footer">
    <p><a href="/">← Back to Future of PMM</a></p>
    <p style="margin-top: 1rem;">© 2026 Future of PMM. All rights reserved.</p>
</div>
```

---

## Contact Email

Use `christopher.ohara@sap.com` for all contact/submission links.

---

## Important Notes

1. **Nav selectors**: Use plain `nav` NOT `header nav` — the user-menu.js script expects plain nav selectors
2. **Logo height**: 135px desktop, 70px mobile
3. **Max width**: 1200px for containers
4. **Always include**: auth-guard.js and user-menu.js scripts
5. **Meta robots**: Include `<meta name="robots" content="noindex, nofollow">` for internal pages
