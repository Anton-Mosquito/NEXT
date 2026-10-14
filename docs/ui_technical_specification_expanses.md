# UI Technical Specification — Expenses Screen

## 1. Scope and Source Reliability

### Source
This specification covers the entire selected screen, including:
* Navigation sidebar.
* Top header.
* Expenses Comparison chart.
* Expenses Breakdown cards.

### Source Limitation
The frame contains a single flattened raster image, not separate interface layers.

Therefore:
* Outer-frame and image properties are confirmed directly from Figma.
* Visible content and arrangement can be documented from the image.
* Internal dimensions, spacing, font tokens, precise colors, borders, radii, and shadows are not independently defined.
* Chart values cannot be recovered accurately from bar heights.
* Internal component states and interaction behavior are not available.
* Values from previously inspected components must not be applied automatically to this screen.

### Terminology
* **Confirmed:** Available from Figma properties.
* **Observed:** Visible in the image.
* **Not defined:** Unavailable from the source.

---

## 2. Confirmed Outer Container

| Property | Confirmed value |
| :--- | :--- |
| **Width** | 1440px |
| **Height** | 1024px |
| **Width sizing** | Fixed |
| **Height sizing** | Fixed |
| **Layout mode** | NONE |
| **Padding: top/right/bottom/left** | 0px / 0px / 0px / 0px |
| **Minimum width/height** | Not set |
| **Maximum width/height** | Not set |
| **Background** | `#F4F5F7` |
| **Border** | None |
| **Corner radius** | 0px |
| **Effects** | None on the outer frame |
| **Opacity** | 1 |
| **Clip content** | Enabled |
| **Constraints** | Left/top |
| **Prototype reactions** | None |

### Raster Child

| Property | Confirmed value |
| :--- | :--- |
| **Position** | x: 0px; y: 0px |
| **Dimensions** | 1440px × 1024px |
| **Sizing** | Fixed width and height |
| **Fill type** | Image |
| **Image scale mode** | FILL |
| **Image transform** | Identity |
| **Rotation** | 0° |
| **Image filters** | All neutral |
| **Opacity** | 1 |
| **Corner radius** | 0px |
| **Border/effects** | None |
| **Constraints** | Center horizontally and vertically |

*Visible shadows, rounded surfaces, and separators are embedded pixels, not independently configured effects.*

---

## 3. Visible Interface Hierarchy

```text
Expenses screen
├── Navigation sidebar
│   ├── FINEbank.IO branding
│   ├── Navigation
│   │   ├── Overview
│   │   ├── Balances
│   │   ├── Transactions
│   │   ├── Bills
│   │   ├── Expenses — selected
│   │   ├── Goals
│   │   └── Settings
│   └── Lower action / Profile area
│       ├── Logout
│       ├── Tanzir Rahman (Profile name)
│       └── View profile
├── Top header
│   ├── Date display (May 19, 2023)
│   ├── Search input
│   └── Notification bell
└── Main Content
    ├── Expenses Comparison Section
    │   ├── Section Heading
    │   └── Chart Card
    │       ├── Controls & Legend (Monthly Comparison, This Week, Last Week)
    │       └── Grouped Bar Chart
    └── Expenses Breakdown Section
        ├── Section Heading
        └── Breakdown Grid (3 columns × 2 rows)
            ├── Housing Card
            ├── Food Card
            ├── Transportation Card
            ├── Entertainment Card
            ├── Shopping Card
            └── Others Card
```

*This is a semantic decomposition of the image, not an existing editable layer hierarchy.*

---

## 4. Overall Layout and Container Architecture

### Observed Arrangement
1. A full-height dark sidebar occupies the left side.
2. The remaining area contains a top header and content below it.
3. The comparison section appears first.
4. A wide chart card sits below its heading.
5. The breakdown section follows the chart.
6. Breakdown cards form three columns and two rows.

### Internal Layout Availability

| Region | Observed structure | Exact unavailable properties |
| :--- | :--- | :--- |
| **Screen shell** | Sidebar beside main area | Sidebar width, main width, column definition |
| **Sidebar** | Branding, stacked navigation, lower actions/profile | Padding, gaps, item heights, bottom offsets |
| **Main area** | Header above content | Flex/Grid structure, sizing, offsets |
| **Header** | Date left; notification and search right | Padding, gaps, alignment properties |
| **Content** | Comparison above breakdown | Padding, margins, section gaps |
| **Chart card** | Controls above chart | Width, height, internal padding |
| **Breakdown grid** | Three columns, two rows | Column widths, row heights, gaps |
| **Breakdown card** | Summary header above two entries | Dimensions, padding, sizing constraints |
| **Breakdown entry** | Item left; amount and date right | Row heights, column widths, padding |

*No internal Fill-container, Hug-content, min/max-width, or responsive constraints can be confirmed.*

