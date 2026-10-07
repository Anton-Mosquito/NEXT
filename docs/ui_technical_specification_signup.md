# UI Technical Specification — Signup (Registration) Screen

---

## 1. Page-Level Container

| Property             | Value                                                       |
| :------------------- | :---------------------------------------------------------- |
| **Semantic HTML**    | `<body>` or `<div class="page-wrapper">`                    |
| **Width**            | `100vw` (design ref: `1440px`)                              |
| **Min-Height**       | `100vh` (design ref: `1024px`)                              |
| **Background Color** | `#F4F5F7`                                                   |
| **Display**          | `flex`                                                      |
| **Justify-Content**  | `center`                                                    |
| **Align-Items**      | `flex-start`                                                |
| **Padding-Top**      | `160px` (card is positioned at `y:160` in a `1024px` frame) |

---

## 2. Card Container (Form Wrapper)

| Property           | Value                            |
| :----------------- | :------------------------------- |
| **Semantic HTML**  | `<main>`                         |
| **Width**          | `400px`                          |
| **Display**        | `flex`                           |
| **Flex-Direction** | `column`                         |
| **Gap**            | `40px`                           |
| **Padding**        | `0`                              |
| **Background**     | `transparent` (inherits page bg) |
| **Border**         | None                             |
| **Border-Radius**  | `0`                              |

---

## 3. Upper Section (Logo + Form Fields + Buttons)

| Property           | Value    |
| :----------------- | :------- |
| **Semantic HTML**  | `<div>`  |
| **Display**        | `flex`   |
| **Flex-Direction** | `column` |
| **Gap**            | `64px`   |
| **Width**          | `400px`  |

---

## 4. Logo / Brand Mark

| Property           | Value                                                              |
| :----------------- | :----------------------------------------------------------------- |
| **Semantic HTML**  | `<a href="/">` wrapping an `<h1>` or `<span>`                      |
| **Text Content**   | FINEbank.IO                                                        |
| **Text Alignment** | `center`                                                           |
| **Width**          | `276px` (centered within `400px` container → `align-self: center`) |

### 4.1 Logo Typography (Mixed Styles)

The logo uses two distinct font treatments within the same text node:

| Characters    | Font Family | Font Weight     | Font Size | Letter-Spacing |
| :------------ | :---------- | :-------------- | :-------- | :------------- |
| **FINE + IO** | Poppins     | 800 (ExtraBold) | `40px`    | 8% (~0.08em)   |
| **bank.**     | Poppins     | 500 (Medium)    | `40px`    | 8% (~0.08em)   |

| Property        | Value     |
| :-------------- | :-------- |
| **Line-Height** | `32px`    |
| **Color**       | `#299D91` |

> **Implementation Note:** Use two `<span>` elements within the heading to apply different font-weight values to **FINE/IO** (ExtraBold 800) vs **bank.** (Medium 500).

---

## 5. Heading

| Property           | Value                            |
| :----------------- | :------------------------------- |
| **Semantic HTML**  | `<h2>`                           |
| **Text Content**   | Create an account                |
| **Font Family**    | Inter                            |
| **Font Weight**    | 600 (Semi Bold)                  |
| **Font Size**      | `16px`                           |
| **Line-Height**    | `24px`                           |
| **Letter-Spacing** | `0`                              |
| **Text Align**     | `center`                         |
| **Color**          | `#299D91`                        |
| **Width**          | `100%` (fills `400px` container) |

> **Note:** In the signup screenshot, the heading text reads "Create an account". On the Login variant, it reads "Create an account" as well (shared component). Adjust text for context.

---

## 6. Form Section

| Property           | Value    |
| :----------------- | :------- |
| **Semantic HTML**  | `<form>` |
| **Display**        | `flex`   |
| **Flex-Direction** | `column` |
| **Gap**            | `24px`   |
| **Width**          | `400px`  |

### 6.1 Input Fields Group

