# Spacing Reference

## Spacing Scale
- **Recommended base**: 16px (default browser font size, divides nicely)
- **Desktop unit**: 8px increments
- **Mobile unit**: 4px increments (more granular)
- **Example scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- **Non-linear**: tight jumps at small end, looser at large end
- **Adjacent values**: differ by ~25% or more

## Line Length
- **Optimal**: 45-75 characters per line (50-60 sweet spot)
- **In em units**: 20-35em
- Keep paragraph width constrained even if layout is wider

## Philosophy
- **Start with too much** white space, then remove until happy
- **Remove, don't add** - default designs give minimum, not optimal
- **Dense UIs** (dashboards) are deliberate choices, not defaults

## Proximity Rules
- **Groups**: more space around groups than within them
- **Form fields**: larger gap between field groups than label-to-input
- **Section headings**: more space above than below
- **Lists**: space between items > line-height within items

## Grid System
**8pt Grid (Soft)**:
- Only spacing uses 8pt increments
- Dimensions can vary
- More practical than Hard Grid

**Desktop**:
- 12-column grid (divisible by 12, 6, 4, 3, 2, 1)
- Margins: 160-180px
- Gutters: 12-20px
- Fluid columns, fixed gutters/margins

**Mobile**:
- Margins: 20-24px
- Base value: 4px (more granular)
- Scale: 4, 8, 12, 16, 20, 24, 28, 32...

## Layout Principles
- **Don't fill the screen** - use optimal width, add max-width
- **Fixed + flex**: sidebar fixed, main content flexes
- **Grids overrated** for app UI - not everything should be fluid
- **Don't shrink until necessary** - use max-width over percentages

## Responsive Sizing
- **Headlines shrink faster** than body on small screens
- Desktop: 45px headline, 18px body (2.5x)
- Mobile: 20-24px headline, 14px body (1.5x)
- **Don't lock relationships** - fine-tune independently

## Button Padding (Non-Linear)
- Padding does NOT scale proportionally with size
- **Larger buttons**: more generous padding (disproportionately)
- **Smaller buttons**: tighter padding
- Example: 16px font, 16px horizontal padding, 12px vertical

## Quick Reference
| Element | Value |
|---------|-------|
| Recommended base | 16px |
| Desktop unit | 8px |
| Mobile unit | 4px |
| Desktop margins | 160-180px |
| Mobile margins | 20-24px |
| Gutters | 12-20px |
| Grid columns (web) | 12 |
| Minimum tap target | 44x44px |
| Line length | 45-75 chars / 20-35em |
| Tab bar height | 60-84px |
| Mobile sidebar width | 70-80% |
