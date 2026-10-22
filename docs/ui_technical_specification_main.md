# UI Technical Specification — Overview Core Cards

## 1. Scope and Source

### Included
- **Total Balance** section
- **Goals** section
- **Upcoming Bill** section
- **Recent Transaction** section

### Excluded
- Sidebar and top header.
- Statistics.
- Expenses Breakdown.

> The included content consists of editable text, shapes, frames, and component instances. Measurements below are extracted from these elements rather than estimated from screenshots.

### Source Discrepancies to Preserve or Resolve

| Topic | Inspected design |
| :--- | :--- |
| **Overall layout** | Three equal columns across the top; Recent Transaction below the first column. Not a simple two-column arrangement of four cards. |
| **Account amount** | Actual text is `$25000`, without a comma. The request describes `$25,000`. Use `$25000` for source-faithful verification; adding the comma is a content change. |
| **Payment-card logo** | Mastercard is present. No Visa slide or alternate carousel state is defined within the inspected selection. |
| **Large monetary values** | Total Balance, Goals headline, and bill day numbers use weight `800`, outside the requested 400–700 range. Do not reduce them to 700. |
| **Gauge** | Static vector artwork; do not assume its geometry is calculated from `$12,500` / `$20,000`. |
| **Alternate states** | No hover/focus/pressed variants are defined. Selected-tab and pagination appearances are available. |

---

## 2. Coordinate and Styling Conventions

- Units are pixels unless stated otherwise.
- Local positions are relative to the immediate container.
- Padding is listed as `top / right / bottom / left`.
- HEX colors are rounded 8-bit equivalents of source colors.
- All text uses **Inter**, normal slant, and `letter-spacing: 0`.
- All text has no underline, strikethrough, hyperlink, paragraph indent, or paragraph spacing.
- Text vertical alignment is `top`.
- No minimum or maximum dimensions are set on the inspected elements.
- No inspected element uses `Fill-container` sizing.
- Default internal padding is `0` unless specified.
- Unpainted containers are transparent, with no visible border or shadow.
- CSS margins are not defined by the source; spacing comes from layout gaps and padding.

---

## 3. Page-Level Architecture

### Captured Geometry
*Coordinates below are relative to the Overview screen.*

| Region | X | Y | Width | Height |
| :--- | :--- | :--- | :--- | :--- |
| **Top content row** | 304 | 104 | 1104 | 272 |
| **Total Balance section** | 304 | 104 | 352 | 272 |
| **Goals section** | 680 | 104 | 352 | 272 |
| **Upcoming Bill section** | 1056 | 104 | 352 | 272 |
| **Recent Transaction section** | 304 | 408 | 352 | 582 |

*The gap from the top row’s bottom to Recent Transaction is 32px.*

### Implementation Architecture

```text
Core content — 1104px wide
├── Top row — 1104 × 272
│   ├── Total Balance — 352 × 272
│   ├── Goals — 352 × 272
│   └── Upcoming Bill — 352 × 272
└── Lower row — begins 32px below
    └── Recent Transaction — 352 × 582
```

> For a larger Overview implementation, the lower area corresponds to a 352px / 728px two-column split with a 24px gap. Its right-side content is outside this specification. Do not stretch Recent Transaction to occupy that excluded area.

### Top Row

| Property | Value |
| :--- | :--- |
| **Layout** | Horizontal Flexbox equivalent |
| **Wrapping** | No wrap |
| **Main/cross alignment** | Start / start |
| **Gap** | 24px |
| **Padding** | 0 / 0 / 0 / 0 |
| **Figma sizing** | Hug width and height |
| **Resulting dimensions** | 1104px × 272px |

### Section Wrappers
All three top sections:
- Vertical layout.
- Start/start alignment.
- 8px heading-to-surface gap.
- Hug width and height.
- Resulting size: 352px × 272px.
- Their headings are 32px high. White card surfaces begin at local `y: 40px`.

---

## 4. Shared Design Tokens

### Colors

