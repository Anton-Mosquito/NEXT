# UI Technical Specification — Goals Screen

## 1. Scope and Source Reliability

### Source

_Selected Frame / Image Output_

### Included Regions

- Navigation sidebar.
- Top header.
- Goals heading.
- Savings Goal card.
- Saving Summary chart.
- Expenses Goals by Category section.
- Six category goal cards.

### Source Limitation

The selected frame contains one flattened raster image. There are no independently editable text layers, components, icons, charts, or internal layout containers.

This specification distinguishes:

- **Confirmed:** Properties available directly from Figma.
- **Observed:** Content and appearance visible in the image.
- **Not defined:** Values unavailable from the source.

Internal font sizes, numeric weights, precise colors, spacing, dimensions, borders, radii, shadows, and interaction states cannot be verified as design properties.

Previously inspected Header, Expenses, or Balances components are not authoritative sources for the internal styling of this image.

---

## 2. Confirmed Source Container

| Property                            | Confirmed value         |
| :---------------------------------- | :---------------------- |
| **Width**                           | 1440px                  |
| **Height**                          | 1024px                  |
| **Horizontal sizing**               | Fixed                   |
| **Vertical sizing**                 | Fixed                   |
| **Layout mode**                     | NONE                    |
| **Padding (top/right/bottom/left)** | 0px / 0px / 0px / 0px   |
| **Minimum width/height**            | Not set                 |
| **Maximum width/height**            | Not set                 |
| **Background fill**                 | `#F4F5F7`               |
| **Border**                          | None                    |
| **Corner radius**                   | 0px                     |
| **Effects**                         | None on the outer frame |
| **Opacity**                         | 1                       |
| **Clip content**                    | Enabled                 |
| **Constraints**                     | Left/top                |
| **Prototype reactions**             | None                    |

### Raster Content

| Property             | Confirmed value                    |
| :------------------- | :--------------------------------- |
| **Position**         | x: 0px; y: 0px                     |
| **Dimensions**       | 1440px × 1024px                    |
| **Sizing**           | Fixed width and height             |
| **Fill**             | Image                              |
| **Image scale mode** | FILL                               |
| **Image transform**  | Identity                           |
| **Rotation**         | 0°                                 |
| **Image filters**    | All neutral                        |
| **Opacity**          | 1                                  |
| **Border/effects**   | None                               |
| **Radius**           | 0px                                |
| **Constraints**      | Center horizontally and vertically |

_Rounded cards, chart graphics, and shadows are embedded pixels rather than independently configured properties._

---

## 3. Visible Interface Hierarchy

```text
Goals screen
├── Navigation sidebar
│   ├── FINEbank.IO
│   ├── Overview
│   ├── Balances
│   ├── Transactions
│   ├── Bills
│   ├── Expenses
│   ├── Goals — selected
│   └── Settings
```

_This hierarchy describes the visible interface, not editable Figma layers._

---

## 4. Overall Layout and Container Architecture

### Observed Arrangement

- A dark sidebar occupies the left side.
- The main area contains a header above the page content.
- Goals appears above two adjacent summary cards.
- The Savings Goal card is narrower than the Saving Summary card.
- The category section follows the summary row.
- Category cards form three columns and two rows.
- Empty background space remains below the category grid.

### Exact Layout Availability

| Region                  | Observed structure                              | Unavailable properties                |
| :---------------------- | :---------------------------------------------- | :------------------------------------ |
| **Screen shell**        | Sidebar beside main area                        | Column widths, offsets, layout system |
| **Sidebar**             | Vertical navigation with lower account controls | Padding, gaps, item dimensions        |
| **Header**              | Date left; notification and search right        | Padding, gaps, sizing constraints     |
| **Main content**        | Heading, summary row, category section          | Margins, padding, section gaps        |
| **Summary row**         | Two unequal-width cards                         | Card widths, gap, alignment           |
| **Savings Goal card**   | Header, metrics/gauge, lower action             | Internal padding, row/column sizing   |
| **Saving Summary card** | Controls and legend above chart                 | Internal padding, plot dimensions     |
| **Category grid**       | Three columns and two rows                      | Column widths, row heights, gaps      |
| **Category card**       | Icon, label/value, right-side action            | Padding, alignment, sizing            |

