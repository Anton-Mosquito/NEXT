# UI Technical Specification — Forgot Password Screen

**Source Frame:** 103. Forgot Password (Node 167:7873)  
**Viewport:** 1440 × 1024 px  
**Design System Font:** Inter (all UI text), Poppins (logo only)  

> **Note:** This screen is stored as a flattened raster image in Figma. All measurements below are derived from the editable Login screen (Node 137:8302) which shares the identical auth-page layout pattern, cross-referenced with the component library and the 2× visual export.

---

## 1. Overall Layout & Container Architecture

### 1.1 Page Container (Root)
| Property | Value |
| :--- | :--- |
| **Width** | 1440px (fixed, full viewport) |
| **Height** | 1024px (fixed, full viewport) |
| **Background Color** | `#F4F5F7` (solid, opacity 1) |
| **Display** | flex |
| **Justify Content** | center |
| **Align Items** | flex-start |
| **Padding Top** | 160px |
| **Overflow** | hidden (`clipsContent: true`) |

### 1.2 Content Wrapper (Form Card)
| Property | Value |
| :--- | :--- |
| **Width** | 400px (hug-content) |
| **Height** | Auto (hug-content) |
| **Layout** | Flexbox — `flex-direction: column` |
| **Align Items** | flex-start |
| **Gap (item-spacing)** | 40px |
| **Padding** | 0 all sides |
| **Background** | Transparent (none) |
| **Position** | Centered horizontally in page (`margin: 0 auto` or `left: 520px` absolute) |

### 1.3 Upper Section (Logo + Header Text)
| Property | Value |
| :--- | :--- |
| **Width** | Hug-content (auto) |
| **Layout** | Flexbox — `flex-direction: column` |
| **Align Items** | center |
| **Gap (item-spacing)** | 64px |
| **Align Self** | stretch (width: 400px from parent) |

### 1.4 Header Text Group (Title + Subtitle)
| Property | Value |
| :--- | :--- |
| **Width** | Hug-content |
| **Layout** | Flexbox — `flex-direction: column` |
| **Align Items** | center |
| **Gap** | 8px |

### 1.5 Form Section (Input + Button + Link)
| Property | Value |
| :--- | :--- |
| **Width** | 400px (hug-content from children) |
| **Layout** | Flexbox — `flex-direction: column` |
| **Align Items** | center |
| **Gap (item-spacing)** | 24px |

### 1.6 Email Field Group (Label + Input)
| Property | Value |
| :--- | :--- |
| **Width** | 400px |
| **Layout** | Flexbox — `flex-direction: column` |
| **Align Items** | flex-start |
| **Gap** | 8px |

---

## 2. Typography & Text Tokens

### 2.1 Logo — "FINEbank.IO"
The logo is a single text node with mixed font weights (Poppins):

| Segment | Font Family | Font Weight | Font Style |
| :--- | :--- | :--- | :--- |
| **FINE** | Poppins | 800 (ExtraBold) | ExtraBold |
| **bank.** | Poppins | 500 (Medium) | Medium |
| **IO** | Poppins | 800 (ExtraBold) | ExtraBold |

| Property | Value |
| :--- | :--- |
| **Font Size** | 40px |
| **Line Height** | 32px |
| **Letter Spacing** | 8% (~3.2px at 40px) |
| **Text Align** | center |
| **Color** | `#299D91` |
| **Text Auto Resize** | `WIDTH_AND_HEIGHT` (hug) |

### 2.2 Page Heading — "Forgot Password?"
| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 600 (Semi Bold) |
| **Font Size** | 20px |
| **Line Height** | 28px |
| **Letter Spacing** | 0 |
| **Text Align** | center |
| **Color** | `#191D23` |
| **Text Auto Resize** | `WIDTH_AND_HEIGHT` |

### 2.3 Subtitle — "Enter your email address to get the password reset link."
| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 400 (Regular) |
| **Font Size** | 14px |
| **Line Height** | 20px |
| **Letter Spacing** | 0 |
| **Text Align** | center |
| **Color** | `#999DA3` |
| **Max Width** | 400px (wraps to 2 lines) |
| **Text Auto Resize** | `HEIGHT` |

### 2.4 Input Label — "Email Address"
| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 500 (Medium) |
| **Font Size** | 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0 |
| **Text Align** | left |
| **Color** | `#191D23` |
| **Text Auto Resize** | `TRUNCATE` (single-line, fixed width) |

