---
name: web-ui
description: Always use when building web UIs - covers interactions, a11y, animations, layout, forms, performance, and design patterns. Framework-agnostic guidelines adapted for Vue/Nuxt. Use when editing .vue files, building components in pages/components/layouts, styling UI, implementing forms, adding animations, or reviewing UI code quality.
license: MIT
---

# Web Interface Guidelines

Interfaces succeed from hundreds of choices. Non-exhaustive checklist for quality UIs.

## Interactions

- **Keyboard works everywhere.** All flows keyboard-operable, follow [WAI-ARIA Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/)
- **Clear focus.** Visible focus ring on focusables. Prefer `:focus-visible` over `:focus`. Set `:focus-within` for grouped controls
- **Manage focus.** Focus traps, move & return focus per WAI-ARIA
- **Hit targets.** Match visual & hit targets. If visual < 24px, expand hit to ≥ 24px. Mobile: ≥ 44px
- **Mobile input size.** `<input>` font ≥ 16px to prevent iOS Safari auto-zoom
- **Never disable browser zoom**
- **Hydration-safe.** Inputs must not lose focus/value after hydration
- **Never block paste** in inputs/textareas
- **Loading buttons.** Show spinner + keep original label
- **Loading state timing.** Show delay ~150-300ms, min visible ~300-500ms to avoid flicker. Use `<Suspense>` in Vue
- **URL as state.** Persist in URL for share/refresh/back-forward. See [nuqs](https://nuqs.dev)
- **Optimistic updates.** Update UI immediately; reconcile on response. On failure: error + rollback or Undo
- **Ellipsis for actions/loading.** "Rename…", "Saving…", "Generating…"
- **Confirm destructive actions.** Confirmation or Undo with safe window
- **Prevent double-tap zoom.** `touch-action: manipulation`
- **Tap highlight.** Set `-webkit-tap-highlight-color`
- **Forgiving interactions.** Generous hit targets, clear affordances, prediction cones
- **Tooltip timing.** Delay first tooltip; subsequent peers no delay
- **Overscroll.** `overscroll-behavior: contain` for modals/drawers
- **Scroll positions persist.** Back/Forward restores prior scroll
- **Autofocus.** Desktop with single primary input. Rarely on mobile (keyboard causes layout shift)
- **No dead zones.** If it looks interactive, it should be
- **Deep-link everything.** Filters, tabs, pagination, expanded panels
- **Clean drag.** Disable text selection, apply `inert` while dragging
- **Links are links.** Use `<a>` or `<NuxtLink>` for navigation. Never `<button>` or `<div>` for links
- **Announce async.** Use polite `aria-live` for toasts/validation
- **Locale-aware shortcuts.** Internationalize for non-QWERTY. Platform-specific symbols

## Animations

- **Honor `prefers-reduced-motion`** with reduced-motion variant
- **CSS first.** CSS > Web Animations API > JS libraries (motion)
- **Compositor-friendly.** GPU-accelerated: `transform`, `opacity`. Avoid: `width`, `height`, `top`, `left`
- **Necessity check.** Only animate to clarify cause/effect or deliberate delight
- **Easing fits subject.** Choose based on what changes
- **Interruptible.** Cancelable by user input
- **Input-driven.** Avoid autoplay; animate on actions
- **Correct transform origin.** Anchor to where motion "physically" starts
- **Never `transition: all`.** Explicitly list properties
- **SVG transforms.** Apply to `<g>` wrappers with `transform-box: fill-box; transform-origin: center`

## Layout

- **Optical alignment.** Adjust ±1px when perception beats geometry
- **Deliberate alignment.** Every element aligns intentionally
- **Balance contrast.** Adjust weight/size/spacing when text + icons sit together
- **Responsive coverage.** Mobile, laptop, ultra-wide. Zoom out 50% to simulate ultra-wide
- **Safe areas.** Account for notches with safe-area CSS vars
- **No excessive scrollbars.** Fix overflow issues. Test with macOS "Show scroll bars: Always"
- **Let browser size things.** Flex/grid over JS measurement

## Content

- **Inline help first.** Tooltips as last resort
- **Stable skeletons.** Mirror final content exactly
- **Accurate page titles.** `<title>` reflects current context. In Nuxt: `useHead({ title })`
- **No dead ends.** Every screen offers next step or recovery
- **All states designed.** Empty, sparse, dense, error
- **Typographic quotes.** Curly " " over straight " "
- **Avoid widows/orphans.** Tidy rag & line breaks
- **Tabular numbers.** `font-variant-numeric: tabular-nums` for comparisons
- **Redundant status cues.** Don't rely on color alone; include text
- **Icons have labels.** Same meaning with text for screen readers
- **Use ellipsis character.** `…` not `...`
- **Anchored headings.** Set `scroll-margin-top` for section links
- **Resilient layouts.** Handle short, average, very long content
- **Locale-aware formats.** Dates, times, numbers, currencies
- **Language from settings.** `Accept-Language` header, `navigator.languages`. Never IP/GPS for language
- **Accessible content.** Accurate `aria-label`, hide decoration with `aria-hidden`
- **Icon-only buttons.** Provide descriptive `aria-label`
- **Semantics before ARIA.** Native elements first (`button`, `a`, `label`, `table`)
- **Headings & skip link.** Hierarchical `<h1-h6>` + "Skip to content"
- **Non-breaking spaces.** `&nbsp;` for units: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`

## Forms

- **Enter submits.** When text input focused, Enter submits if only/last control
- **Textarea.** ⌘/⌃+Enter submits; Enter inserts newline
- **Labels everywhere.** Every control has or is associated with label
- **Label activation.** Click label focuses control
- **Submission.** Keep submit enabled until in-flight; then disable + spinner + idempotency key
- **Don't block typing.** Allow any input; show validation feedback
- **Don't pre-disable submit.** Allow submitting incomplete forms
- **No dead zones on controls.** Label + control share generous hit target
- **Error placement.** Errors next to fields; focus first error on submit
- **Autocomplete & names.** Set proper `autocomplete` and `name` values
- **Spellcheck.** Disable for emails, codes, usernames
- **Correct types.** Right `type` + `inputmode` for keyboards/validation
- **Placeholders signal emptiness.** End with ellipsis
- **Placeholder value.** Example pattern: `+1 (123) 456-7890`, `sk-012345679…`
- **Unsaved changes.** Warn before navigation. In Vue: `onBeforeRouteLeave`
- **Password manager friendly.** Allow pasting OTP codes
- **Avoid triggering password managers.** For non-auth: `autocomplete="off"`
- **Trim whitespace.** Handle text expansions adding trailing space
- **Windows `<select>`.** Explicitly set `background-color` + `color` for dark mode

## Performance

- **Test matrix.** iOS Low Power Mode, macOS Safari
- **Measure reliably.** Disable interfering extensions
- **Track re-renders.** Minimize and make fast. In Vue: check with DevTools
- **Throttle when profiling.** CPU + network throttling
- **Minimize layout work.** Batch reads/writes; avoid reflows
- **Network latency.** POST/PATCH/DELETE < 500ms
- **Large lists.** Virtualize with [virtua](https://github.com/inokawa/virtua) or `content-visibility: auto`
- **Preload wisely.** Above-the-fold only; lazy-load rest
- **No image CLS.** Set explicit dimensions, reserve space
- **Preconnect.** `<link rel="preconnect">` for CDN domains
- **Preload fonts.** Critical text to avoid flash
- **Subset fonts.** Ship only needed code points via unicode-range
- **Off main thread.** Web Workers for expensive work

## Design

- **Layered shadows.** Mimic ambient + direct light (≥ 2 layers)
- **Crisp borders.** Combine borders + shadows; semi-transparent improves edge
- **Nested radii.** Child ≤ parent, concentric alignment
- **Hue consistency.** On colored backgrounds, tint borders/shadows/text same hue
- **Accessible charts.** Color-blind-friendly palettes
- **Minimum contrast.** Prefer [APCA](https://apcacontrast.com/) over WCAG 2
- **Interactions increase contrast.** `:hover`, `:active`, `:focus` more contrast than rest
- **Browser UI matches.** `<meta name="theme-color">` aligns with page background
- **Color-scheme.** `color-scheme: dark` on `<html>` for proper scrollbar contrast
- **Text anti-aliasing.** Prefer animating wrapper over text node. `translateZ(0)` if artifacts
- **Avoid gradient banding.** Use masks instead

## Copywriting

- **Active voice.** "Install the CLI" not "The CLI will be installed"
- **Clear & concise.** Fewest words possible
- **Prefer `&` over `and`**
- **Action-oriented.** "Install the CLI…" not "You will need the CLI…"
- **Consistent nouns.** Few unique terms
- **Second person.** Avoid first person
- **Numerals for counts.** "8 deployments" not "eight deployments"
- **Consistent currency.** 0 or 2 decimals, never mix
- **Separate numbers & units.** `10 MB` not `10MB` (use `&nbsp;`)
- **Positive language.** Encouraging, problem-solving even for errors
- **Error messages guide exit.** Tell how to fix, not just what's wrong
- **Avoid ambiguity.** "Save API Key" not "Continue"
