# RST Site — UI Kit (Liquid Glass)

Recreates the homepage of **Roc Séculaire Tabernacle** with the Liquid Glass design language.

## Files
- `index.html` — interactive home: floating glass nav, hero with quote card, three feature cards, Projet Néhémie split, week schedule, footer
- Uses tokens from `../../colors_and_type.css` and components from `../../components.css`

## Components covered
- Floating pill nav with brand + active state
- Hero with serif italic accent on key word
- Live pill, glass pill, primary blue CTA
- Glass feature cards with hover lift
- Modal-style "project" split block
- Week-of cards with time numerals

## Source mapping (RST repo)
- Original navigation and hero copy from `src/pages/Home` / `src/components/layout/Header`
- Néhémie quote from `src/data/genese/*` (Néhémie 4·6 is the project's recurring scriptural anchor)
- Schedule pattern from `src/data/rendez-vous.ts`