### 2.5 Input Placeholder — "hello@example.com"
| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 400 (Regular) |
| **Font Size** | 16px |
| **Line Height** | 22px |
| **Letter Spacing** | 0 |
| **Text Align** | left |
| **Color** | `#999DA3` |

### 2.6 Button Label — "Password Reset"
| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 600 (Semi Bold) |
| **Font Size** | 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0 |
| **Text Align** | center |
| **Color** | `#FFFFFF` |

### 2.7 Back Link — "Back to login"
| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 400 (Regular) |
| **Font Size** | 14px |
| **Line Height** | 20px |
| **Letter Spacing** | 0 |
| **Text Align** | center |
| **Color** | `#999DA3` |
| **Cursor** | pointer |

---

## 3. Interactive & Form Components

### 3.1 Email Input Field
*(Component: `Input`, Variant: `Type=Name-Email`)*

#### Default State (`Active=No`)
| Property | Value |
| :--- | :--- |
| **Width** | 400px (fixed) |
| **Height** | 48px (fixed) |
| **Layout** | Flexbox — `flex-direction: row` |
| **Padding** | 12px 16px (top/bottom 12, left/right 16) |
| **Gap (internal)** | 24px |
| **Background** | Transparent (no fill) |
| **Border** | 1px solid `#D0D5DD` |
| **Border Radius** | 8px |
| **Box Shadow** | None |

#### Focus / Active State (`Active=Yes`)
| Property | Value |
| :--- | :--- |
| **Border** | 1px solid `#4B5768` |
| **All other properties** | Same as Default |

#### Input Text (Filled State)
| Property | Value |
| :--- | :--- |
| **Color** | `#4B5768` |
| **All other font properties** | Same as placeholder (Inter Regular 16/22) |

### 3.2 Primary Button — "Password Reset"
*(Component: `Button/primary`, Variant: `Active=Yes`)*

| Property | Value |
| :--- | :--- |
| **Width** | 400px (fixed, fill-container from parent) |
| **Height** | 48px (fixed) |
| **Layout** | Flexbox — `flex-direction: row` |
| **Justify Content** | center |
| **Align Items** | center |
| **Padding** | 16px 12px (top/bottom 16, left/right 12) |
| **Background Color** | `#299D91` |
| **Border** | None (stroke-weight: 0) |
| **Border Radius** | 4px |
| **Cursor** | pointer |

### 3.3 "Back to login" Text Link
| Property | Value |
| :--- | :--- |
| **Display** | Inline text element |
| **Font** | See §2.7 above |
| **Text Decoration** | None (no underline in default) |
| **Cursor** | pointer |

---

## 4. Component States

### 4.1 Email Input States
| State | Border Color | Text Color | Background |
| :--- | :--- | :--- | :--- |
| **Default (empty)** | `#D0D5DD` | `#999DA3` (placeholder) | Transparent |
| **Focus / Active** | `#4B5768` | `#4B5768` (typed text) | Transparent |
| **Hover** | `#4B5768` (inferred) | — | Transparent |
| **Error** | `#E73D1C` (from palette) | `#E73D1C` (helper text) | Transparent |
| **Disabled** | `#E4E7EB` (inferred) | `#999DA3` | `#F4F5F7` (inferred) |

#### Error State Details (Recommended Implementation)
| Property | Value |
| :--- | :--- |
| **Border Color** | `#E73D1C` |
| **Border Width** | 1px |
| **Helper Text Font** | Inter Regular, 12px, line-height 16px |
| **Helper Text Color** | `#E73D1C` |
| **Helper Text Spacing** | 4px below input |
| **Example Message** | "Please enter a valid email address" |

### 4.2 Primary Button States
| State | Background | Text Color | Border |
| :--- | :--- | :--- | :--- |
| **Default** | `#299D91` | `#FFFFFF` | None |
| **Hover** | `#237F75` (darken ~10%, inferred) | `#FFFFFF` | None |
| **Active / Pressed** | `#1C6B63` (darken ~20%, inferred) | `#FFFFFF` | None |
| **Disabled (`Active=No`)** | `#E4E7EB` | `#4B5768` | None |
| **Loading** | `#299D91` at 70% opacity (inferred) | `#FFFFFF` | None |