| Property           | Value    |
| :----------------- | :------- |
| **Display**        | `flex`   |
| **Flex-Direction** | `column` |
| **Gap**            | `24px`   |

The signup form includes 3 input fields (vs 2 on Login):
1. Name
2. Email Address
3. Password

### 6.2 Individual Field Container (Repeated Pattern)

| Property           | Value                                            |
| :----------------- | :----------------------------------------------- |
| **Semantic HTML**  | `<div class="form-field">`                       |
| **Display**        | `flex`                                           |
| **Flex-Direction** | `column`                                         |
| **Gap**            | `8px`                                            |
| **Width**          | `400px`                                          |
| **Height**         | `80px` (label `24px` + gap `8px` + input `48px`) |

### 6.3 Field Label

| Property          | Value               |
| :---------------- | :------------------ |
| **Semantic HTML** | `<label for="...">` |
| **Font Family**   | Inter               |
| **Font Weight**   | 500 (Medium)        |
| **Font Size**     | `16px`              |
| **Line-Height**   | `24px`              |
| **Color**         | `#191D23`           |
| **Text Align**    | `left`              |

#### Label Values per Field

| Field        | Label Text    |
| :----------- | :------------ |
| **Name**     | Name          |
| **Email**    | Email Address |
| **Password** | Password      |

### 6.4 Text Input Field

| Property          | Value                                                                      |
| :---------------- | :------------------------------------------------------------------------- |
| **Semantic HTML** | `<input type="text">` / `<input type="email">` / `<input type="password">` |
| **Width**         | `400px` (100% of parent)                                                   |
| **Height**        | `48px`                                                                     |
| **Padding**       | `12px 16px`                                                                |
| **Background**    | `transparent` (no fill)                                                    |
| **Border**        | `1px solid #D0D5DD`                                                        |
| **Border-Radius** | `8px`                                                                      |
| **Display**       | `flex`                                                                     |
| **Align-Items**   | `center`                                                                   |

#### Input Text (Placeholder / Value)

| Property              | Value         |
| :-------------------- | :------------ |
| **Font Family**       | Inter         |
| **Font Weight**       | 400 (Regular) |
| **Font Size**         | `16px`        |
| **Line-Height**       | `22px`        |
| **Placeholder Color** | `#4B5768`     |
| **Value Color**       | `#191D23`     |

#### Placeholder Text per Field

| Field        | Placeholder             | Input Type |
| :----------- | :---------------------- | :--------- |
| **Name**     | Tanzir Rahman (example) | `text`     |
| **Email**    | hello@example.com       | `email`    |
| **Password** | ••••••••••••            | `password` |

> **Note:** The Email input on Login uses a darker stroke `#4B5768`; the Password input uses `#D0D5DD`. The Signup form appears to use consistent `#D0D5DD` borders for all fields based on visual inspection. Use `#D0D5DD` as default and `#4B5768` for focused state.

### 6.5 Password Field — Eye/Toggle Icon

| Property                | Value                                                                                 |
| :---------------------- | :------------------------------------------------------------------------------------ |
| **Semantic HTML**       | `<button type="button" aria-label="Toggle password visibility">` inside input wrapper |
| **Icon Container Size** | `24 × 24px`                                                                           |
| **Icon Stroke Color**   | `#999DA3`                                                                             |
| **Position**            | Right-aligned inside input, `right: 16px`, vertically centered                        |
| **Cursor**              | `pointer`                                                                             |

---

## 7. Terms of Service Text

| Property          | Value                                             |
| :---------------- | :------------------------------------------------ |
| **Semantic HTML** | `<p>` with an inner `<a>`                         |
| **Text Content**  | By continuing, you agree to our terms of service. |
| **Font Family**   | Inter                                             |
| **Font Weight**   | 400 (Regular)                                     |
| **Font Size**     | `12px`                                            |
| **Line-Height**   | `18px` (approx)                                   |
| **Color**         | `#999DA3`                                         |
| **Text Align**    | `left`                                            |
| **Margin-Top**    | `0` (within the `24px` gap flow of the form)      |

