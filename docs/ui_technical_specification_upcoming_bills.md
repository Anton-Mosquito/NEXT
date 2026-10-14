# UI Technical Specification — Upcoming Bills, Without Navigation Menu

## 1. Scope and Evidence

### Source

#### Included
* **Top header:**
  * Date and double-chevron icon.
  * Notification bell and indicator.
  * Search field.
  * Upcoming Bills heading.
* **Bills table:**
  * Five column headers.
  * Two bill rows.
  * Due-date badges.
  * Vendor logos.
  * Item titles and descriptions.
  * Last-charge dates.
  * Amount containers.

#### Excluded
* Left navigation menu.
* Branding within the navigation menu.
* Logout control.
* Profile information.

### Source Limitation
The selected frame contains one flattened raster image. The visible interface does not contain separate text layers, vectors, components, or auto-layout containers.

This specification distinguishes:
* **Confirmed:** Values available directly from Figma properties.
* **Visually observed:** Content or arrangement readable in the image.
* **Not defined:** Values unavailable from this source.

Exact internal typography, spacing, colors, and component dimensions cannot be recovered as authoritative design properties. No estimates are presented as confirmed values.

---

## 2. Confirmed Source Container

| Property | Confirmed value |
| :--- | :--- |
| Width | 1440px |
| Height | 1024px |
| Horizontal sizing | Fixed |
| Vertical sizing | Fixed |
| Layout mode | NONE |
| Parent constraints | Left/top |
| Padding: top/right/bottom/left | 0px / 0px / 0px / 0px |
| Minimum width/height | Not set |
| Maximum width/height | Not set |
| Background | #F4F5F7 |
| Border | None |
| Corner radius | 0px |
| Effects/shadows | None on the outer frame |
| Opacity | 100% |
| Clip content | Enabled |
| Prototype reactions | None |

### Raster Content

| Property | Confirmed value |
| :--- | :--- |
| Position inside frame | x: 0px; y: 0px |
| Width | 1440px |
| Height | 1024px |
| Horizontal/vertical sizing | Fixed |
| Image fill mode | FILL |
| Image transform | Identity |
| Rotation | 0° |
| Image filters | All neutral |
| Opacity | 100% |
| Border | None |
| Corner radius | 0px |
| Effects | None on the image rectangle |
| Constraints | Center horizontally and vertically |

> **Important:** The source dimensions include the excluded navigation menu. The width and position of a navigation-free implementation are not independently specified.
> 
> Visible card shadows, rounded corners, and separators are embedded in the image. They are not independently configured Figma properties.

---

## 3. Visible Interface Hierarchy

```text
Upcoming Bills content
├── Header
│   ├── Date display
│   │   ├── Double-chevron icon
│   │   └── May 19, 2023
│   ├── Notification bell
│   │   └── Notification indicator
│   └── Search field
│       ├── Search here
│       └── Search icon
```

*This is a semantic decomposition of the image, not an existing editable layer hierarchy.*

---

## 4. Overall Layout and Container Architecture

### Observed Arrangement
* A horizontal header sits above the main content.
* The date is on the header’s left side.
* Notification and search controls are on the right side.
* The main content begins with the section heading.
* A single bills card sits below the heading.
* The card contains a five-column, two-row table.
* Substantial empty background space remains beneath the card.

### Layout Specification Availability

| Region | Visible arrangement | Exact properties unavailable |
| :--- | :--- | :--- |
| Navigation-free content area | Header above main content | Width, height, offsets, positioning strategy |
| Header | Horizontal left/right groups | Flex/Grid definition, gap, padding, sizing rules |
| Main content | Heading above card | Direction metadata, padding, margins, gap |
| Bills card | Header followed by two rows | Width, height, padding, sizing constraints |
| Bill row | Five horizontally arranged cells | Column widths, alignment properties, row height |
| Due-date badge | Month above day | Gap, padding, dimensions |
| Item description | Title above paragraph | Gap, width, sizing constraints |
| Amount container | Centered-looking amount text | Dimensions, padding, alignment properties |

### Implementation Mapping
A semantic HTML table is appropriate for the visible five-column data structure. This is an implementation recommendation, not a confirmed Figma layout mode.

No responsive breakpoints, mobile arrangement, overflow strategy, wrapping rules, or sticky-header behavior are provided.

### Internal Surface Styling