### 4.3 "Back to login" Link States
| State | Color | Text Decoration |
| :--- | :--- | :--- |
| **Default** | `#999DA3` | None |
| **Hover** | `#299D91` (inferred, matches brand) | Underline (inferred) |
| **Active** | `#237F75` (inferred) | Underline |

---

## 5. Spacing & Vertical Rhythm Summary

From top of content wrapper, the vertical stacking order:

```text
┌─────────────── Content Wrapper (400px wide) ────────────────┐
│                                                              │
│  ┌── Logo Frame (centered) ──┐                               │
│  │  "FINEbank.IO"  (276×32)  │                               │
│  └───────────────────────────┘                               │
│                 ↕ 64px                                        │
│  ┌── Header Text Group ─────┐                                │
│  │  "Forgot Password?" (h1) │                                │
│  │         ↕ 8px             │                                │
│  │  "Enter your email..."   │                                │
│  └───────────────────────────┘                               │
│                 ↕ 40px                                        │
│  ┌── Form Section ──────────┐                                │
│  │  ┌── Email Field Group ┐  │                               │
│  │  │  Label (Email...)   │  │                               │
│  │  │         ↕ 8px       │  │                               │
│  │  │  Input Container    │  │                               │
│  │  └─────────────────────┘  │                               │
│  │         ↕ 24px            │                               │
│  │  [ Password Reset Button ]│                               │
│  │         ↕ 24px            │                               │
│  │     Back to login         │                               │
│  └───────────────────────────┘                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Icons & Media Assets

### 6.1 Logo
The logo is purely typographic (no icon/image). Rendered as a styled `<span>` or heading with mixed font weights (see §2.1). No SVG or image asset required.

### 6.2 Eye Icon (Not used on this screen)
Present in the Input component's Password variants but not visible on the Forgot Password screen (Email variant has no trailing icon).

| Property | Value |
| :--- | :--- |
| **Dimensions** | 24 × 24px |
| **Stroke Color** | `#999DA3` |
| **Stroke Weight** | 2px |
| **Fill** | None |

---

## 7. Design System Color Palette Reference

| Token / Role | HEX | Usage |
| :--- | :--- | :--- |
| **Primary / Brand** | `#299D91` | Logo, CTA button bg, accent links |
| **Text Primary** | `#191D23` | Headings, input labels |
| **Text Secondary** | `#4B5768` | Input typed text, active borders |
| **Text Tertiary / Placeholder** | `#999DA3` | Placeholder text, subtitles, muted links |
| **Border Default** | `#D0D5DD` | Input borders (inactive) |
| **Border Active** | `#4B5768` | Input borders (focused) |
| **Surface / Page BG** | `#F4F5F7` | Page background |
| **Button Disabled BG** | `#E4E7EB` | Disabled button fill |
| **Error** | `#E73D1C` | Error borders, validation text |
| **Success** | `#4DAF6E` | Success states |
| **White** | `#FFFFFF` | Button text on primary |

---

## 8. Responsive Considerations

| Breakpoint | Behavior |
| :--- | :--- |
| **≥ 1440px** | Content wrapper stays 400px wide, centered |
| **1024–1439px** | Content wrapper stays 400px, centered with fluid margins |
| **768–1023px** | Content wrapper stays 400px, reduce top padding to 120px |
| **< 768px (mobile)** | Content wrapper fills width with 24px horizontal padding (`max-width: 400px`); top padding 80px |

---

## 9. Accessibility Notes

- **Form label association:** The "Email Address" label must be associated with the input via `htmlFor` / `id` pairing.
- **Focus indicator:** Active/focus border change from `#D0D5DD` → `#4B5768` provides visual feedback. Ensure this also works with keyboard navigation.
- **Error announcements:** Error helper text should use `aria-describedby` linking to the input and `role="alert"` for screen readers.
- **Link semantics:** "Back to login" should be an `<a>` tag or `<Link>` component with proper `href`. "Password Reset" is a `<button type="submit">`.
- **Contrast ratios:** Placeholder text `#999DA3` on white/light background meets AA for large text but may be borderline for small — the 14px subtitle at `#999DA3` on `#F4F5F7` yields ~2.7:1 (below 4.5:1 AA). Consider using `#666666` or darker for improved accessibility.