_No internal Fixed/Fill/Hug rules, min/max dimensions, breakpoints, or overflow behavior are defined._

### Surface Styling

| Surface                 | Observed treatment                                    | Exact values |
| :---------------------- | :---------------------------------------------------- | :----------- |
| **Sidebar**             | Dark background                                       | Not defined  |
| **Selected Goals item** | Teal-looking fill, light text/icon                    | Not defined  |
| **Header**              | Light surface with subtle lower separator             | Not defined  |
| **Summary cards**       | White-looking surfaces, rounded corners, soft shadows | Not defined  |
| **Category cards**      | White-looking surfaces, rounded corners, soft shadows | Not defined  |
| **Category icon tiles** | Light neutral rounded tiles                           | Not defined  |
| **Selectors**           | Small control surfaces with downward chevrons         | Not defined  |
| **Adjust actions**      | Teal-looking outline and text                         | Not defined  |

_Only the outer background `#F4F5F7` is confirmed._

---

## 5. Navigation Sidebar

### Visible Content

| Element            | Content       | State              |
| :----------------- | :------------ | :----------------- |
| **Branding**       | FINEbank.IO   | Static             |
| **Navigation**     | Overview      | Unselected         |
| **Navigation**     | Balances      | Unselected         |
| **Navigation**     | Transactions  | Unselected         |
| **Navigation**     | Bills         | Unselected         |
| **Navigation**     | Expenses      | Unselected         |
| **Navigation**     | Goals         | Selected           |
| **Navigation**     | Settings      | Unselected         |
| **Lower action**   | Logout        | Default appearance |
| **Profile name**   | Tanzir Rahman | Static text        |
| **Profile action** | View profile  | Default appearance |

### Observed Details

- Each navigation entry has an icon before its label.
- **Goals** has the selected accent background.
- **Logout** includes an exit-style icon.
- A divider appears above the profile area.
- The profile area includes an avatar and vertical overflow icon.
- _Exact typography, dimensions, icon paths, spacing, colors, destinations, and control behavior are not defined._

---

## 6. Header

| Element                | Observed content                    |
| :--------------------- | :---------------------------------- |
| **Date**               | May 19, 2023                        |
| **Date prefix**        | Double right-facing chevrons        |
| **Notification**       | Bell with a small colored indicator |
| **Search placeholder** | Search here                         |
| **Search icon**        | Magnifying glass                    |

_No greeting is visible._

### Search Specification

| Requirement                      | Source status   |
| :------------------------------- | :-------------- |
| **External label**               | None visible    |
| **Placeholder**                  | Search here     |
| **Native input semantics**       | Not defined     |
| **Field width/height**           | Not defined     |
| **Internal padding**             | Not defined     |
| **Background color**             | Not defined     |
| **Border width/style/color**     | Not defined     |
| **Radius/shadow**                | Not defined     |
| **Placeholder typography**       | Not defined     |
| **Entered-value typography**     | Not represented |
| **Validation/helper messages**   | None visible    |
| **Focus/disabled/error styling** | Not represented |
| **Search behavior**              | Not defined     |

---

## 7. Goals Heading

**Observed content:** Goals

- Appears above the summary cards.
- Visually left-aligned.
- Muted relative to card metric values.
- _Font family, size, weight, line height, letter spacing, exact color, dimensions, and margins are not defined._

---

## 8. Savings Goal Card

### Header

| Element                | Observed content |
| :--------------------- | :--------------- |
| **Card title**         | Savings Goal     |
| **Date-range start**   | 01 May           |
| **Date-range end**     | 31 May           |
| **Selector indicator** | Downward chevron |

_The range separator is rasterized; its exact character is not reliably established. Preserve the endpoints without claiming an authoritative underlying separator string._

