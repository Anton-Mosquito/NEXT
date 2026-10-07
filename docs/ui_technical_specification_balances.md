# UI Technical Specification — Balances

## 1. Source Metadata

| Property                   | Value                                    |
| -------------------------- | ---------------------------------------- |
| **Node type**              | Frame                                    |
| **Dimensions**             | 1104px × 656px                           |
| **Position in screen**     | x: 304px; y: 104px                       |
| **Screen dimensions**      | 1440px × 1024px                          |
| **Screen background**      | `#F4F5F7`                                |
| **Layout sizing**          | Hug content horizontally and vertically  |
| **Clipping**               | Disabled                                 |
| **Variables**              | None                                     |
| **Responsive constraints** | Left/top anchored; no min/max dimensions |

## 2. Screen Placement

```css
.balances {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  width: 1104px;
  height: 656px;
  margin: 104px 32px 264px 304px;
  padding: 0;
}
```

## 3. Hierarchy

```text
Balances
├── Section heading
└── Accounts area
    ├── Row 1
    │   ├── Credit Card
    │   ├── Checking
    │   └── Savings
    └── Row 2
        ├── Investment
        ├── Loan
        └── Add/Edit Accounts
```

## 4. Section Heading

**Content:** `Balances`

```css
.balances__heading {
  width: 94px;
  height: 32px;
  margin: 0;

  font-family: "Inter", sans-serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
}
```

* **Typography style:** Header 22-32
* **Paint style:** Gray/02

## 5. Accounts Grid

```css
.accounts-grid {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;

  width: 1104px;
  height: 608px;
  padding: 0;
}
```

### Grid Geometry

* **Columns:** Three fixed columns of 352px.
* **Column gap:** 24px.
* **Rows:** Two fixed rows of 288px.
* **Row gap:** 32px.
* **First row position:** x: 0px; y: 0px.
* **Second row position:** x: 0px; y: 320px.

## 6. Shared Account Card

*Applies to Credit Card, Checking, Savings, Investment, and Loan.*

```css
.account-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  width: 352px;
  height: 288px;
  padding: 24px;
}
```

* **Component key:** `2af018a1c8e2141d94bde549b0802d6b452269da`
* **Component properties/variants:** None
* **Fill style:** White
* **Effect style:** Shadow 01

## 7. Account Card Header

```css
.account-card__header {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 304px;
  height: 44px;
  padding: 0 0 12px;
}
```

* **Card-relative position:** x: 24px; y: 24px.
* **Layout note:** Source auto-layout records 68px item spacing; rendered positioning is controlled by `space-between`.

### Card Title

```css
.account-card__title {
  margin: 0;

  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: 0;
  text-align: left;
}
```

* **Typography style:** Bold 16-24
* **Paint style:** Gray/02

### Institution Text

```css
.account-card__institution {
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0;
  text-align: right;
  text-transform: none;
  text-decoration: none;
}
```

* **Wrapper details:** Institution text uses a 32px-high wrapper with 8px top and bottom padding.
* **Paint style:** Gray/01

## 8. Account Card Content

```css
.account-card__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  width: 304px;
  height: 180px;
  padding: 0;
}
```

* **Content position:** x: 24px; y: 84px.

### Account Number Group

```css
.account-card__number-group {
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 304px;
  height: 52px;
}
```

### Amount Group

```css
.account-card__amount-group {
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 125px;
  height: 52px;
}
```

* **Typography style (Number & Amount):** Semibold 20-28
* **Paint style (Number & Amount):** Default Black

### Metadata Labels

```css
.account-card__label {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0;
  text-align: left;
  text-transform: none;
  text-decoration: none;
}
```

| Label             | Dimensions   | Content          |
| ----------------- | ------------ | ---------------- |
| **Account label** | 128px × 20px | `Account Number` |
| **Amount label**  | 125px × 20px | `Total amount`   |

* **Typography style:** Regular 14-20
* **Paint style:** Gray/03

## 9. Account Card Footer

```css
.account-card__footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 303px;
  height: 36px;
  padding: 0;
}
```

* **Position within content:** x: 0px; y: 144px.
* **Layout note:** Source records an 80px item gap; final placement uses `space-between`.

### Remove Action

* **Content:** `Remove`

```css
.account-card__remove {
  width: 116px;
  height: 24px;
  padding: 0;
  margin: 0;

  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}
```

* **Variant classification:** Text/ghost action.
* **Interactions:** No interaction or alternate state is defined in the source.

### Details Button

```css
.account-card__details-button {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  width: 110px;
  height: 36px;
  padding: 8px 20px;
}
```