### Surface Appearance

| Surface | Observed treatment | Exact values |
| :--- | :--- | :--- |
| **Sidebar** | Dark background | Not defined |
| **Selected navigation item** | Teal-looking fill with light text/icons | Not defined |
| **Header** | Light background and subtle lower divider | Not defined |
| **Chart card** | White-looking surface, rounded corners, soft shadow | Not defined |
| **Breakdown card body** | White-looking surface with rounded outer corners | Not defined |
| **Breakdown card header** | Light gray surface | Not defined |
| **Category icon tile** | Darker gray small rounded tile | Not defined |
| **Logout control** | Dark neutral rectangular surface | Not defined |

*Only the outer-frame background `#F4F5F7` is confirmed.*

---

## 5. Navigation Sidebar

### Visible Content

| Order | Text | State |
| :--- | :--- | :--- |
| **Branding** | FINEbank.IO | Static branding |
| **1** | Overview | Unselected |
| **2** | Balances | Unselected |
| **3** | Transactions | Unselected |
| **4** | Bills | Unselected |
| **5** | Expenses | Selected |
| **6** | Goals | Unselected |
| **7** | Settings | Unselected |
| **Lower action** | Logout | Default appearance |
| **Profile name** | Tanzir Rahman | Static visible text |
| **Profile action** | View profile | Default appearance |

### Observed Styling and Assets
* Each navigation entry has an icon to its left.
* Expenses has a filled accent background.
* Other navigation entries appear transparent.
* A divider separates the lower profile area.
* The profile area includes a small circular-looking avatar and a vertical overflow icon.
* Logout includes an exit-style icon.

### Undefined Implementation Values
* Navigation-item dimensions and hit areas.
* Sidebar padding and item gaps.
* Active, inactive, and hover colors.
* Font values.
* Icon sizes and geometry.
* Avatar dimensions and original media asset.
* Navigation destinations.
* Logout, profile, and overflow behavior.

*The selected Expenses appearance is visible. It does not establish hover, focus, or pressed states.*

---

## 6. Header

### Visible Elements

| Element | Content or appearance |
| :--- | :--- |
| **Date** | May 19, 2023 |
| **Date prefix** | Double right-facing chevrons |
| **Notification** | Bell with small colored indicator |
| **Search placeholder** | Search here |
| **Search icon** | Magnifying glass |

*No greeting is visible in this screen’s header.*

### Search Field Requirements

| Requirement | Source status |
| :--- | :--- |
| **External label** | None visible |
| **Placeholder** | Search here |
| **Native input semantics** | Not defined |
| **Width/height** | Not defined |
| **Internal padding** | Not defined |
| **Background** | Not defined |
| **Border width/style/color** | Not defined |
| **Radius** | Not defined |
| **Shadow** | Not defined |
| **Placeholder typography** | Not defined |
| **Entered-text styling** | Not represented |
| **Validation/helper text** | None visible |
| **Focus/error/disabled states** | Not represented |
| **Search behavior** | Not defined |

---

## 7. Expenses Comparison

### Section Heading
* **Observed text:** `Expenses Comparison`
* It is left-aligned above the chart card and visually less prominent than the chart’s control label.
* Exact typography, color, dimensions, and spacing are not defined.

### Chart Controls

| Element | Observed content |
| :--- | :--- |
| **Selector label** | Monthly Comparison |
| **Selector icon** | Downward chevron |
| **First legend label** | This Week |
| **Second legend label** | Last Week |

* The selector appears at the chart card’s upper-left.
* The legend appears at the upper-right.
* `This Week` uses a teal-looking swatch.
* `Last Week` uses a light gray swatch.
* These labels record the static screenshot. The interactive selector and period-dependent legend behavior are specified in section 14.

### Chart Structure
* Grouped vertical bar chart.
* Twelve month groups.
* Two bars per month.
* Light gray bar appears to the left of the teal bar.
* Horizontal gridlines.
* No visible tooltip, selected bar, data labels, or chart action button.

### X-Axis Labels
```text
Jan, Feb, Mar, Apr, May, Jun, July, Aug, Sep, Oct, Nov, Dec
```
*Preserve `July`; do not automatically shorten it to `Jul`.*

### Y-Axis Labels
Visible transcription, top to bottom:
```text
$250k
$50k
$10k
$2k
$0
```
*These labels are rasterized. Exact underlying character casing cannot be validated from editable text.*

### Chart Data and Scale

| Requirement | Source status |
| :--- | :--- |
| **Twenty-four numerical bar values** | Not defined |
| **Scale type: linear/log/custom** | Not defined |
| **Tick positions as numerical values** | Not defined |
| **Axis minimum/maximum** | Not defined independently |
| **Bar widths and group gaps** | Not defined |
| **Gridline widths/colors** | Not defined |
| **Axis typography/colors** | Not defined |
| **Tooltip content** | Not represented |
| **Legend toggle behavior** | Not defined |
| **Selector options** | Not defined |