### Metrics

| Label                 | Value   | Leading artwork  |
| :-------------------- | :------ | :--------------- |
| **Target Achieved**   | $12,500 | Trophy-like icon |
| **This month Target** | $20,000 | Target-like icon |

**Observed styling:**

- Labels appear small and muted.
- Values appear darker and heavier.
- Icons sit to the left of the metric text groups.
- _Exact label/value typography, icon dimensions, gaps, and alignment properties are not defined._

### Gauge

**Observed elements:**

- Semicircular track.
- Teal-looking completed arc.
- Light gray remaining arc.
- Diagonal needle with a central pivot.
- Left scale label: `$0`.
- Central value: `12K`.
- Right scale label: `$20K`.
- Caption: `Target vs Achievement`.

_The metric shows $12,500, whereas the gauge center displays the abbreviated value 12K. Preserve both displayed values; do not silently replace one with the other._

| Gauge requirement                | Source status   |
| :------------------------------- | :-------------- |
| **Overall dimensions**           | Not defined     |
| **Arc thickness**                | Not defined     |
| **Arc start/end angles**         | Not defined     |
| **Needle angle and geometry**    | Not defined     |
| **Pivot radius**                 | Not defined     |
| **Exact colors**                 | Not defined     |
| **Mapping from amount to angle** | Not defined     |
| **Rounding/abbreviation rule**   | Not defined     |
| **Animation**                    | Not represented |

_The visible metric ratio is $12,500 / $20,000 = 62.5%, but the screenshot does not establish that the rendered arc or needle uses this exact mapping._

### Adjust Goal Action

**Observed text:** Adjust Goal

- Outlined rectangular control.
- Teal-looking text and border.
- Pencil/edit icon after the text.
- Positioned beneath the metrics and gauge.

| Property                     | Specification                                              |
| :--------------------------- | :--------------------------------------------------------- |
| **Variant classification**   | Outlined secondary-looking action; not a confirmed variant |
| **Width/height**             | Not defined                                                |
| **Padding/gap**              | Not defined                                                |
| **Border width/color/style** | Exact values not defined                                   |
| **Background**               | Exact value not defined                                    |
| **Radius**                   | Not defined                                                |
| **Font properties**          | Not defined                                                |
| **Icon dimensions**          | Not defined                                                |
| **Click behavior**           | Not defined                                                |

---

## 9. Saving Summary Card

### Header and Legend

| Element                     | Observed content       |
| :-------------------------- | :--------------------- |
| **Title**                   | Saving Summary         |
| **Period selector**         | Mar 2022               |
| **Selector icon**           | Downward chevron       |
| **Current series label**    | This month             |
| **Comparison series label** | Same period last month |

_Content inconsistency: The selector displays Mar 2022, while the chart’s horizontal labels use May dates. Preserve the source content and flag this for clarification rather than silently changing the period._

### Chart Appearance

- A solid teal-looking line represents the current series.
- A pale comparison line appears behind it.
- A translucent, fading teal area extends below the current line.
- Curves are smoothed rather than visibly angular.
- Light gridlines appear within the plot.
- Legend swatches precede the labels.
- No tooltip, hover marker, or selected data point is visible.

### Axis Labels

**Y-axis (top to bottom):**

```text
$5000
$2000
$500
$0
```

**X-axis (left to right):**

```text
May 01
May 05
May 10
May 15
May 20
May 25
May 30
```

_These are visual transcriptions. Underlying editable text and formatting are unavailable._

### Chart Requirements Not Defined

- Numerical datasets for either series.
- Number of underlying samples.
- Axis scale type.
- Plot minimum and maximum.
- Line thickness.
- Smoothing algorithm.
- Gridline width/style/color.
- Gradient stops, opacity, and direction.
- Plot padding.
- Tooltip content and behavior.
- Selector options.
- Legend toggling.
- Data loading or empty states.

_Do not infer numerical values from the rasterized curves or assume a chart scale from the uneven tick labels._