| Surface | Visually observed treatment | Exact values |
| :--- | :--- | :--- |
| Header | Light background; subtle bottom separator | Not defined |
| Bills card | White-looking background; rounded corners; soft shadow | Not defined |
| Due-date badges | Light neutral background; slightly rounded corners | Not defined |
| Amount containers | Light background; thin neutral outline; slightly rounded corners | Not defined |
| Table separators | Subtle horizontal lines | Not defined |

The outer frame background `#F4F5F7` is confirmed. Other color values must not be inferred from earlier screens.

---

## 5. Header

### Visible Content

| Element | Visible content |
| :--- | :--- |
| Date | May 19, 2023 |
| Date icon | Two right-facing chevrons |
| Notification icon | Bell |
| Notification indicator | Small colored mark near the bell’s upper-right area |
| Search placeholder | Search here |
| Search icon | Magnifying glass at the right end of the field |

### Search Field

| Requirement | Specification |
| :--- | :--- |
| Visible external label | None |
| Placeholder text | Search here |
| Native input semantics | Not defined |
| Width/height | Not defined |
| Padding: top/right/bottom/left | Not defined |
| Background color | Not defined |
| Border width/color/style | Not defined |
| Border radius | Not defined |
| Shadow | Not defined |
| Placeholder typography | Not defined |
| Entered text styling | Not represented |
| Error message | None visible |
| Validation styling | Not represented |
| Focus state | Not represented |
| Disabled state | Not represented |
| Submission behavior | Not defined |

There is no visible separate search-submit button.

---

## 6. Section Heading

**Visible text:** `Upcoming Bills`

| Property | Specification |
| :--- | :--- |
| Placement | Above the bills card |
| Alignment | Visually left-aligned |
| Font family | Not defined |
| Font size | Not defined |
| Numeric font weight | Not defined |
| Line height | Not defined |
| Letter spacing | Not defined |
| Exact text color | Not defined |
| Dimensions | Not defined |
| Margin/gap to card | Not defined |

---

## 7. Bills Table

### Column Order

| Order | Header |
| :--- | :--- |
| 1 | Due Date |
| 2 | Logo |
| 3 | Item Description |
| 4 | Last Charge |
| 5 | Amount |

### Observed Alignment
* Due-date badges appear beneath the first header.
* Vendor logos align within the second column.
* Item titles and descriptions are left-aligned within the third column.
* Last-charge dates occupy the fourth column.
* Amount containers occupy the rightmost column.
* Headers appear darker and heavier than descriptions and dates.
* A subtle divider appears below the table header.
* A subtle divider separates the two bill rows.
* No prominent vertical dividers are visible.

Exact text alignment values, column widths, row heights, and cell padding are not defined.

### Visible Rows

| Bill | Due month | Due day | Item title | Last charge | Amount |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Figma | May | 15 | Figma - Yearly Plan | 14 May, 2022 | $150 |
| Adobe | Jun | 16 | Adobe Inc - Yearly Plan | 17 Jun, 2022 | $559 |

### Item Descriptions
Both rows visibly use the same description:
> For advanced security and more flexible controls, the Professional plan helps you scale design processes company-wide.

This is a visual transcription, not extracted editable text. Exact underlying whitespace and original line-break characters are unavailable. The paragraph appears across multiple lines. Its displayed wrapping must not be interpreted as authored newline characters.

---

## 8. Due-Date Badges

Each badge contains:
* A month abbreviation.
* A day number beneath it.

| Badge | Month | Day |
| :--- | :--- | :--- |
| Figma | May | 15 |
| Adobe | Jun | 16 |

### Observed Styling
* Light neutral background.
* Slightly rounded corners.
* Month text appears smaller and lighter.
* Day text appears larger, darker, and heavier.
* Month and day appear centered within the badge.

### Unavailable Values
* Badge dimensions.
* Padding and month-to-day spacing.
* Radius.
* Border.
* Exact background color.
* Exact month/day typography and colors.

These badges are not confirmed buttons or interactive controls.

---

## 9. Vendor Logos and Icons

### Vendor Media

| Asset | Visible appearance | Location | Exact dimensions |
| :--- | :--- | :--- | :--- |
| Figma logo | Multicolored symbol with Figma wordmark | First row, Logo column | Not defined |
| Adobe logo | Red symbol with Adobe wordmark | Second row, Logo column | Not defined |

Both logos are embedded in the screenshot. There are no independently exportable logo components or vector paths.

