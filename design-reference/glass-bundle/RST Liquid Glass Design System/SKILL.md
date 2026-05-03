---
name: rst-design
description: Use this skill to generate well-branded interfaces and assets for Roc Séculaire Tabernacle (RST), either for production or throwaway prototypes/mocks. Built around the iOS 26 / macOS Tahoe Liquid Glass language — neutral translucent surfaces, generous radii, soft multi-layer shadows — with the historic RST red (#C8332A) and blue (#1E47A1) reserved as accents.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files that link `colors_and_type.css` and `components.css`. Use `ui_kits/rst-site/index.html` as the canonical reference for how the language reads on a real RST page.

If working on production code, copy the tokens from `colors_and_type.css` into your codebase variables, and read the rules in `README.md` to become an expert in designing with this brand.

Key constraints to honor:
- Brand red/blue are **accents only** — neutral translucent surfaces dominate.
- Glass recipe = `rgba(255,255,255, 0.62)` fill + `backdrop-filter: blur(40px) saturate(180%)` + 1 px white-translucent border + multi-layer soft shadow + `inset 0 1px 0 rgba(255,255,255,0.6)` highlight.
- Motion is calm: 320 ms cubic-bezier(0.4, 0, 0.2, 1), `scale(1.02)` hover, never bouncy.
- French copy, sentence case, no emoji, italic-serif accent on one keyword inside SF Pro headlines.

If the user invokes this skill without further guidance, ask them what they want to build, ask a few clarifying questions (audience, surface — site/slide/prototype, French or bilingual, brand intensity), and act as an expert designer who outputs HTML artifacts or production code.
