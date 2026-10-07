# UI/UX Specification — 101.Login

---

## 1. Overall Page Container

* **Semantic HTML:** `<main>`

| Property | Value |
| :--- | :--- |
| **Width** | 1440px (fixed) |
| **Height** | 1024px (fixed) |
| **Background** | `#F4F5F7` (solid) |
| **Clip Content** | true |
| **Display** | `flex` → center child both axes |

> **Note:** The login card is centered at position (520, 160) within the 1440×1024 viewport, yielding effective centering: 520px left inset, 520px right inset ($1440 - 400 - 520 = 520$), 160px top offset.

---

## 2. Login Card Container

* **Semantic HTML:** `<section>` or `<div class="login-card">`

| Property | Value |
| :--- | :--- |
| **Width** | 400px (hug content, driven by children) |
| **Height** | auto / hug (596px rendered) |
| **Layout** | `display: flex; flex-direction: column;` |
| **Gap** | 40px |
| **Background** | transparent (no fill) |
| **Padding** | 0 |

**Children (top → bottom):**
1. Logo + Form Block (gap: 64px between logo and form)
2. "Create an account" link

---

## 3. Logo / Brand Mark

* **Semantic HTML:** `<header>` or `<div class="brand">`

| Property | Value |
| :--- | :--- |
| **Container alignment** | `align-self: center` |
| **Width** | hug (276px) |
| **Height** | 32px |

### Brand Text: `FINEbank.IO`

| Segment | Font Family | Font Weight | Font Size | Color |
| :--- | :--- | :--- | :--- | :--- |
| **FINE** | Poppins | 800 (ExtraBold) | 40px | `#299D91` |
| **bank.** | Poppins | 500 (Medium) | 40px | `#299D91` |
| **IO** | Poppins | 800 (ExtraBold) | 40px | `#299D91` |

| Property | Value |
| :--- | :--- |
| **Line Height** | 32px |
| **Letter Spacing** | 8% (≈ 3.2px at 40px) |
| **Text Align** | center |
| **Color (all segments)** | `#299D91` |

---

## 4. Form Section (Input Section)

* **Semantic HTML:** `<form>`

| Property | Value |
| :--- | :--- |
| **Width** | 400px (hug) |
| **Layout** | `flex-direction: column` |
| **Gap** | 24px (between form groups, divider, and Google button) |
| **Alignment (cross-axis)** | center |

---

### 4.1 Email Address Field

* **Semantic HTML:** `<div class="form-group">`

| Property | Value |
| :--- | :--- |
| **Layout** | `flex-direction: column` |
| **Gap** | 8px (label → input) |

#### Label
```html
<label for="email">Email Address</label>
```

| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 500 (Medium) |
| **Font Size** | 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0 |
| **Text Align** | left |
| **Color** | `#191D23` |
| **Width** | 342px (hug) |

#### Input Field
```html
<input type="email" id="email" placeholder="johndoe@email.com" />
```

| Property | Value |
| :--- | :--- |
| **Width** | 400px (fixed) |
| **Height** | 48px (fixed) |
| **Border** | 1px solid `#4B5768` (focused/active state) |
| **Border Radius** | 8px |
| **Padding** | 12px 16px (top/bottom: 12px, left/right: 16px) |
| **Background** | transparent |

**Placeholder / Input Text:**

| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 400 (Regular) |
| **Font Size** | 16px |
| **Line Height** | 22px |
| **Color** | `#4B5768` |
| **Text Align** | left |

---

### 4.2 Password Field

* **Semantic HTML:** `<div class="form-group">`

| Property | Value |
| :--- | :--- |
| **Layout** | `flex-direction: column` |
| **Gap** | 8px (header → input) |

#### Header Row
```html
<div class="form-group__header">
```

| Property | Value |
| :--- | :--- |
| **Layout** | `flex-direction: row; justify-content: space-between; align-items: center;` |
| **Width** | 400px (fixed) |
| **Height** | hug (24px) |

* **Left — Label:**
  ```html
  <label for="password">Password</label>
  ```
  | Property | Value |
  | :--- | :--- |
  | **Font Family** | Inter |
  | **Font Weight** | 500 (Medium) |
  | **Font Size** | 16px |
  | **Line Height** | 24px |
  | **Letter Spacing** | 0 |
  | **Color** | `#191D23` |
  | **Text Align** | left |

* **Right — Forgot Password Link:**
  ```html
  <a href="/forgot-password">Forgot Password?</a>
  ```
  | Property | Value |
  | :--- | :--- |
  | **Font Family** | Inter |
  | **Font Weight** | 500 (Medium) |
  | **Font Size** | 12px |
  | **Line Height** | 16px |
  | **Letter Spacing** | 0 |
  | **Color** | `#299D91` |
  | **Text Align** | right |

#### Input Field
```html
<input type="password" id="password" />
```