| Token | Value | Usage |
| :--- | :--- | :--- |
| **White** | `#FFFFFF` | Card surfaces, account text, round arrow control |
| **Default Black** | `#191919` | Headline values, transaction titles, Next |
| **Secondary** | `#525256` | Secondary text, bill titles, transaction amounts |
| **Gray/01** | `#666666` | Bill months, transaction icons, Figma wordmark |
| **Gray/02** | `#878787` | Section headings, View All, goal labels |
| **Gray/03** | `#9F9F9F` | Transaction metadata, last-charge text |
| **Gray/04** | `#D1D1D1` | Previous text/icon, inactive dots, gauge endpoints |
| **Gray/05** | `#E8E8E8` | Amount outlines, gauge track |
| **Gray/06** | `#F3F3F3` | Dividers |
| **Primary color** | `#299D91` | Account panel, active tab/dot, gauge |
| **Special/Red** | `#E73D1C` | Adobe artwork |
| **Translucent neutral** | `rgba(210, 210, 210, 0.25)` | Date tiles, transaction icon tiles, edit tile |
| **Translucent white** | `rgba(255, 255, 255, 0.70)` | Account label and masked number |

Source normalized grayscale values include:
- **Gray/02**: `0.5291666388511658` per channel.
- **Gray/03**: `0.625` per channel.
- **Gray/05**: `0.9083333611488342` per channel.
*(HEX conversion slightly quantizes these values).*

### Shared Card Surface

| Property | Value |
| :--- | :--- |
| **Background** | `#FFFFFF` |
| **Radius** | 8px |
| **Visible perimeter border** | None |
| **Shadow offset** | 0px 20px |
| **Shadow blur** | 25px |
| **Shadow spread** | 0px |
| **Shadow color** | Approximately `rgba(76, 103, 100, 0.10)` |
| **Shadow blend** | Normal |
| **Effect style** | Shadow 01 |
| **Content clipping** | Disabled |

Exact shadow RGBA source:
```text
r: 0.2980729341506958
g: 0.40416669845581055
b: 0.3931914269924164
a: 0.10000000149011612
```

---

## 5. Shared Typography

| Role/content | Size | Weight | Line height | Color | Horizontal alignment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Four section headings | 22 | 400 | 32 | `#878787` | Left |
| `$240,399`, Goals `$20,000` | 22 | 800 | 32 | `#191919` | Left |
| All Accounts, May, 2023 | 14 | 500 | 20 | `#525256` | Right |
| Account type | 14 | 500 | 20 | White at 70% | Left |
| Credit Card | 16 | 700 | 24 | `#FFFFFF` | Left |
| `**** **** **** 2598` | 14 | 500 | 20 | White at 70% | Left |
| Account `$25000` | 16 | 700 | 24 | `#FFFFFF` | Right |
| Previous | 14 | 500 | 20 | `#D1D1D1` | Left |
| Next | 14 | 500 | 20 | `#191919` | Left |
| Goal metric labels | 12 | 400 | 16 | `#878787` | Left |
| Goal metric amounts | 16 | 700 | 24 | `#191919` | Left |
| Gauge `$0` | 12 | 500 | 16 | `#D1D1D1` | Center |
| Gauge 12K | 16 | 600 | 24 | `#191919` | Center |
| Gauge `$20k` | 12 | 500 | 16 | `#D1D1D1` | Right |
| Target vs Achievement | 12 | 500 | 16 | `#191919` | Left |
| Both View All labels | 12 | 500 | 16 | `#878787` | Left |
| Bill months | 12 | 500 | 16 | `#666666` | Center |
| Bill day numbers | 22 | 800 | 32 | `#191919` | Center |
| Bill titles | 16 | 700 | 24 | `#525256` | Left |
| Bill last-charge text | 12 | 400 | 16 | `#9F9F9F` | Left |
| Bill amounts | 16 | 700 | 24 | `#525256` | Center |
| All tab | 16 | 700 | 24 | `#299D91` | Left |
| Revenue / Expenses tabs | 16 | 700 | 24 | `#525256` | Left |
| Transaction titles | 16 | 600 | 24 | `#191919` | Left |
| Transaction amounts | 16 | 600 | 24 | `#525256` | Right |
| Transaction secondary text and dates | 12 | 400 | 16 | `#9F9F9F` | Left |

> Figma applies title case to headline amounts, account-panel text, Previous/Next, goal amounts/date, bill titles/day numbers/amounts, and tabs. Other text uses original case.

---

## 6. Total Balance

### Surface and Main Layout