> **Do not** reconstruct brand logos using plain text, substitute an unrelated icon, or guess brand HEX values from this source.

### Header Icons

| Icon | Placement | Dimensions | Fill/stroke |
| :--- | :--- | :--- | :--- |
| Double chevron | Before date | Not defined | Not defined |
| Bell | Left of search field | Not defined | Not defined |
| Notification indicator | Near bell’s upper-right area | Not defined | Not defined |
| Magnifying glass | Right side of search field | Not defined | Not defined |

---

## 10. Amount Containers and Interactive Components

### Amount Containers

| Row | Text |
| :--- | :--- |
| Figma | $150 |
| Adobe | $559 |

**Observed treatment:**
* Thin neutral-looking outline.
* Slightly rounded rectangular shape.
* Dark, heavier text.
* Text appears centered.

Semantics are not defined. These elements may be static amount displays; their appearance alone does not establish that they are buttons.

| Requirement | Source status |
| :--- | :--- |
| Button variant | Not defined |
| Width/height | Not defined |
| Padding | Not defined |
| Border width/color/style | Not defined |
| Background | Not defined |
| Radius | Not defined |
| Text typography | Not defined |
| Click behavior | Not defined |
| Hover/active treatment | Not represented |

### Other Controls
* No payment action, edit action, remove action, checkbox, sorting control, pagination control, or Load More button is visible.
* No link destination is defined.
* Vendor wordmarks are visible media, not confirmed links.

---

## 11. Complete Typography Inventory

| Role | Visible text |
| :--- | :--- |
| Header date | May 19, 2023 |
| Search placeholder | Search here |
| Section heading | Upcoming Bills |
| Table header | Due Date |
| Table header | Logo |
| Table header | Item Description |
| Table header | Last Charge |
| Table header | Amount |
| First due month | May |
| First due day | 15 |
| First item title | Figma - Yearly Plan |
| First description | Description specified in Section 7 |
| First last-charge date | 14 May, 2022 |
| First amount | $150 |
| Second due month | Jun |
| Second due day | 16 |
| Second item title | Adobe Inc - Yearly Plan |
| Second description | Description specified in Section 7 |
| Second last-charge date | 17 Jun, 2022 |
| Second amount | $559 |
| Logo lettering | Figma, Adobe — embedded in brand artwork |

For every text role above, the following are **not defined**:
* Font family.
* Font size in pixels.
* Numeric font weight.
* Line height.
* Letter spacing.
* Exact HEX/RGBA color.
* Text-box dimensions.
* Text resizing mode.
* Underlying text alignment property.
* Text transform and decoration properties.

No typography tokens or text styles can be associated with these rasterized elements.

---

## 12. Component States

| State | Source evidence |
| :--- | :--- |
| Default | Visible image only |
| Hover | Not represented |
| Focus/focus-visible | Not represented |
| Active/pressed | Not represented |
| Disabled | Not represented |
| Error | Not represented |
| Loading | Not represented |
| Empty bills list | Not represented |
| Overdue bill | Not represented |
| Paid bill | Not represented |

### Explicitly Unspecified
* Focus outline color, width, radius, and offset.
* Error border color or validation message styling.
* Hover background, shadow, and text-color changes.
* Disabled opacity.
* Payment status accents.
* Search behavior and search-result states.
* Amount-container behavior.

> **Note:** Absent design evidence does not justify suppressing accessible keyboard focus. Any production focus styling must be separately approved rather than attributed to this screenshot.

---

## 13. Implementation Verification Contract

### Confirmed or Visually Supported Requirements
* Exclude the navigation menu.
* Preserve the header and main-content hierarchy.
* Display Upcoming Bills.
* Use the five table columns in the specified order.
* Display exactly two bills in the captured state.
* Preserve the visible dates, item titles, descriptions, and amounts.
* Include both vendor logos.
* Place month/day badges in the Due Date column.
* Use the confirmed outer background `#F4F5F7`.

### Required Before an Exact Production Rewrite
* Navigation-free layout dimensions.
* Internal spacing and sizing values.
* Typography tokens.
* Exact internal colors.
* Card radius and shadow definitions.
* Divider and amount-container border definitions.
* Independent logo/icon assets.
* Responsive requirements.
* Interaction semantics and accessible state styling.
* Authoritative editable text for exact string validation.

The screenshot supports a complete visible-element inventory, but not a fully precise internal CSS specification. Unavailable values are intentionally left undefined to satisfy the requirement not to guess.