---

## 10. Expenses Goals by Category

### Section Heading

**Observed content:** Expenses Goals by Category

_Preserve the plural wording "Expenses"._

### Card Content and Order

| Position            | Category       | Goal amount | Action |
| :------------------ | :------------- | :---------- | :----- |
| **Row 1, column 1** | Housing        | $250.00     | Adjust |
| **Row 1, column 2** | Food           | $250.00     | Adjust |
| **Row 1, column 3** | Transportation | $250.00     | Adjust |
| **Row 2, column 1** | Entertainment  | $250.00     | Adjust |
| **Row 2, column 2** | Shopping       | $250.00     | Adjust |
| **Row 2, column 3** | Others         | $250.00     | Adjust |

### Shared Card Structure

```text
Category card
├── Category icon tile
├── Text group
│   ├── Category label
│   └── $250.00
└── Adjust action
    ├── Adjust
    └── Pencil/edit icon
```

**Observed styling:**

- Category labels appear muted.
- Amounts appear darker and heavier.
- Icon tiles sit on the left.
- Adjust actions sit on the right.
- Adjust controls have a thin teal-looking outline, teal-looking text, and a trailing pencil icon.

### Shared Action Specification

| Property                     | Source status                             |
| :--------------------------- | :---------------------------------------- |
| **Text**                     | Adjust                                    |
| **Count**                    | Six                                       |
| **Variant**                  | Outlined secondary-looking; not confirmed |
| **Dimensions**               | Not defined                               |
| **Padding**                  | Not defined                               |
| **Text-to-icon gap**         | Not defined                               |
| **Border/radius/background** | Exact values not defined                  |
| **Typography**               | Not defined                               |
| **Interaction**              | Not defined                               |

_No category-specific edit form, dialog, or validation state is shown._

---

## 11. Complete Typography Inventory

| Role                     | Content                                                            |
| :----------------------- | :----------------------------------------------------------------- |
| **Branding**             | FINEbank.IO                                                        |
| **Navigation**           | Overview, Balances, Transactions, Bills, Expenses, Goals, Settings |
| **Lower action**         | Logout                                                             |
| **Profile**              | Tanzir Rahman, View profile                                        |
| **Header date**          | May 19, 2023                                                       |
| **Search placeholder**   | Search here                                                        |
| **Page heading**         | Goals                                                              |
| **Savings card title**   | Savings Goal                                                       |
| **Date-range endpoints** | 01 May, 31 May                                                     |
| **Metric labels**        | Target Achieved, This month Target                                 |
| **Metric values**        | $12,500, $20,000                                                   |
| **Gauge values**         | $0, 12K, $20K                                                      |
| **Gauge caption**        | Target vs Achievement                                              |
| **Savings action**       | Adjust Goal                                                        |
| **Chart title**          | Saving Summary                                                     |
| **Chart selector**       | Mar 2022                                                           |
| **Legend**               | This month, Same period last month                                 |
| **Y-axis**               | Four labels in Section 9                                           |
| **X-axis**               | Seven labels in Section 9                                          |
| **Category heading**     | Expenses Goals by Category                                         |
| **Category labels**      | Six labels in Section 10                                           |
| **Category amounts**     | $250.00, six occurrences                                           |
| **Category actions**     | Adjust, six occurrences                                            |

**For every role above, the following values are not defined:**

- Font family.
- Font size in pixels.
- Numeric font weight.
- Line height.
- Letter spacing.
- Exact HEX/RGBA text color.
- Text-box dimensions.
- Text resizing mode.
- Underlying text alignment property.
- Case transformation and decoration properties.

_Observed emphasis does not establish a numeric weight such as 500, 600, or 700._

---

## 12. Icons and Media Assets

