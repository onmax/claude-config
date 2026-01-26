# Components Reference

## Buttons

**Hierarchy pyramid**:
1. **CTA**: biggest, most prominent
2. **Primary**: solid, high-contrast background
3. **Secondary**: outline or lower-contrast background
4. **Tertiary**: link-style, minimal

**Sizing**:
- Height: 40-60px (never below 40 for tap targets)
- Horizontal padding: 32px web
- Font: 16px base, never below 13 or above 20
- Mobile: often full width minus margins

**Non-linear padding**: padding does NOT scale proportionally
- Larger buttons: more generous padding (disproportionately)
- Smaller buttons: tighter padding
- Shadows work best on filled buttons, not outline/transparent

**Corner radius**:
- 0px: sharp, formal, elegant
- 8-12px: balanced, modern
- 20px+: friendly, playful
- Stay consistent throughout design

**States**: Default, Hover, Active/Pressed, Disabled

**Pairs**: Primary on RIGHT, Secondary on LEFT

**Destructive**: don't auto-make red; use hierarchy first, confirmation dialog for big red

## Forms

**Goal**: maximize conversion (completion rate)

**Text field sizing**: match width to expected input length (credit card full, CVC narrow)

**States**: Inactive, Focused, Writing, Success, Error, Disabled

**Best practices**:
- Remove unnecessary fields
- Real-time validation on blur
- Single-column layout
- Break long forms into steps
- Mark "Optional" not "Required*"
- Make labels clickable
- Allow social login when possible
- Explain why sensitive info needed (tooltip)
- Group related fields semantically

**Floating labels**: transform placeholder into label when user types (Google/Adidas pattern)

**Switches vs Checkboxes**: switches for instant settings (no submit), checkboxes for form values requiring submit

**Dropdowns**: use for 5+ options (radio buttons for 2-4)

**Sizing**: Radio/checkbox visual 24px, tap area 44px+

## Cards

**Purpose**: preview that helps users decide what to explore

**Content**: only info needed for decision (recipe: photo, title, time, difficulty - not full recipe)

**Anatomy**: image, header, short data, action buttons, consistent padding

**Make clickable**: subtle shadow, hover animation (slight scale)

**Styles**: white + shadow (common), outline, darker background shade

**Testing**: long names (ellipsis), missing images (placeholder), hover states

## Navigation

**Types**:
1. **Visible**: always accessible, 5 items max
2. **Hidden**: tap to reveal, more items possible
3. **Contextual**: links within content

**Mobile tab bar**:
- Bottom of screen
- Height: 60-84px
- Max 5 items (4 optimal), 7+ causes cognitive overload
- Current: highlighted/filled icon
- Others: de-emphasized (35% opacity) / outline icon
- **Label consistency**: ALL icons have labels or NONE do
- Account for iPhone home indicator (add extra height, center icons upward)

**Desktop**: top of screen, text tabs with optional dropdowns, buttons last

**Sidebar**: 70-80% width on mobile, 60-70% dark overlay, hamburger trigger

**Active state**: de-emphasize inactive items, not just highlight active

## Tables

- Combine columns when sorting not needed
- Add images where it makes sense
- Use color to enrich data
- Right-align numbers (decimals align)
- Don't require every column to be single-purpose

## Dropdowns/Menus

- **Break the mold**: sections, columns, icons, supporting text
- It's a floating box - do anything useful
- **Add search** inside dropdown for large lists
- **Always show scrollbar** so users know it scrolls
- Use for 5+ options; radio buttons for 2-4

## Empty States

- **Priority, not afterthought**
- Add illustration/image for attention
- Emphasize CTA
- Hide supporting UI (tabs, filters) until content exists

## Icons

**Two types**:
1. **Clarifying icons**: explain features/categories (non-interactive)
2. **Interactive icons**: perform actions (buttons)

**Selection rules**:
- Use icon packs for consistency (never mix sources)
- Simple icons (readable small)
- Consistent line width and roundness
- Match line width to adjacent text weight

**Sizing**: 24x24px bounding box typical, tap area 44x44px minimum

**Styles**: outline (modern), filled (prominent) - mix acceptable for states

**Labels**: common icons (Home, Search, Profile) can skip labels; unknown icons NEED labels. All or none consistency.

**Don't scale up** small icons - look chunky at 3-4x. Don't scale down large - redraw simplified.

**Balance with text**: reduce icon contrast (softer color) since visually heavy

**Recommended packs**: Anron Icons, Iconly 2, Streamline, Feather Icons (free)

## Images/Photos

**Selection**: high-res, single focal point, authentic, emotional, works at multiple ratios

**Text on images**:
- Black overlay 30-50% opacity
- Gradient: transparent top, solid bottom
- Colorful overlay at low opacity

**Consistency**: same color temperature/filter across photos, or curate matching naturally

**People direction**: should "look toward" content/CTA

## Microcopy

**Buttons**: specific but not wordy ("Add to favorites" not "Favorite" or "Add this product to favorites")

**Popups**: avoid double negatives, be explicit about consequences

**Errors**: suggest solutions, sound human

## Illustrations

**Use for**: landing pages, onboarding, achievements, empty states, 404 pages

**Avoid for**: luxury/formal products (use real photos), e-commerce products (users want exact product)

**Rules**:
- Don't scale too small (details become unreadable)
- Keep consistent style throughout product
- Use packs for consistency

**Free sources**: storyset.com, icons8.com/ouch, streamlineicons.com

## Gradients

**Types**: Linear, Radial, Angular/Conic, Mesh (use sparingly)

**Smooth transitions**:
- Use similar hues (shift 20-25 degrees only)
- Avoid hues that create grey in the middle
- Start with same color both sides, shift one hue by 20-25

## Quick Reference

| Element | Value |
|---------|-------|
| Button height | 40-60px |
| Button padding | 32px horizontal |
| Min tap target | 44x44px |
| Tab bar height | 60-84px |
| Icon size | 24px typical |
| Radio/checkbox | 24px visual |
| Max nav items | 5-7 |
| Dropdown threshold | 5+ options |
| Sidebar mobile width | 70-80% |
| Animation duration | <1000ms |