### 7.1 "terms of service" Link

| Property            | Value                               |
| :------------------ | :---------------------------------- |
| **Semantic HTML**   | `<a href="/terms">`                 |
| **Color**           | `#999DA3`                           |
| **Text Decoration** | `underline` (visible in screenshot) |
| **Cursor**          | `pointer`                           |
| **Hover Color**     | `#299D91` (suggested)               |

---

## 8. Primary Button — "Sign up"

| Property             | Value                    |
| :------------------- | :----------------------- |
| **Semantic HTML**    | `<button type="submit">` |
| **Width**            | `400px` (100%)           |
| **Height**           | `48px`                   |
| **Padding**          | `16px 12px`              |
| **Background Color** | `#299D91`                |
| **Border**           | None                     |
| **Border-Radius**    | `4px`                    |
| **Cursor**           | `pointer`                |
| **Display**          | `flex`                   |
| **Justify-Content**  | `center`                 |
| **Align-Items**      | `center`                 |

### 8.1 Button Label

| Property         | Value           |
| :--------------- | :-------------- |
| **Text Content** | Sign up         |
| **Font Family**  | Inter           |
| **Font Weight**  | 600 (Semi Bold) |
| **Font Size**    | `16px`          |
| **Line-Height**  | `24px`          |
| **Color**        | `#FFFFFF`       |
| **Text Align**   | `center`        |

### 8.2 Button States

| State              | Background              | Text Color | Border                           | Additional            |
| :----------------- | :---------------------- | :--------- | :------------------------------- | :-------------------- |
| **Default**        | `#299D91`               | `#FFFFFF`  | None                             | —                     |
| **Hover**          | `#238B80` (darken ~5%)  | `#FFFFFF`  | None                             | `cursor: pointer`     |
| **Active/Pressed** | `#1D7A70` (darken ~10%) | `#FFFFFF`  | None                             | —                     |
| **Focus**          | `#299D91`               | `#FFFFFF`  | `2px solid #299D91` + 2px offset | Outline ring          |
| **Disabled**       | `#299D91` @ 50% opacity | `#FFFFFF`  | None                             | `cursor: not-allowed` |

---

## 9. Divider — "or sign up with"

| Property            | Value                                                 |
| :------------------ | :---------------------------------------------------- |
| **Semantic HTML**   | `<div class="divider">`                               |
| **Width**           | `400px` (line spans full width; text overlays center) |
| **Height**          | `36px`                                                |
| **Display**         | `flex`                                                |
| **Align-Items**     | `center`                                              |
| **Justify-Content** | `center`                                              |
| **Position**        | `relative`                                            |

### 9.1 Divider Line

| Property          | Value                                                 |
| :---------------- | :---------------------------------------------------- |
| **Semantic HTML** | CSS `::before` + `::after` pseudo-elements, or `<hr>` |
| **Width**         | `100%` (342px total across full card width)           |
| **Height**        | `0`                                                   |
| **Border-Top**    | `0.5px solid #4B5768`                                 |
| **Opacity**       | `0.25`                                                |

### 9.2 Divider Text

| Property          | Value                                           |
| :---------------- | :---------------------------------------------- |
| **Semantic HTML** | `<span>`                                        |
| **Text Content**  | or sign up with                                 |
| **Font Family**   | Inter                                           |
| **Font Weight**   | 400 (Regular)                                   |
| **Font Size**     | `14px`                                          |
| **Color**         | `#999DA3`                                       |
| **Background**    | `#F4F5F7` (matches page bg to "break" the line) |
| **Padding**       | `0 8px`                                         |

---

## 10. Secondary Button — "Continue with Google"