| Region             | Visible assets                                                  | Exact dimensions/colors/paths |
| :----------------- | :-------------------------------------------------------------- | :---------------------------- |
| **Sidebar**        | Navigation icons, logout icon, avatar, overflow icon            | Not defined                   |
| **Header**         | Double chevrons, bell, indicator, search icon                   | Not defined                   |
| **Savings card**   | Trophy-like icon, target-like icon, selector chevron, edit icon | Not defined                   |
| **Gauge**          | Arcs, needle, pivot                                             | Not defined                   |
| **Summary chart**  | Selector chevron, legend swatches, chart paths                  | Not defined                   |
| **Category cards** | Six category icons and six edit icons                           | Not defined                   |

_All assets are embedded in the raster image. No separate vectors or original media assets are available within the selected frame._

---

## 13. Component States and Behavior

| State                         | Source evidence             |
| :---------------------------- | :-------------------------- |
| **Default**                   | Visible screenshot          |
| **Selected navigation**       | Goals appearance is visible |
| **Hover**                     | Not represented             |
| **Focus/focus-visible**       | Not represented             |
| **Active/pressed**            | Not represented             |
| **Disabled**                  | Not represented             |
| **Error**                     | Not represented             |
| **Loading**                   | Not represented             |
| **Empty goals**               | Not represented             |
| **Open date/period selector** | Not represented             |
| **Open adjustment dialog**    | Not represented             |
| **Chart tooltip**             | Not represented             |

### Explicitly Undefined

- Navigation destinations.
- Logout/profile/overflow behavior.
- Notification and search behavior.
- Date-range and period options.
- Adjustment dialog content.
- Editable field labels, placeholders, and dimensions.
- Validation rules and error messages.
- Error border colors.
- Focus outline width, offset, and color.
- Hover or disabled treatments.
- Gauge/chart animations.

_No checkboxes or input fields are visible apart from the search-field appearance. No primary filled button is visible in the content area._

_Accessible keyboard focus must be specified separately; its absence from the screenshot does not justify suppressing it._

---

## 14. Implementation Verification Contract

### Supported Requirements

1. Preserve the full visible screen hierarchy.
2. Keep Goals selected in the sidebar.
3. Include the header without adding a greeting.
4. Preserve the two-card summary row.
5. Preserve both savings metrics and gauge labels.
6. Preserve Saving Summary and provide a live current-month versus previous-month daily savings chart. The screenshot's Mar 2022 selector/May-axis mismatch is resolved in favor of the current month.
7. Display six category cards in the specified order.
8. Display $250.00 and an Adjust action in every category card.
9. Preserve currency punctuation and displayed capitalization.
10. Use the confirmed outer background `#F4F5F7`.

### Required Before a Fully Precise Production Build

- Internal layout measurements and responsive rules.
- Typography tokens.
- Exact internal colors, borders, radii, and shadows.
- Independent icon and avatar assets.
- Gauge mapping and abbreviation rules.
- Chart datasets and scale configuration.
- Resolution of the March-selector/May-axis mismatch.
- Selector options and adjustment workflows.
- Accessible interaction and state styling.
- Authoritative editable text for exact content validation.

_The source supports a complete visible-element inventory, but not a fully measured internal implementation specification. Unavailable values remain undefined rather than being guessed._

## 15. Implemented Dynamic Data and Goal Editing

- Savings achieved is the current calendar month's net savings: income minus expenses, accumulated through the current day.
- A user's monthly savings target is stored independently and reused each month. If it has not been set, the card displays **Not set** and progress remains at zero until a target is added.
- The Saving Summary chart compares cumulative daily net savings through the current day with the same day range in the previous month. For a shorter previous month, the comparison line remains at that month's final cumulative value after its last day.
- Category cards list all of the signed-in user's expense categories. Their monthly targets use the existing per-category budget records for the current month; categories without a budget show **Not set**.
- **Adjust Goal** and each category's **Adjust** action open an accessible amount dialog. A valid positive amount is saved to the database; category goals update the existing current-month budget.
- All monetary values follow the app's UAH display convention. Category order follows the six names shown in the raster when present; additional categories follow alphabetically.
- The savings target persistence requires migration `008_create_savings_goal`; apply pending Kysely migrations before using the Goals page.