| Element | Local box: X, Y, W, H | Layout |
| :--- | :--- | :--- |
| **Surface within section** | 0, 40, 352, 232 | Vertical; gap 20; padding 20/24/20/24; Hug/Hug |
| **Details within surface** | 24, 20, 304, 152 | Vertical; gap 12; Hug/Hug |
| **Summary header within Details** | 0, 0, 304, 44 | Row; space-between; center; padding 0/0/12/0 |
| **Account panel within Details** | 0, 56, 304, 96 | Row; space-between; center; padding 16 |
| **Carousel controls within surface** | 24, 192, 304, 20 | Row; space-between; center |

**Summary header:**
- Width fixed at 304px; height hugs content.
- Bottom-only inside divider: `1px solid #F3F3F3`.
- `$240,399`: box `0,0,109,32`.
- `All Accounts`: box `220,6,84,20`.

### Account Panel
- **Background**: `#299D91`
- **Radius**: 4px
- **Border/Shadow**: None

#### Left Text Stack
- Box within panel: `16,16,136,64`.
- Vertical layout; no gap.

| Content | Box within stack | Sizing |
| :--- | :--- | :--- |
| Account type | 0,0,120,20 | Fixed width; Hug height |
| Credit Card | 0,20,120,24 | Fixed width; Hug height |
| `**** **** **** 2598` | 0,44,136,20 | Fixed width; Hug height |

#### Right Stack
- Box within panel: `160,16,128,64`.
- Vertical layout; Right cross-axis alignment; Gap: 12px.

| Element | Box within right stack |
| :--- | :--- |
| Logo wrapper | 80,0,48,28 |
| Amount/action row | 0,40,128,24 |

**Logo details:**
- Mastercard instance: 48px × 32px.
- Position within logo wrapper: `0,-2`.
- Raster image within instance: `3,4,43,24`.
- Image scale mode: Fill.
- The instance extends 2px above and below the 28px wrapper.
- No Visa alternative is provided in this selection.

**Amount/action row:**
- Horizontal layout; gap 12px.
- `$25000`: box `0,0,92,24`.
- Round arrow control: box `104,0,24,24`.
  - Control background: white.
  - Radius: 20px.
  - Padding: 4px.
  - Arrow icon: 16px × 16px.
  - Arrow stroke: `1.5px #299D91`, round caps/joins.

### Carousel Controls

| Element | Box within controls |
| :--- | :--- |
| **Previous group** | 0,0,80,20 |
| **Dots group** | 132,6,40,8 |
| **Next group** | 224,0,80,20 |

- Each text/arrow group uses a 4px gap.
- Previous text: 58px × 20px.
- Next text: 32px × 20px.
- Icons: 16px × 16px.
- Chevron path bounds: 4px × 8px at local 6,4.
- Chevron stroke: 1px, round caps/joins.
- Previous icon/text: `#D1D1D1`.
- Next icon/text: `#191919`.
- Previous icon uses a horizontal reflection:
```text
matrix(-1, 0, 0, 1, 16, 2)
```
*(Do not apply a vertical flip when reproducing the left-facing chevron).*

**Pagination:**
- Three circular dots, each 8px × 8px.
- Gap: 8px.
- First dot: `#299D91`.
- Remaining dots: `#D1D1D1`.

---

## 7. Goals

### Surface Layout

| Element | Box within its parent | Layout |
| :--- | :--- | :--- |
| **Surface within section** | 0,40,352,232 | Vertical; gap 20; padding 20/24/20/24 |
| **Header within surface** | 24,20,304,44 | Row; space-between; center; bottom padding 12 |
| **Details within surface** | 24,84,304,128 | Row; start/start; gap 16 |
| **Metric column within Details** | 0,0,144,124 | Vertical; main-axis center; gap 24 |
| **Gauge column within Details** | 160,0,144,124.0000458 | Vertical; cross-axis center; gap 14 |

*Header divider: bottom-only inside 1px solid `#F3F3F3`.*

### Header Content

| Element | Box within header |
| :--- | :--- |
| Amount/edit group | 0,0,138,32 |
| `$20,000` within group | 0,0,97,32 |
| Edit control within group | 106,0,32,32 |
| May, 2023 | 233,6,71,20 |

- Amount/edit gap: 9px.
- **Edit control**: Padding 8px, Radius 4px, Background `rgba(210,210,210,0.25)`. Icon 16px × 16px, stroke `1.5px #525256`, round caps/joins. No visible border.

### Metrics

| Metric | Box within metric column | Value |
| :--- | :--- | :--- |
| Target Achieved | 0,6,144,44 | `$12,500` |
| This month Target | 0,74,144,44 | `$20,000` |

