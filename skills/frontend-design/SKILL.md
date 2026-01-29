---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Before You Code

**Understand the context**:
- Purpose: What problem does this solve? Who uses it?
- Tone: Pick a clear direction (see Personality below)
- Constraints: Framework, performance, accessibility requirements
- Differentiation: What's the ONE thing someone will remember?

**Commit to a direction**. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

## Anti-Patterns to Avoid

NEVER use generic AI-generated aesthetics:
- Overused fonts: Inter, Roboto, Arial, Space Grotesk
- Cliched colors: purple gradients on white
- Predictable layouts and patterns
- Cookie-cutter design lacking context-specific character

Every design should be DIFFERENT. Vary themes, fonts, aesthetics. Don't converge on common choices across generations.

## Design System Foundations

### Typography
- **Type scale**: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72px (hand-crafted, not ratios)
- **Body**: 16-17px, line-height 1.5-1.6
- **Headers**: line-height 1.0-1.3, tighter letter-spacing
- **Weights**: 400-500 body, 600-700 emphasis. Never under 400
- **Line length**: 45-75 characters optimal
- Choose fonts with 4-5 weights. Serif=elegant, rounded=playful, neutral=relies on other elements

### Color
- Use HSL for human-readable color manipulation
- Build complete palette: 8-10 greys, 5-10 shades per primary/accent
- Increase saturation as lightness moves from 50%
- Avoid true grey (0% saturation) and pure black (#000000)
- WCAG contrast: 4.5:1 normal text, 3:1 large
- Gradients: max 30 degree hue shift between colors

### Spacing
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- Start with TOO MUCH white space, remove until happy
- More space around groups than within them
- Desktop margins: 160-180px. Mobile margins: 20-24px

### Shadows & Depth
- Light comes from above (lighter top edge, shadow below)
- Soft shadows: blur 30-60px, opacity 5-10%, Y offset 20-40px
- 5-level elevation system: sm (buttons) to 2xl (modals)
- Two-part shadows for realism: large soft + small tight
- Interactive: increase on lift/drag, decrease on press

### Components
- Button hierarchy: CTA > Primary > Secondary > Tertiary
- Button height 40-60px, horizontal padding 32px
- Minimum tap target: 44x44px
- Form inputs: match width to expected input length
- Cards: only info needed to make a decision
- Nav: max 5-7 visible items, de-emphasize inactive

## Personality Spectrum

| Trait | Playful | Neutral | Formal |
|-------|---------|---------|--------|
| Colors | Saturated | Balanced | Muted |
| Typography | Rounded Sans | Clean Sans | Serif |
| Corners | 20px+ radius | 8-12px | 0-4px |
| Icons | Rounded | Mixed | Sharp |
| Language | Friendly | Clear | Professional |
| Imagery | Illustrations | Either | Real photos |

**Stay consistent** - don't mix personality traits (e.g., playful illustrations + Serif fonts).

## Finishing Touches

- **Accent borders**: top of cards, active nav items, side of alerts
- **Backgrounds**: section color changes, subtle gradients (<30 degree hue diff), geometric decorations
- **Supercharge defaults**: icons for bullets, oversized quotation marks, custom link underlines
- **Fewer borders**: try shadows, background colors, or spacing first

## Motion & Animation

- Focus on high-impact moments: page load with staggered reveals > scattered micro-interactions
- Animation duration: <1000ms
- Ease-in-out for natural feel
- Interactive feedback: hover states, press states, loading indicators

## Visual Hierarchy

- **Not all elements are equal** - deliberately de-emphasize secondary content
- **Three-level color hierarchy**: dark (primary), grey (secondary), light grey (tertiary)
- **Emphasize by de-emphasizing** - soften competing elements instead of making primary louder
- **Labels**: often unnecessary. "12 left in stock" not "In stock: 12"
- **Icons feel heavy** - reduce contrast to balance with text

## Implementation Notes

Match complexity to vision:
- **Maximalist**: elaborate code, extensive animations, layered effects
- **Minimalist**: restraint, precision, careful attention to spacing and subtle details

NEVER use generic AI-generated aesthetics. Interpret creatively. Make unexpected choices that feel genuinely designed for the context.

---

## Loading Files

**Consider loading these reference files based on your task:**

- [ ] [typography.md](references/typography.md) - if working with fonts, scales, or text hierarchy
- [ ] [color.md](references/color.md) - if designing color palettes or checking contrast
- [ ] [spacing.md](references/spacing.md) - if defining layout grids or margins
- [ ] [shadows-depth.md](references/shadows-depth.md) - if adding elevation or depth effects
- [ ] [components.md](references/components.md) - if building buttons, forms, cards, or nav

**DO NOT load all files at once.** Load only what's relevant to your current task.