| Property | Value |
| :--- | :--- |
| **Width** | 400px (fixed) |
| **Height** | 48px (fixed) |
| **Border** | 1px solid `#D0D5DD` (default state) |
| **Border Radius** | 8px |
| **Padding** | 12px 16px |
| **Layout** | `flex-direction: row; justify-content: space-between; align-items: flex-start;` |
| **Background** | transparent |

**Password Mask Text (visual representation):**

| Property | Value |
| :--- | :--- |
| **Characters** | ●●●●●●●●●●●●●● (masked dots) |
| **Font Family** | Inter |
| **Font Weight** | 400 (Regular) |
| **Font Size** | 4px (visual dot rendering — actual `type="password"` handles this natively) |
| **Line Height** | 24px |
| **Color** | `#999DA3` |

**Toggle Visibility Icon (Eye):**
```html
<button type="button" class="password-toggle" aria-label="Toggle password visibility">
```

| Property | Value |
| :--- | :--- |
| **Dimensions** | 24 × 24px |
| **Position** | right side of input |
| **Icon stroke color** | `#999DA3` (rgb: 153, 157, 163) |
| **Stroke weight** | 2px |
| **Fill** | none (stroke-only vectors) |

---

### 4.3 Remember Me & Login Button Block

* **Semantic HTML:** `<div class="form-actions">`

| Property | Value |
| :--- | :--- |
| **Layout** | `flex-direction: column` |
| **Gap** | 16px (checkbox → button) |

#### Checkbox — "Keep me signed in"
```html
<label class="checkbox">
  <input type="checkbox" checked />
  <span>Keep me signed in</span>
</label>
```

| Property | Value |
| :--- | :--- |
| **Layout** | `flex-direction: row; align-items: center;` |
| **Gap** | 16px (checkbox → text) |

**Checkbox Tick (Active / Checked State):**

| Property | Value |
| :--- | :--- |
| **Dimensions** | 20 × 20px |
| **Background** | `#299D91` (filled when checked) |
| **Border Radius** | 2px |
| **Checkmark color** | `#FFFFFF` (white vector) |
| **Checkmark dimensions** | 15 × 11px (centered inside) |

**Checkbox Label Text:**

| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 300 (Light) |
| **Font Size** | 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0 |
| **Color** | `#191D23` |
| **Text Align** | left |

> ⚠️ **Note for implementers:** The Figma source has `fill: #FFFFFF` on this text node which is likely a component-variant artifact. In the live design the text is clearly legible against the light gray background. Use your body text color (`#191D23` or equivalent).

#### Primary Button — "Login"
```html
<button type="submit">Login</button>
```

| Property | Value |
| :--- | :--- |
| **Variant** | Primary |
| **Width** | 400px (fixed) |
| **Height** | 48px (fixed) |
| **Background** | `#299D91` |
| **Border Radius** | 4px |
| **Border** | none |
| **Padding** | 12px 16px (top/bottom: 12px, left/right: 16px) |
| **Layout** | `flex; justify-content: center; align-items: center;` |

**Button Label:**

| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 600 (Semi Bold) |
| **Font Size** | 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0 |
| **Color** | `#FFFFFF` |
| **Text Align** | center |

---

### 4.4 Divider — "or sign in with"

```html
<div class="divider">
  <hr />
  <span>or sign in with</span>
</div>
```

**Horizontal Line:**

| Property | Value |
| :--- | :--- |
| **Width** | 342px (spans from edge to edge behind the text) |
| **Stroke** | 0.5px solid `#4B5768` at opacity: 0.25 → effective color: `rgba(75, 87, 104, 0.25)` |

**Text Badge ("or sign in with"):**

| Property | Value |
| :--- | :--- |
| **Background** | `#F4F5F7` (matches page bg to "cut" the line) |
| **Padding** | 8px (all sides) |
| **Font Family** | Inter |
| **Font Weight** | 400 (Regular) |
| **Font Size** | 14px |
| **Line Height** | 20px |
| **Letter Spacing** | 0 |
| **Color** | `#999DA3` |
| **Text Align** | center |

> **Implementation pattern:** Use a centered `<span>` over a `<hr>`, with the span given a matching background color to mask the line behind it. Or use flex with two `<hr>` segments flanking the text.

---

### 4.5 Secondary Button — "Continue with Google"

```html
<button type="button" class="btn-secondary">
  <img src="/icons/google.svg" alt="Google" />
  Continue with Google
</button>
```

| Property | Value |
| :--- | :--- |
| **Variant** | Secondary |
| **Width** | 400px (fixed) |
| **Height** | 48px (fixed) |
| **Background** | `#E4E7EB` |
| **Border Radius** | 4px |
| **Border** | none |
| **Padding** | 12px 69px (top/bottom: 12px, left/right: 69px) |
| **Layout** | `flex; justify-content: center; align-items: center;` |
| **Gap** | 16px (icon → text) |

**Google Icon:**

| Property | Value |
| :--- | :--- |
| **Dimensions** | 24 × 24px (standard Google "G" logo, multi-color) |
| **Position** | left of text |

**Button Text:**

