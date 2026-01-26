# Typography Reference

## Type Scale
- **Hand-craft scales** - mathematical ratios (golden ratio) create gaps too large for UI
- **Example scale**: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72px
- **Base size**: 16-17px for body (Apple 16, Google 17)
- **Never below 10px** for readability
- **Use px or rem**, not em (nested elements compound)

## Font Weight
- **Body**: 400-500
- **Emphasis**: 600-700
- **Never use under 400** - too hard to read at small sizes
- **Skip 1-2 weights** when pairing (Bold + Regular, not Medium + Regular)
- **Emphasize with weight**, de-emphasize with color/size (never lighter weight)

## Line Height
- **Body text**: 1.5-1.6 × font size
- **Headers**: 1.0-1.3 × font size (large text needs less)
- **Wide paragraphs**: up to 2.0
- **Match even/odd**: even font size = even line height, odd = odd (for proper vertical rhythm)

## Line Length
- **Optimal**: 45-75 characters (50-60 sweet spot)
- **In em units**: 20-35em
- Keep paragraph width constrained even if layout is wider

## Letter Spacing
- **Default (0%)** works for most cases
- **Headlines**: tighten slightly (-3%) for fonts designed for body
- **ALL CAPS**: increase (+5%) for legibility
- **Avoid extremes** (-10% or +10%) - harms readability

## Font Selection
- **System stack**: `-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue`
- **Require 4-5 weights minimum** for proper hierarchy
- **Personality**:
  - Serif = elegant, classic, trustworthy
  - Rounded sans = playful, friendly
  - Neutral sans = relies on other elements
- **One typeface usually enough**. If two, they must differ visually (Sans + Serif)

## Alignment
- **Left-align** by default (Western languages)
- **Center only** headlines or 2-3 line blocks
- **Right-align numbers** in tables (decimals align)
- **Avoid justified** in UI

## Baseline Alignment
- When mixing font sizes on a line, align **baselines**, not centers
- Creates cleaner visual alignment

## Link Styling
- **Not every link needs color** - in link-heavy interfaces, use heavier weight or darker color
- **Ancillary links**: add underline or change color only on hover
- Use custom underline styles for personality

## Responsive Typography
- **Headlines shrink faster** than body on small screens
- Desktop: 2.5x ratio (45px headline / 18px body)
- Mobile: 1.5x ratio (20-24px headline / 14px body)
- Don't lock relationships - fine-tune sizes independently

## Avoid
- **Script/handwritten fonts** as primary typeface - hard to read
- **Rags** in centered text - uneven line endings force eye jumps
- Center text only for short blocks (2-3 lines max)
