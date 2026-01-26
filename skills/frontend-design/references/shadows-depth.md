# Shadows & Depth Reference

## Light Source Principle
- **Light comes from above** - fundamental rule
- **Raised elements**: lighter top edge, shadow below
- **Inset elements**: darker top edge, lighter bottom

## Shadow Anatomy
- **X offset**: horizontal shift (usually 0)
- **Y offset**: vertical shift (positive = down)
- **Blur**: softness (higher = softer edges)
- **Opacity**: transparency (lower = subtler)

## Modern Soft Shadows
- High blur (30-60px)
- Low opacity (5-10%)
- Positive Y value
- Example: `0 30px 50px rgba(0,0,0,0.1)`

**Specific examples**:
- Small tight: `X=0, Y=4, Blur=4, Opacity=25%`
- Medium elevated: `X=0, Y=30, Blur=15, Opacity=25%`
- Large soft: `X=0, Y=35, Blur=60, Opacity=25%`
- Centered glow: `X=0, Y=0, Blur=30, Opacity=25%`

## Elevation System
Define **5 levels** upfront, scale linearly:
1. **sm**: buttons, subtle raises (tight blur, small offset)
2. **md**: cards, hover states
3. **lg**: dropdowns (need to float above UI)
4. **xl**: popovers, tooltips
5. **2xl**: modals (capture attention)

## Two-Part Shadow Technique
Combine for realism:
1. **Direct light shadow**: larger, softer, big Y offset, large blur
2. **Ambient shadow**: tighter, darker, small offset, small blur

At higher elevations, reduce/remove ambient shadow (objects far from surface lose contact shadow).

## Interactive Shadows
- **Drag/lift**: increase shadow (feels elevated)
- **Press/active**: decrease or remove shadow (feels pushed in)

## Shadow Colors
- **Avoid pure black** - use dark grey (#3D4B5C or similar)
- **Colorful shadows**: use darker shade of element's color - makes design "pop"
- **Dark mode**: don't invert to white - use lighter background shade for elevation
- **Button text shadow**: subtle shadow on light text improves contrast when can't change colors

## Shadows as Affordance
- Cards with subtle shadow indicate clickability
- Add hover animation (card + shadow become slightly bigger)
- Shadows signal interactive elements

## Inner Shadows Warning
- Inner shadows create "sunken" appearance
- **Very rarely used** in modern UI - can be confusing
- Users expect drop shadows = clickable, inner shadows confuse this

## What Gets Shadows
- **Yes**: buttons, cards, dropdowns, modals, interactive elements
- **No**: disabled buttons, text, static elements

## Alternatives to Borders
Try before using borders:
1. **Box shadows** - outline without harshness
2. **Different background colors** - often enough
3. **Extra spacing** - separation through distance

## Raised Elements (Buttons)
- Top edge: slightly lighter (inset shadow or top border)
- Bottom shadow: small, dark, slight Y offset, 2-3px blur

## Inset Elements (Inputs)
- Bottom edge: lighter (bottom border or negative Y inset)
- Top shadow: small dark inset with positive Y offset

## Flat Design Depth
- **Color creates depth**: lighter = closer, darker = further
- **Solid shadows**: no blur, short vertical offset - maintains flat aesthetic

## Overlapping Elements
- Let cards **cross boundaries** between background sections
- Elements can extend beyond parent container
- Use background-matched gaps when overlapping images

## Image Background Bleed
- When image background matches UI background, they bleed together
- Use **subtle inner box shadow** instead of border
- Borders often clash with image colors; shadow is nearly invisible

## Quick Reference
| Property | Soft Shadow Value |
|----------|-------------------|
| X offset | 0 |
| Y offset | 20-40px |
| Blur | 30-60px |
| Opacity | 5-10% |
| Color | Dark grey, not black |
