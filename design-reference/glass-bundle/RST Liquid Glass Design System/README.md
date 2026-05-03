# RST Liquid Glass — Design System

Design system for **Roc Séculaire Tabernacle** (RST) — assemblée chrétienne basée à Vitry-sur-Seine. The aesthetic adopts **iOS 26 / macOS Tahoe Liquid Glass**: a neutral, translucent foundation with stackable glass surfaces, generous radii, multi-layer depth shadows, and Apple-flavored micro-motion. The historic RST identity colors (red `#C8332A`, blue `#1E47A1`, pipetted from the logo) are preserved as **accent only** — the dominant visual layer is neutral and translucent.

## Index

| File | Purpose |
|---|---|
| `colors_and_type.css` | All color, glass, shadow, radius, spacing, motion, and typography tokens + semantic type classes |
| `components.css` | Button, Card, Input, Modal, Navigation, Pill |
| `assets/` | Logo, favicon, photo asset |
| `preview/` | Per-concept design-system cards (Type · Colors · Spacing · Components · Brand) |
| `ui_kits/rst-site/` | Liquid-glass recreation of the RST homepage |
| `SKILL.md` | Cross-compatible Agent Skill manifest |

## Sources

- **Codebase** — [Sunnoogo77/RST](https://github.com/Sunnoogo77/RST) (React 18 + Vite + TypeScript + CSS Modules). Read: `README.md`, `src/styles/tokens.css`, `src/styles/global.css`, `src/components/layout/Header/*`, `src/components/ui/Button/*`. Note: original system uses Cormorant Garamond / Cinzel / Bodoni Moda / Inter on a navy-hero editorial layout. We **kept Cormorant + Cinzel** as accent type for editorial italic phrases (e.g., "*Adorer et Édifier*") to honor the church's existing voice; everything else moved to SF Pro Display / Text.
- **References uploaded by user** — apple.com/fr screenshots showcasing the Liquid Glass language (floating pill nav, blue/red glass CTAs over imagery, multi-layer cards), plus screenshots of the live RST site (navy hero with "Roc Séculaire Tabernacle" wordmark, quote card on Projet Néhémie page).
- **Logo** — `assets/rst-logo.png` (oval mark, half red / half blue, "RST" in white).

## Brand context

- **Name:** Roc Séculaire Tabernacle (RST)
- **Type:** Christian assembly, Branham-tradition, FR/EN bilingual
- **Location:** Vitry-sur-Seine, Île-de-France
- **Site sections:** Accueil, Projet Néhémie (lieu de culte permanent), Genèse (history), L'Église (this week, hymns, announcements, testimonies)
- **Recurring scriptural anchor:** Néhémie 4·6 — *« Le peuple se montra courageux dans le travail. »*

---

## Content fundamentals

- **Language:** French primary, English secondary. Single-language phrasing is reverent but not stiff.
- **Tone:** Warm, contemplative, communal. "Nous", "ensemble", "notre assemblée" — collective voice over individual addressing. Direct address ("vous") only in CTAs and hospitality copy ("Rejoignez-nous", "Découvrez").
- **Casing:** Sentence case for buttons and headings ("En savoir plus", "Découvrir l'église"). UPPERCASE reserved for the engraved wordmark "ROC SÉCULAIRE TABERNACLE" and small eyebrow labels (e.g., "ASSEMBLÉE CHRÉTIENNE").
- **Vibe:** Editorial restraint with a hint of stone-engraved gravity. Sober, never breathless. Imagery of sanctuary, scripture, gathered people.
- **Punctuation:** French-style middle dot for separating meta (`Vitry-sur-Seine · Île-de-France`), numerical references with NBSP (`Néhémie 4·6`).
- **Emoji:** **Never.** Decorative glyphs (✶ ✦ ♰) used sparingly for iconography placeholders; replace with real iconography in production.
- **Copy examples:**
  - Hero: *"Une assemblée fondée sur le **Roc**."*
  - Project: *"Un lieu pour **adorer et édifier**."* (key noun-phrase italic, in serif, in RST blue)
  - Live pill: *"Live"* (always lowercase except first letter)
  - Schedule: *"Culte du dimanche · live"*

---

## Visual foundations

### Colors
- **Brand reds and blues are accents only.** Reach for them on: primary CTA (blue), live pill (red), italic accent words in serif headlines, focus rings (blue), eyebrow color on Projet Néhémie (red).
- **Dominant surface:** bluish off-white `#F5F7FB` canvas with translucent white glass `rgba(255,255,255, 0.45 / 0.62 / 0.78)` panels stacked on top. Page-level gradient washes (radial, very low opacity blue/red) supply atmosphere without coloring the glass itself.
- **Ink scale:** 5-step neutral cool ramp `#0B0F19 → #B8BDCC`. No pure-black text.

### Typography
- **Display + Text:** SF Pro Display / SF Pro Text (Apple system) → Inter fallback (Google Fonts). Used for nav, body, CTAs, all UI chrome.
- **Editorial accent:** Cormorant Garamond italic, **kept** from original RST identity. Used inside SF display headlines for one or two key words ("le **Roc**", "**adorer et édifier**"). Always italic, always slightly colored (blue or red).
- **Engrave:** Cinzel — only for the "ROC SÉCULAIRE TABERNACLE" wordmark and rare eyebrow labels.
- **No Bodoni numerals** — SF Pro covers numbers cleanly enough for the calmer Liquid Glass aesthetic.

### Glass surfaces
- **Backdrop filter recipe:** `blur(40px) saturate(180%)` on default surfaces; `blur(60px) saturate(200%)` on hero/modal; `blur(20px) saturate(160%)` on small chrome (pills, buttons).
- **Fill:** `rgba(255,255,255, 0.62)` regular · `0.78` thick (cards) · `0.45` thin (over imagery) · `0.92` for modals where readability is paramount.
- **Borders:** `1px solid rgba(255,255,255,0.5)` baseline. For "premium" surfaces, layer a gradient border via `::before` (white at top → near-transparent at bottom, simulating a top-light reflection on glass).
- **Inset highlight:** every glass element gets `inset 0 1px 0 rgba(255,255,255,0.6)` to reinforce the top edge.

### Shadows (multi-layer)
Default card: `0 1px · 0 4px · 0 16px` stacked at 3–8% black, plus the inset-1px white highlight. Modal: adds `0 24px 48px / 0 48px 96px` for true levitation. Hover state lifts the middle layers more, never increases the top one.

### Radii
- 8 px (xs), 12 px (sm — buttons), 16 px (md — default cards), 20 px (lg — hero cards), 28 px (xl — modals), 999 px (pill — nav, CTAs, status). Generous. iOS-flavored.

### Motion
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` everywhere; spring `cubic-bezier(0.34, 1.56, 0.64, 1)` reserved for delight moments.
- **Durations:** 180 ms fast (hover color), 320 ms base (transform/shadow), 520 ms slow (modal entry).
- **Hover:** `scale(1.02)` lift + shadow gains a deeper bottom layer. Never gain border weight or change colors abruptly.
- **Press:** `scale(0.97)` shrink, 120 ms duration.
- **No bounces, no rubber-band, no parallax.** The system stays calm — fitting a place of worship.

### Layout & backgrounds
- Page background: ambient radial gradients (top-left blue, bottom-right red, both ≤ 14% opacity) on the bluish off-white canvas. The gradients give the glass something to refract.
- Imagery (sanctuary photos, scripture art) lives **behind** glass — never in front.
- Full-bleed imagery only for hero/feature blocks. Default sections are airy with whitespace.

### Transparency rules
- Use glass when stacking; use solid white when content density is high (long forms, dense tables).
- Never stack glass on glass without a clear hierarchy of opacity (e.g., a thick glass card holding a regular glass quote inside is fine).

### Imagery vibe
- Warm-leaning sanctuary photography (wood, stage lighting), soft scripture-art portraits. Cool blue washes for live/streaming contexts. Never hyper-saturated; always feels composed.

---

## Iconography

The original RST codebase **does not ship an icon font or an SVG icon set** — it relies on glyph characters (`×`, `|`, `·`) and the brand mark. For this Liquid Glass system we recommend:

- **Production:** load **SF Symbols** if served from an Apple platform; otherwise use **Lucide** via CDN (`https://unpkg.com/lucide-static@latest/icons/`). Lucide's stroke style matches the calm, neutral feel of Liquid Glass best. **This is a substitution — flag for confirmation.**
- **Decorative (current):** unicode glyphs `✶ ✦ ♰` in feature-card placeholders. Replace with Lucide line icons (`book-open`, `calendar`, `headphones`) before launch.
- **Logo:** `assets/rst-logo.png` (oval). On dark backgrounds apply `filter: brightness(1.42) contrast(1.08)` per the original CSS.
- **Emoji:** never used.

---

## Notes & substitutions

- **Fonts:** SF Pro Display/Text is requested by spec but is Apple-licensed; we declared it first in the stack and **fall back to Inter** (Google Fonts) which has nearly identical metrics. If you want pixel-perfect SF Pro, supply the licensed `.woff2` files and we'll add `@font-face` declarations.
- **Cormorant + Cinzel** are kept from the existing identity. If you want a fully secular Liquid Glass system, drop them and use SF Pro for everything — the tokens are isolated.
- **Iconography** is currently glyph placeholders; awaiting your call on Lucide vs. SF Symbols vs. a custom set.

---

## Components shipped

| Component | File | States |
|---|---|---|
| Button | `components.css` `.btn` | primary · glass · ghost · live · pill · sm · lg · icon |
| Pill | `.pill` | live · blue · neutral · tab |
| Card | `.card` | default · interactive (hover lift) · solid |
| Input | `.input` + `.field` | default · search · focus · error |
| Navigation | `.nav` | floating glass pill nav with active link |
| Modal | `.modal-scrim` + `.modal` | default with title/body/actions |