* **Variant:** Primary compact.
* **Button position:** x: 193px; y: 0px.
* **Paint style:** Primary color.

#### Details Label

```css
.account-card__details-label {
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0;
  text-align: left;
  text-transform: capitalize;
  text-decoration: none;
}
```

* **Exact content:** `Details.`
* **Dimensions:** 46px × 20px.
* **Typography style:** Medium 14-20.

#### Chevron Icon

* **Icon container:** 16px × 16px.
* **Position in button:** x: 74px; y: 10px.
* **Vector position in icon:** x: 6px; y: 4px.
* **Vector dimensions:** 4px × 8px.
* **Fill:** `none`.
* **Stroke:** `1.5px solid #FFFFFF`, centered.
* **Container:** Clips its content.

## 10. Per-Card Data

| Card            | Grid position   | Title                         | Institution    | Media           | Account number        | Amount   |
| --------------- | --------------- | ----------------------------- | -------------- | --------------- | --------------------- | -------- |
| **Credit Card** | Column 1, row 1 | Credit Card                   | Master Card    | Mastercard logo | `3388 4556 8860 8***` | `$25000` |
| **Checking**    | Column 2, row 1 | Checking                      | AB Bank Ltd    | Visa logo       | `693 456 69 9****`    | `$25000` |
| **Savings**     | Column 3, row 1 | Savings *(Source: `savings`)* | Brac Bank Ltd. | None            | `133 456 886 8****`   | `$25000` |
| **Investment**  | Column 1, row 2 | Investment                    | AB Bank Ltd    | None            | `698 456 866 2****`   | `$25000` |
| **Loan**        | Column 2, row 2 | Loan                          | City Bank Ltd. | None            | `363 456 896 6****`   | `$25000` |

### Card Positions Relative to Balances Frame

| Card                  | X     | Y     | Width | Height |
| --------------------- | ----- | ----- | ----- | ------ |
| **Credit Card**       | 0px   | 48px  | 352px | 288px  |
| **Checking**          | 376px | 48px  | 352px | 288px  |
| **Savings**           | 752px | 48px  | 352px | 288px  |
| **Investment**        | 0px   | 368px | 352px | 288px  |
| **Loan**              | 376px | 368px | 352px | 288px  |
| **Add/Edit Accounts** | 752px | 368px | 352px | 288px  |

## 11. Card Header Overrides

| Card            | Title dimensions | Type-area position | Type-area dimensions |
| --------------- | ---------------- | ------------------ | -------------------- |
| **Credit Card** | 90px × 24px      | x: 181px; y: 0px   | 123px × 32px         |
| **Checking**    | 75px × 24px      | x: 182px; y: 0px   | 122px × 32px         |
| **Savings**     | 63px × 24px      | x: 221px; y: 0px   | 83px × 32px          |
| **Investment**  | 89px × 24px      | x: 234px; y: 0px   | 70px × 32px          |
| **Loan**        | 39px × 24px      | x: 224px; y: 0px   | 80px × 32px          |

## 12. Payment Media Assets

### Mastercard
* **Asset component dimensions:** 48px × 32px.
* **Asset wrapper position:** x: 75px; y: 0px.
* **Image bounds within wrapper:** x: 3px; y: 4px.
* **Image dimensions:** 43px × 24px.
* **Image scale mode:** Fill.
* **Wrapper:** Clips content.
* **Hidden wrapper background:** `#FFFFFF`.

### Visa
* **Asset component dimensions:** 48px × 32px.
* **Asset wrapper position:** x: 74px; y: 0px.
* **Image bounds within wrapper:** x: 1px; y: 9px.
* **Image dimensions:** 46px × 14px.
* **Image scale mode:** Fill.
* **Wrapper:** Clips content.
* **Hidden wrapper background:** `#FFFFFF`.

## 13. Add/Edit Accounts Card

```css
.account-actions-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  width: 352px;
  height: 288px;
}
```

### Actions Group

```css
.account-actions-card__actions {
  display: flex;
  flex-direction: column;
  gap: 4px;

  width: 208px;
  height: 100px;
}
```

* **Position:** x: 72px; y: 100px.

### Add Accounts Button

* **Exact content:** `Add accounts`

```css
.account-actions-card__add {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;

  width: 208px;
  height: 48px;
  padding: 12px 32px;
}
```

* **Variant:** Primary large.
* **Text bounds:** 144px × 24px.
* **Icon / Interaction:** No icon or interaction defined.

### Edit Accounts Action

* **Exact content:** `Edit Accounts`