*Do not estimate numerical values from bar heights. Do not assume a linear or logarithmic scale merely from the visible tick labels.*

---

## 8. Expenses Breakdown Grid

### Section Heading
* **Observed text:** `Expenses Breakdown`

### Card Order

| Position | Category |
| :--- | :--- |
| **Row 1, column 1** | Housing |
| **Row 1, column 2** | Food |
| **Row 1, column 3** | Transportation |
| **Row 2, column 1** | Entertainment |
| **Row 2, column 2** | Shopping |
| **Row 2, column 3** | Others |

### Shared Card Structure
```text
Category card
├── Summary header
│   ├── Category icon tile
│   ├── Category label
│   ├── Category total
│   ├── Percentage and directional arrow
│   └── Compare to last month
└── Entries
    ├── Entry 1
    │   ├── Description
    │   ├── Amount
    │   └── Date
    └── Entry 2
        ├── Description
        ├── Amount
        └── Date
```

**Observed styling:**
* Category labels appear smaller and lighter than totals.
* Totals are dark and bold-looking.
* Percentage values sit near directional arrows.
* The comparison caption appears smaller and muted.
* Entry descriptions align left.
* Amounts and dates appear right-aligned.
* Dates appear beneath amounts.
* Subtle separators divide entries.
* Exact layout and styling values are unavailable.

---

## 9. Breakdown Content

### Category Summaries

| Category | Total | Comparison | Arrow | Observed arrow appearance |
| :--- | :--- | :--- | :--- | :--- |
| **Housing** | $250.00 | 15% | Up | Red/coral-looking |
| **Food** | $350.00 | 08% | Down | Green-looking |
| **Transportation** | $50.00 | 12% | Down | Green-looking |
| **Entertainment** | $80.00 | 15% | Down | Green-looking |
| **Shopping** | $420.00 | 25% | Up | Red/coral-looking |
| **Others** | $50.00 | 23% | Up | Red/coral-looking |

All six cards display:
```text
Compare to last month
```
*Preserve Food’s leading zero: `08%`.*

*Arrow directions are visible; their underlying comparison calculations and semantics are not defined.*

### Expense Entries

| Category | Entry | Amount | Date |
| :--- | :--- | :--- | :--- |
| **Housing** | House Rent | $230.00 | 17 May 2023 |
| **Housing** | Parking | $20.00 | 17 May 2023 |
| **Food** | Grocery | $230.00 | 17 May 2023 |
| **Food** | Restaurant bill | $120.00 | 17 May 2023 |
| **Transportation** | Taxi Fare | $30.00 | 17 May 2023 |
| **Transportation** | Metro Card bill | $20.00 | 17 May 2023 |
| **Entertainment** | Movie ticket | $30.00 | 17 May 2023 |
| **Entertainment** | iTunes | $50.00 | 17 May 2023 |
| **Shopping** | Shirt | $230.00 | 17 May 2023 |
| **Shopping** | Jeans | $190.00 | 17 May 2023 |
| **Others** | Donation | $30.00 | 17 May 2023 |
| **Others** | Gift | $20.00 | 17 May 2023 |

*Content above is visually transcribed. Underlying whitespace and text-layer formatting are unavailable.*

### Arithmetic Consistency
The visible entries sum to their respective displayed totals:
* **Housing:** $230 + 20 = 250$
* **Food:** $230 + 120 = 350$
* **Transportation:** $30 + 20 = 50$
* **Entertainment:** $30 + 50 = 80$
* **Shopping:** $230 + 190 = 420$
* **Others:** $30 + 20 = 50$

*No previous-month amounts are shown, so the percentages cannot be independently validated.*

---

## 10. Complete Typography Inventory

| Role | Text/content |
| :--- | :--- |
| **Branding** | FINEbank.IO |
| **Navigation** | Overview, Balances, Transactions, Bills, Expenses, Goals, Settings |
| **Lower action** | Logout |
| **Profile name** | Tanzir Rahman |
| **Profile action** | View profile |
| **Header date** | May 19, 2023 |
| **Search placeholder** | Search here |
| **Comparison heading** | Expenses Comparison |
| **Comparison selector** | Monthly Comparison |
| **Legend labels** | This Week, Last Week |
| **X-axis labels** | All twelve labels in Section 7 |
| **Y-axis labels** | All five labels in Section 7 |
| **Breakdown heading** | Expenses Breakdown |
| **Category labels** | All six labels in Section 9 |
| **Category totals** | All six totals in Section 9 |
| **Comparison percentages** | All six percentages in Section 9 |
| **Comparison captions** | Compare to last month, six occurrences |
| **Entry descriptions** | All twelve descriptions in Section 9 |
| **Entry amounts** | All twelve amounts in Section 9 |
| **Entry dates** | 17 May 2023, twelve occurrences |

