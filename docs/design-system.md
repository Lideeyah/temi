# Tèmi — design system

**Tactile Paper & Cool Slate.**

The surface reads as a premium physical ledger: warm matte paper, crisp white cards, hairline
rules, desaturated accents that never shout. Every colour is a flat pigment. **No gradients, no
glows, no glass, no shadows** except where an element genuinely floats above the page.

The reasoning: this is a financial instrument for a trader who keeps books on paper. It should
feel like a better ledger, not like a crypto dashboard. Nothing on screen should look like it is
trying to excite you about your own money.

---

## Colour

Defined once as Tailwind v4 `@theme` tokens in `app/globals.css`. Nothing in the app uses a raw
hex that is not here.

### Canvas

| Token | Value | Used for |
|---|---|---|
| `paper` | `#F4F1EA` | the page itself — warm, matte, never white |
| `paper-raised` | `#F9F8F6` | inset panels, inputs, wells inside a card |
| `card` | `#FFFFFF` | cards lifting off the paper |

### Ink and slate

| Token | Value | Used for |
|---|---|---|
| `ink` | `#1F242F` | primary text, primary buttons, the cursor |
| `slate-strong` | `#4F5868` | body copy, secondary text |
| `slate-soft` | `#7A8496` | labels, hints, units, disabled |

### Accents — desaturated, each carries one meaning

| Token | Value | Means |
|---|---|---|
| `moss` | `#4A6B5D` | success, the mutual buffer, "this is yours" |
| `ochre` | `#8C733E` | caution, simulated, the sweep reticle, unpiloted markets |
| `rust` | `#8C4A4A` | refusal, error, destructive, money leaving |
| `steel` | `#4A627A` | in progress, informational, cross-chain |

Accents appear at three strengths — text at full value, a `0.28` border, a `0.07` fill. That
triple is what every badge and notice is built from.

### Hairlines — the entire structure of the interface

| Token | Value |
|---|---|
| `hairline` | `rgba(31, 36, 47, 0.12)` |
| `hairline-strong` | `rgba(31, 36, 47, 0.22)` |

There are almost no shadows in this interface. Structure comes from 1px rules, the way a printed
form is divided. If you find yourself reaching for a shadow, reach for a hairline instead.

---

## Typography

Two families, and a hard rule about which is which.

| | Family | Rule |
|---|---|---|
| Prose | **Geist Sans** | everything a person reads as language |
| Figures | **Geist Mono** via `.tabular` | **every number, address, hash and code** |

`.tabular` sets `font-variant-numeric: tabular-nums` and `"tnum" 1, "zero" 1`, so figures align
down a column like a printed ledger. A naira amount that shifts as it updates is a bug.

### Scale

Small and dense by design. A merchant reads this on a phone in a market, and the figures carry
the emphasis, not the labels.

| Size | Role |
|---|---|
| `38–44px` | the one balance that matters on a screen |
| `20–24px` | section headings |
| `15–16px` | card titles |
| `13–13.5px` | body, buttons |
| `12–12.5px` | dense body, metric labels |
| `11–11.5px` | hints, secondary rows — **the most-used size in the app** |
| `10–10.5px` | units, footnotes, disclosures |
| `9–9.5px` | axis ends, slider bounds |

Tracking tightens as size grows: `-0.01em` on buttons, `-0.02em` on headings, `-0.03em` to
`-0.04em` on display figures.

### The eyebrow

```
10px · 0.14em letter-spacing · uppercase · 500 · slate-soft
```

Sits above every metric and every section. It is the editorial device that holds the whole layout
together — it says what a number *is* without competing with it.

---

## Shape and space

| | |
|---|---|
| Card radius | **4px** |
| Control radius | **3px** |
| Chip / inner radius | **2px** |
| Bars, tracks | **1px** |

Nothing is rounder than 4px. The interface is made of rectangles, like a form.

Cards use `p-5` on mobile, `p-7` from `sm`. Inset panels are `px-3.5 py-3`. Metric rows are
`py-[3px]` — deliberately tight, so a column of figures reads as one block.

---

## Components

All in `components/ui/Primitives.tsx`. Nothing outside that file invents a control.

### Button — four variants

| Variant | Appearance | Use |
|---|---|---|
| `solid` | ink fill, paper text | the one primary action on a screen |
| `outline` | transparent, hairline-strong border | secondary |
| `ghost` | transparent, no border | tertiary, inline |
| `alert` | rust fill, white text | destructive or refusal |

`rounded-[3px] · px-4 py-2.5 · 13px/500 · tracking -0.01em`. Disabled drops to `slate-soft`, and
**a disabled primary action must always state its reason underneath** — a dead end with no
explanation is not acceptable in this app.

### Badge · StatusDot

Five tones, the accent triple. `9–10px`, uppercase, tabular. Used for chain state, verification
state, asset state.

### Notice

The same five tones, as a left-bordered panel — `border-l-2` in the tone, `0.06` tint. Carries a
title and optional body. This is how the app says anything consequential: a refusal, a
disclosure, a confirmation.

### Modal

`fixed inset-0 z-50`, backdrop `rgba(31,36,47,0.42)`. Bottom sheet on mobile
(`items-end`), centred from `sm`. Header carries an eyebrow and a title; close is
`aria-label="Close"`.

### Field · TextInput

Label, optional hint, optional right-aligned suffix — the suffix is where the **conversion** goes:
type in naira, see tCTC underneath. `paper-raised` fill, `hairline-strong` border,
`rounded-[3px] px-3 py-2.5`, 13px, tabular.

### MetricRow

Label left, value right, `py-[3px]`, optional tone. The workhorse — every receipt, every quote,
every breakdown is a stack of these.

---

## Currency

The single rule that governs every figure: **the merchant reads in the unit they transact in.**

- The denomination follows the rail they funded through — NIP → naira, native or Attestcoin → tCTC
- It persists across reloads, and the header toggle overrides it
- `money(wei)` from `useRegion()` respects the toggle. **Any component that formats a figure
  itself will show the wrong currency**, which is the kind of bug nobody notices until a merchant
  does
- Where an input must be token-denominated — a native tCTC transfer moves whole base units — the
  fiat equivalent goes underneath, never the other way round

Four jurisdictions: `NGN ₦` · `GHS GH₵` · `KES KSh` · `USD $`. Minor units appear only where the
rate is under 100 — naira and shillings read wrong with kobo.

---

## Motion

Almost none, and never decorative.

| | |
|---|---|
| Transitions | `150ms`, colour only |
| Reticle pulse | `1.6s ease-in-out`, opacity `0.35 ↔ 0.85` |
| Reduced motion | `prefers-reduced-motion` kills the pulse outright |

Nothing slides, bounces or fades in on load. The sweep viewfinder is the one animated surface,
and it is animated because it is a **measuring instrument** — the pulse says it is live.

---

## Focus

```css
.focus-ring:focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 2px;
}
```

One ring, ink, everywhere. Every interactive element carries `.focus-ring`. There is no variant.

---

## Two textures

**`.ruled`** — faint 28px repeating rule, the way ledger paper is pre-printed before anything is
written on it. Used behind empty states.

**`.temi-range`** — the funding-horizon slider, hand-styled because the native control carries
different chrome on every platform. An 18px square thumb, deliberately large: a merchant sets this
with a thumb on a phone, not a mouse.

---

## What this system refuses

- No gradients, glows, or glass
- No shadows for structure — hairlines instead
- No colour that carries no meaning
- No number in a proportional font
- No disabled action without a stated reason
- No figure in a currency the merchant did not choose
