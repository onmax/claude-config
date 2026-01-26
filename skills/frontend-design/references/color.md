# Color Reference

## Color System (HSL)
- **Use HSL** - represents color as humans perceive it
- **Hue**: 0-360 (color wheel position: 0=red, 120=green, 240=blue)
- **Saturation**: 0%=grey, 100%=vivid
- **Lightness**: 0%=black, 50%=pure color, 100%=white

**HSL vs HSB (design tools)**:
- HSB 100% brightness ≠ white (only white when saturation = 0%)
- HSL 50% lightness = pure color
- Browsers use HSL, design tools often use HSB - convert carefully

## Palette Structure
Build complete palettes, not just 5 colors:
- **Greys**: 8-10 shades (text, backgrounds, panels, controls)
- **Primary**: 5-10 shades (actions, active states, brand)
- **Accent colors**: 5-10 shades each for:
  - Red: destructive/errors
  - Yellow/Orange: warnings
  - Green: success/positive
  - Others: feature highlights
- **Total**: 50-100 color values

## Creating Shades
1. Pick base color (works as button background)
2. Find edges: darkest (text) and lightest (tinted backgrounds)
3. Fill with 9 shades (100-900 scale)
4. Increase saturation as lightness moves from 50%
5. Don't use CSS lighten/darken - define fixed values

## Perceived Brightness
- **Bright hues**: 60 (yellow), 180 (cyan), 300 (magenta)
- **Dark hues**: 0 (red), 120 (green), 240 (blue)
- To lighten without washing out: rotate hue toward nearest bright hue
- To darken without dulling: rotate toward nearest dark hue
- **Limit rotation**: 20-30 degrees max

## Greys
- **Avoid true grey** (0% saturation) - looks dead
- **Cool greys**: saturate with blue
- **Warm greys**: saturate with yellow/orange
- Keep consistent temperature throughout palette

## Colored Backgrounds
- Don't use grey text - hand-pick color (same hue, adjust saturation/lightness)
- Don't use white + opacity - looks washed out

## Color Psychology
| Color | Conveys | Best For |
|-------|---------|----------|
| Blue | Trust, security | Banking, professional |
| Red | Energy, danger | Sports, urgency |
| Yellow | Warmth, optimism | Food, travel |
| Orange | Creativity, energy | Sales, creative |
| Green | Health, success | Health, finance |
| Purple | Luxury, mystery | Premium, tech |

## Accessibility
- **WCAG contrast**: 4.5:1 normal text, 3:1 large text
- **Never rely on color alone** - add icons, patterns
- Use **contrast over hue** to differentiate (light vs dark > red vs green)
- Avoid pure black (#000000) - use #1F1F1F or similar
- **~4.5% of population is colorblind** - always test

**Flipping contrast**: when white text on colored background needs too-dark color, flip it - use dark colored text on light colored background instead.

**Hue rotation for contrast**: for colored text on colored background, rotate hue toward bright hues (60/180/300) to increase contrast without approaching white.

## Notification Colors
Default semantic colors (adjust hue slightly if conflicts with primary):
- **Success**: green (#64BC26 or similar)
- **Warning**: orange (#FD9900)
- **Error**: red (#FE2712)

## Grayscale from Primary
1. Take primary color
2. Set Saturation to 20% (warm/cool) or 0% (neutral)
3. Set Lightness to 10% for darkest grey
4. Add 10% Lightness at each step toward white

## Gradients
- Use similar hues for smooth transitions
- Shift hue by 20-30 degrees max
- Avoid hues that create grey in the middle
- Don't overuse - loses impact