```css
.account-actions-card__edit {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  width: 208px;
  height: 48px;
  padding: 12px 24px;
}
```

* **Variant classification:** Neutral text/ghost action.
* **Text bounds:** 160px × 24px.
* **Interactions / State:** No interaction defined. Gray appearance is explicit; source does not mark this element as disabled.

## 14. Interactions

### Details Buttons

* **Trigger:** Click.
* **Action:** Navigate to target screen.

| Card Context                                | Transition     | Easing   | Duration | Preserve Scroll Position |
| ------------------------------------------- | -------------- | -------- | -------- | ------------------------ |
| **Credit Card, Checking, Investment, Loan** | None specified | —        | —        | —                        |
| **Savings**                                 | Smart Animate  | ease-out | 300ms    | False                    |

### Other Actions

| Action            | Interaction Present |
| ----------------- | ------------------- |
| **Remove**        | No                  |
| **Add accounts**  | No                  |
| **Edit Accounts** | No                  |

## 15. Component States

No components in this frame define variant-based visual states.

| State        | Details button | Remove        | Add accounts  | Edit Accounts |
| ------------ | -------------- | ------------- | ------------- | ------------- |
| **Default**  | Defined above  | Defined above | Defined above | Defined above |
| **Hover**    | Not defined    | Not defined   | Not defined   | Not defined   |
| **Focus**    | Not defined    | Not defined   | Not defined   | Not defined   |
| **Active**   | Not defined    | Not defined   | Not defined   | Not defined   |
| **Disabled** | Not defined    | Not defined   | Not defined   | Not defined   |
| **Error**    | Not defined    | Not defined   | Not defined   | Not defined   |
| **Loading**  | Not defined    | Not defined   | Not defined   | Not defined   |

> **Note:** No input fields, labels, placeholders, checkboxes, validation messages, helper messages, or form-error treatments are present. Do not infer unspecified state colors, outlines, borders, opacity changes, or helper text.

## 16. Design Tokens

### Colors

| Token              | Value                       | Usage                          |
| ------------------ | --------------------------- | ------------------------------ |
| **Special/BG**     | `#F4F5F7`                   | Screen background              |
| **White**          | `#FFFFFF`                   | Cards, button text             |
| **Gray/02**        | `#878787`                   | Section heading, card titles   |
| **Gray/01**        | `#666666`                   | Institution text               |
| **Default Black**  | `#191919`                   | Account numbers and amounts    |
| **Gray/03**        | `#9F9F9F`                   | Metadata labels, Edit Accounts |
| **Primary color**  | `#299D91`                   | Buttons, Remove action         |
| **Header divider** | `rgba(210, 210, 210, 0.25)` | Card-header bottom border      |
| **Card shadow**    | `rgba(76, 103, 100, 0.10)`  | All six cards                  |

### Typography

| Style                | Font  | Weight | Size | Line height |
| -------------------- | ----- | ------ | ---- | ----------- |
| **Header 22-32**     | Inter | 400    | 22px | 32px        |
| **Bold 16-24**       | Inter | 700    | 16px | 24px        |
| **Institution text** | Inter | 500    | 12px | 16px        |
| **Semibold 20-28**   | Inter | 600    | 20px | 28px        |
| **Regular 14-20**    | Inter | 400    | 14px | 20px        |
| **Regular 16-24**    | Inter | 400    | 16px | 24px        |
| **Medium 14-20**     | Inter | 500    | 14px | 20px        |
| **Medium 16-24**     | Inter | 500    | 16px | 24px        |

*All text uses `letter-spacing: 0`, `font-style: normal`, and no text decoration.*


## 18. Verification Checklist

- [ ] Balances frame is exactly 1104px × 656px.
- [ ] Heading-to-grid gap is exactly 16px.
- [ ] Grid uses three 352px columns and two 288px rows.
- [ ] Horizontal card gap is exactly 24px.
- [ ] Vertical card gap is exactly 32px.
- [ ] All cards use 24px internal padding and 8px radius.
- [ ] All cards use the same shadow.
- [ ] Account card headers are exactly 304px × 44px.
- [ ] Header divider is bottom-only.
- [ ] Account content begins at card-relative x: 24px; y: 84px.
- [ ] Footer is exactly 303px × 36px.
- [ ] Details buttons are exactly 110px × 36px.
- [ ] Add/Edit card preserves 100px top and 88px bottom padding.
- [ ] Exact capitalization, punctuation, masking, and double spaces in account numbers are preserved.
- [ ] No unrepresented hover, focus, disabled, loading, or error styles are introduced.