- Horizontal layout; start/start.
- Icon: 24px × 24px. Icon-to-text gap: 4px.
- Text stack: 116px × 44px. Label: fixed width 116px, height 16px. Label-to-value gap: 4px. Value: fixed width 112px, height 24px.

**Icons:**
- **Achieved**: Award icon, Filled `#525256`, artwork bounds 16px × 17px at 4,4.
- **Monthly target**: Goal/target icon, Filled `#525256`.

### Gauge
*The design contains a semicircular gauge.*

| Element | Geometry |
| :--- | :--- |
| **Graph and range wrapper** | 144px × 94.0000458px |
| **Arc wrapper** | 128px × 64.0000458px, at 8,0 |
| **Range row** | 144px × 24px, at 0,70.0000458 |
| **Caption** | 132px × 16px, at 6,108.0000458 |

**Range labels:**

| Text | Box within range |
| :--- | :--- |
| `$0` | 0,4,26,16 |
| `12K` | 54,0,30,24 |
| `$20k` | 112,4,32,16 |

- Caption: `Target vs Achievement`.
- Track fill: `#E8E8E8`.
- Progress fill: `#299D91`.
- Track source geometry has outer radius ~64px and inner radius ~51.2px. Both arc vectors have Figma corner radius 32px.
- Needle/pivot rendered union fill: `#299D91`. Corner radius 4px. Union bounds: ~35.99px × 36.00px.

---

## 8. Upcoming Bill

### Heading and View All

| Element | Box within section header |
| :--- | :--- |
| Header | 0,0,340,32 |
| Heading | 0,0,142,32 |
| View All group | 270,8,70,16 |

- Header layout: horizontal; center cross-axis; gap 128px. Width: 340px.
- View All text: 46px × 16px; Text-to-icon gap: 8px.
- Chevron: 16px × 16px; artwork at 6,4 (4px × 8px); stroke `1.5px #878787`, round caps/joins.

### Surface
- Box within section: `0,40,352,232`.
- Vertical layout; gap 0; Padding: 24px all sides.
- Shared white card treatment.

### Bill Rows

| Row | Box within surface | Padding |
| :--- | :--- | :--- |
| Figma | 24,24,304,94 | 8/0/20/0 |
| Adobe | 24,118,304,90 | 20/0/4/0 |

- Horizontal, space-between, vertically centered.
- Width fixed at 304px; height hugs content.
- Details width: 216px; Amount width: 68px. Gap: 20px.
- Only Figma has a bottom divider: `1px solid #F3F3F3`, inside.

### Exact Content

| Property | Figma | Adobe |
| :--- | :--- | :--- |
| **Month** | May | Jun |
| **Day** | 15 | 16 |
| **Stored title** | figma - Monthly | Adobe - Yearly |
| **Rendered title case** | Figma - Monthly | Adobe - Yearly |
| **Last charge** | Last Charge - 14 May, 2022 | Last Charge - 17 Jun, 2023 |
| **Amount** | `$150` | `$559` |

### Details Architecture
- **Details group**: Size 216px × 66px. Gap 12px.
- **Date tile**: Size 44px × 66px. Vertical centered, padding 8px, gap 2px, radius 8px, background `rgba(210,210,210,0.25)`.
- **Subscription group**: Box `56,2,160,62`. Vertical layout, gap 4px. Logo height 16px.

**Assets:**
- Figma wordmark: ~44.8px × 16px (`#666666`).
- Adobe logo/wordmark: ~60px × 16px (`#E73D1C`).

### Amount Containers
- Size: 68px × 40px; Padding: 8px 12px.
- White background, radius 8px.
- Inside border: `1px solid #E8E8E8`.
- Text box: 44px × 24px.

---

## 9. Recent Transaction

### Section Header

| Element | Box within section |
| :--- | :--- |
| Header | 0,0,352,32 |
| Heading | 0,0,201,32 |
| View All group | 282,8,70,16 |

### Surface
- Box within section: `0,40,352,542`.
- Vertical layout; gap 12px; Padding: 16/24/34/24; Hug width/height.
- Shared white card treatment.

### Filter Tabs
- Container: Box `24,16,304,40`. Horizontal, gap 20px.