| Property             | Value                                         |
| :------------------- | :-------------------------------------------- |
| **Semantic HTML**    | `<button type="button">`                      |
| **Width**            | `400px` (100%)                                |
| **Height**           | `48px`                                        |
| **Padding**          | `12px 69px` (auto-centered content with flex) |
| **Background Color** | `#E4E7EB`                                     |
| **Border**           | None                                          |
| **Border-Radius**    | `4px`                                         |
| **Display**          | `flex`                                        |
| **Justify-Content**  | `center`                                      |
| **Align-Items**      | `center`                                      |
| **Gap**              | `16px` (between icon and text)                |
| **Cursor**           | `pointer`                                     |

### 10.1 Google Icon

| Property          | Value                                                      |
| :---------------- | :--------------------------------------------------------- |
| **Semantic HTML** | `<img src="google-icon.svg" alt="Google" />` or inline SVG |
| **Size**          | `24 × 24px`                                                |
| **Position**      | Left of label text                                         |

### 10.2 Google Button Label

| Property         | Value                |
| :--------------- | :------------------- |
| **Text Content** | Continue with Google |
| **Font Family**  | Inter                |
| **Font Weight**  | 400 (Regular)        |
| **Font Size**    | `16px`               |
| **Line-Height**  | `24px`               |
| **Color**        | `#4B5768`            |

### 10.3 Button States

| State              | Background             | Text Color | Additional                       |
| :----------------- | :--------------------- | :--------- | :------------------------------- |
| **Default**        | `#E4E7EB`              | `#4B5768`  | —                                |
| **Hover**          | `#D0D5DD` (darken ~5%) | `#4B5768`  | `cursor: pointer`                |
| **Active/Pressed** | `#C0C5CC`              | `#4B5768`  | —                                |
| **Focus**          | `#E4E7EB`              | `#4B5768`  | `2px solid #299D91` outline ring |

---

## 11. Footer Link — "Already have an account? Sign in here"

| Property          | Value                                 |
| :---------------- | :------------------------------------ |
| **Semantic HTML** | `<p>` with inner `<a>`                |
| **Text Content**  | Already have an account? Sign in here |
| **Font Family**   | Inter                                 |
| **Font Weight**   | 400 (Regular)                         |
| **Font Size**     | `14px`                                |
| **Line-Height**   | `20px`                                |
| **Color**         | `#999DA3`                             |
| **Text Align**    | `center`                              |
| **Width**         | `100%`                                |

### 11.1 "Sign in here" Link

| Property            | Value               |
| :------------------ | :------------------ |
| **Semantic HTML**   | `<a href="/login">` |
| **Color**           | `#299D91`           |
| **Font Weight**     | 600 (Semi Bold)     |
| **Text Decoration** | `underline`         |
| **Cursor**          | `pointer`           |
| **Hover Color**     | `#238B80`           |

---

## 12. Form Validation / Error States

### 12.1 Input Error State

| Property         | Value                          |
| :--------------- | :----------------------------- |
| **Border Color** | `#EF4444` (replaces `#D0D5DD`) |
| **Border Width** | `1px`                          |
| **Error Text**   | Displayed below input          |

### 12.2 Error Helper Text

| Property          | Value                                       |
| :---------------- | :------------------------------------------ |
| **Semantic HTML** | `<span class="error-message" role="alert">` |
| **Font Family**   | Inter                                       |
| **Font Weight**   | 400 (Regular)                               |
| **Font Size**     | `12px`                                      |
| **Line-Height**   | `16px`                                      |
| **Color**         | `#EF4444`                                   |
| **Margin-Top**    | `4px`                                       |

### 12.3 Input Focus State

| Property         | Value                                                      |
| :--------------- | :--------------------------------------------------------- |
| **Border Color** | `#299D91` (brand primary)                                  |
| **Border Width** | `1px`                                                      |
| **Box-Shadow**   | `0 0 0 2px rgba(41, 157, 145, 0.2)` (suggested focus ring) |
| **Outline**      | `none` (replaced by box-shadow)                            |

---

## 13. Design Tokens Summary