| Property | Value |
| :--- | :--- |
| **Font Family** | Inter |
| **Font Weight** | 400 (Regular) |
| **Font Size** | 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0 |
| **Color** | `#4B5768` |
| **Text Align** | center |

---

## 5. "Create an account" Link

```html
<a href="/signup">Create an account</a>
```

| Property | Value |
| :--- | :--- |
| **Spacing from form block** | 40px (from parent container gap) |
| **Width** | 400px (full container width) |
| **Font Family** | Inter |
| **Font Weight** | 600 (Semi Bold) |
| **Font Size** | 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0 |
| **Color** | `#299D91` |
| **Text Align** | center |

---

## 6. Component States Summary

### Input Fields

| State | Border Color | Text Color | Background |
| :--- | :--- | :--- | :--- |
| **Default** | `#D0D5DD` | — | transparent |
| **Focused / Active** | `#4B5768` | `#4B5768` | transparent |
| **Error** *(inferred, not shown)* | `#EF4444` | `#EF4444` *(helper text below)* | transparent |
| **Disabled** *(inferred)* | `#E4E7EB` | `#999DA3` | `#F9FAFB` |

### Primary Button

| State | Background | Text Color |
| :--- | :--- | :--- |
| **Default** | `#299D91` | `#FFFFFF` |
| **Hover** *(inferred)* | `#238A7F` *(darken ~10%)* | `#FFFFFF` |
| **Active / Pressed** *(inferred)* | `#1D7A70` *(darken ~15%)* | `#FFFFFF` |
| **Disabled** *(inferred)* | `#299D91` at opacity: 0.5 | `#FFFFFF` |

### Secondary Button

| State | Background | Text Color |
| :--- | :--- | :--- |
| **Default** | `#E4E7EB` | `#4B5768` |
| **Hover** *(inferred)* | `#D0D5DD` | `#4B5768` |

### Checkbox

| State | Background | Border |
| :--- | :--- | :--- |
| **Unchecked** | transparent | 1px solid `#D0D5DD` |
| **Checked** | `#299D91` | none |

### Links (Forgot Password?, Create an account)

| State | Color |
| :--- | :--- |
| **Default** | `#299D91` |
| **Hover** *(inferred)* | `#238A7F` or underline |

---

## 7. Design Tokens / Color Palette

| Token Name (suggested) | HEX | Usage |
| :--- | :--- | :--- |
| `--color-primary` | `#299D91` | Brand, buttons, links, checkbox active |
| `--color-bg-page` | `#F4F5F7` | Page background |
| `--color-text-primary` | `#191D23` | Labels, headings |
| `--color-text-secondary` | `#4B5768` | Placeholder text, secondary button text, focused input border |
| `--color-text-muted` | `#999DA3` | Divider text, password dots, eye icon |
| `--color-border-default` | `#D0D5DD` | Default input borders |
| `--color-border-focus` | `#4B5768` | Focused input border |
| `--color-btn-secondary-bg` | `#E4E7EB` | Google button background |
| `--color-white` | `#FFFFFF` | Button text, checkmark |

---

## 8. Typography Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Logo (bold)** | Poppins | 800 | 40px | 32px | 8% |
| **Brand Logo (light)** | Poppins | 500 | 40px | 32px | 8% |
| **Input Label** | Inter | 500 | 16px | 24px | 0 |
| **Input Value / Placeholder** | Inter | 400 | 16px | 22px | 0 |
| **Button Primary Label** | Inter | 600 | 16px | 24px | 0 |
| **Button Secondary Label** | Inter | 400 | 16px | 24px | 0 |
| **Checkbox Label** | Inter | 300 | 16px | 24px | 0 |
| **Small Link (Forgot Pwd)** | Inter | 500 | 12px | 16px | 0 |
| **Divider Text** | Inter | 400 | 14px | 20px | 0 |
| **CTA Link (Create acct)** | Inter | 600 | 16px | 24px | 0 |

---

## 9. Spacing & Layout Summary (px)

```text
Page:        1440 × 1024, bg #F4F5F7
  └─ Card:   400w, centered ~(520, 160)
     ├─ [gap 64px]
     │  ├─ Logo (276 × 32, centered)
     │  └─ Form Section (400w)
     │     ├─ [gap 32px within login group]
     │     │  ├─ Email Group (gap 8: label → input)
     │     │  │   └─ Input: 400×48, radius 8, pad 12/16
     │     │  ├─ [gap 24px]
     │     │  ├─ Password Group (gap 8: header → input)
     │     │  │   └─ Header: space-between, Input: 400×48
     │     │  ├─ [gap 32px]
     │     │  └─ Actions (gap 16)
     │     │      ├─ Checkbox row (gap 16: tick → text)
     │     │      └─ Login btn: 400×48, radius 4
     │     ├─ [gap 24px]
     │     ├─ Divider: line 342w behind centered text
     │     ├─ [gap 24px]
     │     └─ Google btn: 400×48, radius 4
     ├─ [gap 40px]
     └─ "Create an account" link (centered)
```