**For every role above, these properties are not defined:**
* Font family.
* Font size in pixels.
* Numeric font weight.
* Exact line height.
* Letter spacing.
* Exact HEX/RGBA color.
* Text-box dimensions.
* Text resizing mode.
* Actual text alignment property.
* Case transformation and decoration properties.

*Visible boldness or alignment does not establish an exact weight or layout token.*

---

## 11. Icons and Media Inventory

| Asset group | Visible assets | Exact dimensions/colors/geometry |
| :--- | :--- | :--- |
| **Sidebar** | Seven navigation icons | Not defined |
| **Sidebar lower area** | Logout icon, avatar, overflow icon | Not defined |
| **Header** | Double chevrons, bell, notification indicator, search icon | Not defined |
| **Chart** | Selector chevron, two legend swatches | Not defined |
| **Breakdown** | Six category icons | Not defined |
| **Breakdown** | Six directional arrows | Not defined |

*No independently exportable media or vector assets exist inside this screenshot.*

*The category icons visually represent housing, food, transportation, entertainment, shopping, and miscellaneous categories. Their exact icon family is not identifiable from source metadata.*

---

## 12. Interactive Components and States

### Visible Controls

| Element | Observed role | Defined behavior |
| :--- | :--- | :--- |
| **Navigation entries** | Navigation-looking controls | None |
| **Expenses entry** | Selected navigation appearance | None |
| **Logout** | Action-looking control | None |
| **View profile** | Profile action | None |
| **Overflow icon** | Menu-looking control | None |
| **Notification bell** | Notification control appearance | None |
| **Search field** | Search input appearance | None |
| **Monthly Comparison** | Dropdown/selector appearance | None |

*No primary, secondary, or ghost button component variants are defined. No checkboxes, form validation messages, or link destinations are available.*

### State Availability

| State | Source evidence |
| :--- | :--- |
| **Default** | Visible screenshot |
| **Selected navigation** | Expenses appearance is visible |
| **Hover** | Not represented |
| **Focus/focus-visible** | Not represented |
| **Active/pressed** | Not represented |
| **Disabled** | Not represented |
| **Error** | Not represented |
| **Loading** | Not represented |
| **Empty expenses** | Not represented |
| **Chart tooltip** | Not represented |
| **Open selector** | Not represented |

*Exact focus outlines, error border colors, helper-message styling, hover changes, and disabled opacity must be specified separately.*

*Do not interpret muted text as disabled. Do not omit accessible keyboard focus solely because it is absent from the screenshot.*

---

## 13. Implementation Verification Contract

### Supported Requirements
* Preserve the complete visible screen hierarchy.
* Keep Expenses selected in the navigation.
* Include the header without adding a greeting.
* Include the grouped comparison chart and both legend labels.
* Preserve all twelve month labels.
* Preserve all six categories and twelve expense entries.
* Preserve totals, percentages, arrow directions, dates, and currency formatting.
* Use the confirmed outer-frame background `#F4F5F7`.
* Maintain the visible arithmetic consistency.

### Required for an Exact Production Implementation
* Internal layout measurements and responsive rules.
* Typography tokens.
* Exact surface, text, border, icon, and chart colors.
* Card radii and shadows.
* Original icon and avatar assets.
* Numerical chart datasets and scale configuration.
* Selector options and interaction requirements.
* Navigation destinations and action behavior.
* Accessible focus and state styling.
* Authoritative editable text for exact transcription validation.

*The source supports a complete visible-element inventory, but not a fully measured internal UI specification. Unavailable values are intentionally left undefined rather than guessed.*

## 14. Implemented Comparison Selector

The comparison control is an interactive menu. It defaults to **Monthly Comparison** and offers:

| Selection | Chart comparison | Category-card comparison |
| :--- | :--- | :--- |
| **Daily Comparison** | Each day of the current Monday–Sunday week against the matching weekday in the previous week | Current week against previous week |
| **Weekly Comparison** | Monday-based week buckets in the current calendar month against matching week buckets in the previous month; edge weeks include only days within their month | Current month against previous month |
| **Monthly Comparison** | The latest 12 months against the corresponding months one year earlier | Current month against the same month last year |
| **Yearly Comparison** | Current calendar-year total against the previous calendar-year total | Current year against previous year |

Changing the selection refreshes both the chart and category breakdown. Category cards retain the two most recent transactions in the selected current comparison period and show **New** when the corresponding previous-period category total is zero.

This interactive behavior extends the observed static screenshot and supersedes its unresolved selector-options and interaction notes; it does not change the screenshot-derived layout or styling observations.