### Colors

| Token Name                 | HEX       | Usage                                            |
| :------------------------- | :-------- | :----------------------------------------------- |
| `--color-bg-page`          | `#F4F5F7` | Page background                                  |
| `--color-primary`          | `#299D91` | Logo, heading, primary button, links, focus ring |
| `--color-primary-hover`    | `#238B80` | Button/link hover                                |
| `--color-primary-active`   | `#1D7A70` | Button pressed                                   |
| `--color-text-primary`     | `#191D23` | Labels, headings                                 |
| `--color-text-secondary`   | `#4B5768` | Placeholder text, Google button text             |
| `--color-text-muted`       | `#999DA3` | Divider text, terms text, eye icon               |
| `--color-text-white`       | `#FFFFFF` | Primary button text                              |
| `--color-border-default`   | `#D0D5DD` | Input borders                                    |
| `--color-border-strong`    | `#4B5768` | Divider line, focused input variant              |
| `--color-btn-secondary-bg` | `#E4E7EB` | Google button background                         |
| `--color-error`            | `#EF4444` | Validation error border + text                   |
| `--color-checkbox-fill`    | `#299D91` | Checkbox checked state                           |

### Typography

| Token                | Font    | Weight | Size   | Line-Height |
| :------------------- | :------ | :----- | :----- | :---------- |
| `--font-logo-bold`   | Poppins | 800    | `40px` | `32px`      |
| `--font-logo-medium` | Poppins | 500    | `40px` | `32px`      |
| `--font-heading`     | Inter   | 600    | `16px` | `24px`      |
| `--font-label`       | Inter   | 500    | `16px` | `24px`      |
| `--font-input`       | Inter   | 400    | `16px` | `22px`      |
| `--font-body-sm`     | Inter   | 400    | `14px` | `20px`      |
| `--font-caption`     | Inter   | 400    | `12px` | `18px`      |
| `--font-button`      | Inter   | 600    | `16px` | `24px`      |
| `--font-link-sm`     | Inter   | 500    | `12px` | `16px`      |

### Spacing

| Token                     | Value  | Usage                                 |
| :------------------------ | :----- | :------------------------------------ |
| `--space-field-gap`       | `8px`  | Label to input gap                    |
| `--space-input-padding-x` | `16px` | Input horizontal padding              |
| `--space-input-padding-y` | `12px` | Input vertical padding                |
| `--space-fields-gap`      | `24px` | Between form field groups             |
| `--space-section-gap`     | `32px` | Between inputs group and button group |
| `--space-form-to-divider` | `24px` | Form section internal gap             |
| `--space-card-gap`        | `40px` | Between card major sections           |
| `--space-logo-to-form`    | `64px` | Logo to form section gap              |

### Radii

| Token               | Value | Usage                         |
| :------------------ | :---- | :---------------------------- |
| `--radius-input`    | `8px` | Input fields                  |
| `--radius-button`   | `4px` | Buttons (primary & secondary) |
| `--radius-checkbox` | `2px` | Checkbox tick box             |

### Sizes

| Token                  | Value   | Usage                 |
| :--------------------- | :------ | :-------------------- |
| `--size-input-height`  | `48px`  | All text inputs       |
| `--size-button-height` | `48px`  | All buttons           |
| `--size-icon`          | `24px`  | Eye icon, Google icon |
| `--size-checkbox`      | `20px`  | Checkbox tick box     |
| `--size-card-width`    | `400px` | Form card max-width   |

---

## 14. Responsive Considerations

| Breakpoint  | Behavior                                                                       |
| :---------- | :----------------------------------------------------------------------------- |
| **≥ 768px** | Card fixed at `400px`, horizontally centered, `padding-top: 160px`             |
| **< 768px** | Card fills width with `padding: 24px`, `max-width: 400px`, `padding-top: 80px` |
| **< 480px** | Reduce logo font-size to `32px`, maintain all other proportions                |