| Tab | Box within tabs | Padding | State |
| :--- | :--- | :--- | :--- |
| **All** | 0,0,37,40 | 8px all sides | Selected |
| **Revenue** | 57,0,84,40 | 8px all sides | Unselected |
| **Expenses** | 161,0,93,40 | 8px all sides | Unselected |

- **Selected appearance**: Text `#299D91`, bottom inside border `2px solid #299D91`.
- **Unselected appearance**: Text `#525256`.

### List Geometry
- List box within surface: `24,68,303,440`.
- Five rows, each 303px × 88px.
- Y positions: 0, 88, 176, 264, 352.
- *List width is 303px (leaves 25px on the surface’s right side vs 304px tabs).*

### Row Layout

| Element | Box within row |
| :--- | :--- |
| Icon/details group | 0,24,202,40 |
| Price/date group | 230,24,73,40 |

- Icon tile: 40px × 40px, padding 8px, radius 8px, background `rgba(210,210,210,0.25)`.
- Icon instance: 24px × 24px.
- Details stack: `146px × 40px` at `56,0`.
- Rows 1–4 have inside bottom divider: `1px solid #F3F3F3`. Final row stroke is hidden.

### Exact List Content

| Row | Title | Secondary text | Amount | Date | Icon |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | GTR 5 | Gadget & Gear | `$160.00` | 17 May 2023 | Gamepad |
| **2** | Polo Shirt | XL fashions | `$20.00` | 17 May 2023 | Shopping bag |
| **3** | Biriyani | Hajir Biriyani | `$10.00` | 17 May 2023 | Food |
| **4** | Taxi Fare | Uber | `$12.00` | 17 May 2023 | Transport |
| **5** | Keyboard | Gadget & Gear | `$22.00` | 17 May 2023 | Shopping bag |

### Transaction Icon Styling

| Icon | Artwork bounds | Styling |
| :--- | :--- | :--- |
| **Gamepad** | 20px × 14px at 2,5 | `2px #666666` stroke; round caps/joins |
| **Shopping bag** | ~16px × 20px at 4,2 | Filled `#666666` |
| **Food** | 18px × 20px at 3,2 | Filled `#666666` |
| **Transport** | 20px × 20px at 2,2 | Filled `#666666` |

---

## 10. Defined Interactions

All recorded navigation interactions use:
- **Trigger**: click
- **Navigation**: navigate
- **Transition**: Smart Animate
- **Easing**: ease-out
- **Duration**: ~300ms
- **Preserve scroll position**: false

### Active Controls
- Total Balance round arrow
- Goals edit control
- Upcoming Bill View All
- Recent Transaction View All

---

## 11. Interactive-State Contract

| Element | Defined appearance | Undefined states |
| :--- | :--- | :--- |
| **View All links** | Default | Hover, focus, pressed, visited |
| **Balance round arrow** | Default | Hover, focus, pressed, disabled |
| **Goals edit control** | Default | Hover, focus, pressed, disabled |
| **Previous** | Muted default | Explicit disabled semantics, hover/focus |
| **Next** | Dark default | Hover, focus, pressed, disabled |
| **Pagination** | First dot active | Hover/focus, alternate slide content |
| **Transaction tabs** | All selected | Hover, focus, pressed, alternate panels |
| **Transaction rows** | Default | Hover, focus, selection |
| **Bill rows/amounts** | Default | Hover, focus, pressed |

---

## 12. Acceptance Checklist

- [x] Three top sections remain 352px wide with 24px gaps.
- [x] Top sections include headings outside the white surfaces.
- [x] Top white surfaces are 352px × 232px.
- [x] Recent Transaction remains 352px × 582px, including its heading.
- [x] All four white surfaces use radius 8px and Shadow 01.
- [x] Weight 800 is retained where specified.
- [x] `$25000` is not silently normalized to `$25,000`.
- [x] Mastercard is shown; a Visa slide is not fabricated.
- [x] Masked number is exactly `**** **** **** 2598`.
- [x] Gauge labels retain `12K` and `$20k` casing.
- [x] Bill charge dates retain their distinct years.
- [x] Bill amounts remain outlined containers, not assumed payment buttons.
- [x] All tab has a 2px accent underline.
- [x] Transaction list width is 303px, not 304px.
- [x] All five transactions and exact secondary labels are present.
- [x] Final transaction has no visible bottom divider.
- [x] No unsupported hover, focus, filtered content, carousel slides, or responsive rules are presented as source-defined.