# UI Technical Specification — Account Details, Excluding Navigation

## 1. Scope and Source Reliability

### Source
*Selected Figma frame / Raster visual source.*

### Included
* **Top header:** date, notification indicator, and search field.
* **Account Details heading.**
* **Account information card.**
* **Edit Details** and **Remove** actions.
* **Transactions History heading.**
* **Transaction table.**
* **Load More** button.

### Excluded
* Left navigation menu, branding, profile information, and logout action.

### Critical Source Limitation
The selected frame contains **one flattened raster image**, not separate text, layout, or component layers.

Consequently:
* The outer frame’s properties are technically verifiable.
* Internal content and visual hierarchy can be documented from the image.
* Internal font families, weights, precise colors, spacing, dimensions, borders, radii, and shadows cannot be verified as Figma properties.
* No internal components, variants, input metadata, or interactions are available.
* Values from earlier Header or Balances specifications must not be treated as confirmed values for this image.

> **Note:** This document intentionally marks unavailable values rather than inventing production requirements. It is a source-constrained specification, not a fully measured implementation contract.

---

## 2. Confirmed Outer Container Properties

### Outer Frame Properties
| Property | Confirmed value |
| :--- | :--- |
| **Source frame dimensions** | 1440px × 1024px |
| **Horizontal sizing** | Fixed |
| **Vertical sizing** | Fixed |
| **Figma layout mode** | NONE |
| **Padding** | 0px on all sides |
| **Minimum width/height** | Not set |
| **Maximum width/height** | Not set |
| **Background fill** | `#F4F5F7` |
| **Corner radius** | 0px |
| **Border** | None |
| **Shadow/effects** | None on the outer frame |
| **Opacity** | 1 |
| **Clip content** | Enabled |
| **Parent constraints** | Left/top |
| **Prototype reactions** | None |

### Raster Child Properties
| Property | Confirmed value |
| :--- | :--- |
| **Position** | x: 0px; y: 0px |
| **Dimensions** | 1440px × 1024px |
| **Horizontal/vertical sizing** | Fixed |
| **Image scale mode** | FILL |
| **Image rotation** | 0° |
| **Image transform** | Identity |
| **Opacity** | 1 |
| **Corner radius** | 0px |
| **Border** | None |
| **Effects** | None on the image rectangle |
| **Constraints** | Center horizontally and vertically |

> **Important:** Rounded cards, dividers, and shadows visible within the image are embedded pixels. They are not independently configured Figma effects. The dimensions above include the excluded navigation menu. The navigation-free content width is not independently defined in the layer tree.

---

## 3. Visible Content Architecture

The following hierarchy describes the visible interface, not an existing editable layer hierarchy.

```text
Account Details content
├── Top header
│   ├── Double-chevron/date display
│   ├── Notification bell with status indicator
│   └── Search field
│       ├── Search here
│       └── Search icon
└── Main content
    ├── Account Details heading
    ├── Account information card
    ├── Transactions History heading
    └── Transactions table & actions
```

---

## 4. Overall Layout and Container Architecture

### Layout Regions
| Region | Visible arrangement | Exact implementation values |
| :--- | :--- | :--- |
| **Navigation-free page area** | Header above vertically stacked content | Width, height, and offsets unavailable |
| **Top header** | Date on the left; notification and search on the right | Flex/Grid mode, padding, alignment, gaps unavailable |
| **Main content** | Account section followed by transaction section | Padding, margins, section gaps unavailable |
| **Account card** | Three information columns in the first row; two populated columns in the second row; actions below | Column widths, row gaps, card padding unavailable |
| **Transactions card** | Five-column table with four rows and a bottom action | Column widths, cell padding, row heights unavailable |

### Internal Surface Properties
| Surface | Visible treatment | Technically verified values |
| :--- | :--- | :--- |
| **Header** | Light background with a subtle bottom divider | Internal background and divider values unavailable |
| **Account card** | White-looking surface, rounded corners, soft shadow | Exact fill, radius, shadow unavailable |
| **Transactions card** | White-looking surface, rounded corners, soft shadow | Exact fill, radius, shadow unavailable |
| **Search field** | White-looking rounded field | Exact fill, radius, border, shadow unavailable |

*No responsive breakpoints, fluid sizing rules, wrapping behavior, or min/max constraints are defined for these internal regions.*

---

## 5. Header

### Visible Elements
| Element | Visible content or appearance |
| :--- | :--- |
| **Date** | May 19, 2023 |
| **Date icon** | Two right-facing chevrons before the date |
| **Notification** | Bell with a small colored indicator |
| **Search placeholder** | Search here |
| **Search icon** | Magnifying glass at the right end of the field |

### Search Field Specification
| Requirement | Source status |
| :--- | :--- |
| **Native input semantics** | Not available; appearance is embedded in an image |
| **Visible external label** | None visible |
| **Placeholder** | Search here |
| **Field dimensions** | Unavailable |
| **Internal padding** | Unavailable |
| **Border width/style/color** | Unavailable |
| **Background color** | Unavailable |
| **Radius** | Unavailable |
| **Placeholder typography** | Unavailable |
| **Entered-value typography** | Not represented |
| **Error/helper text** | None visible |
| **Focus treatment** | Not represented |
| **Disabled treatment** | Not represented |
| **Search submission behavior** | Not defined |

---

## 6. Account Details Section

### Heading
* **Visible content:** `Account Details`
* *Exact typography, text bounds, and spacing to the card are unavailable.*

### Account Information
| Position | Label | Visible value |
| :--- | :--- | :--- |
| **First row, first column** | Bank Name | AB Bank Ltd. |
| **First row, second column** | Account Type | Checking |
| **First row, third column** | Balance | $25,056.00 |
| **Second row, first column** | Branch Name | Park Street Branch |
| **Second row, second column** | Account Number | Masked account number beginning `133 456 886 8` |

> **Masked account number note:** The number and trailing asterisks are rasterized. Exact whitespace and masking-character count are not sufficiently verifiable to serve as an authoritative string. Confirm the source text before implementation.

### Information Styling
* Labels appear lighter and less prominent than values.
* Values appear darker and heavier.
* Labels sit above their corresponding values.
* Account information is left-aligned within its columns.
* Exact typography and geometric values remain unspecified.

### Account Actions
| Action | Visible treatment | Icon | Defined behavior |
| :--- | :--- | :--- | :--- |
| **Edit Details** | Filled teal-looking rectangular button with light text and slightly rounded corners | None visible | Not defined |
| **Remove** | Small neutral text action on a transparent-looking background | None visible | Not defined |

* **Variant classification:** *Edit Details* resembles a primary action; *Remove* resembles a text/ghost action. These are appearance-based classifications, not confirmed design-system variants.
* Dimensions, internal padding, spacing between actions, colors, radius, and font tokens are unavailable.

---

## 7. Transactions History Section

### Heading
* **Exact visible content:** `Transactions History`
* *Do not replace it with "Transaction History"; the image uses the plural form "Transactions".*

### Table Structure
Five columns are visible, in this order:
1. Date
2. Status
3. Transaction Type
4. Receipt
5. Amount

Four transaction rows are visible.

### Row Content
| Row | Date | Status | Transaction Type | Receipt | Amount |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | 17 Apr, 2023 | Complete | Credit | Rasterized identifier; exact transcription unverified | $160.00 |
| **2** | 17 Apr, 2023 | Complete | Credit | Rasterized identifier; exact transcription unverified | $160.00 |
| **3** | 17 Apr, 2023 | Complete | Credit | Rasterized identifier; exact transcription unverified | $160.00 |
| **4** | 17 Apr, 2023 | Complete | Credit | Rasterized identifier; exact transcription unverified | $160.00 |

*Receipt identifiers must be confirmed from an authoritative text source. Do not substitute an invented identifier.*

### Visible Table Styling
* Header text appears heavier than body text.
* Dates align toward the left edge.
* Status, transaction type, and receipt values appear centered within their respective regions.
* Amounts align toward the right edge.
* Subtle horizontal separators are visible between the header and rows.
* No vertical column dividers are visibly prominent.
* No row selection checkbox, status badge, sorting icon, or pagination control is visible.
* Exact column sizing, cell alignment rules, divider values, cell padding, and row heights cannot be verified from the layer tree.

### Load More Action
| Property | Source status |
| :--- | :--- |
| **Text** | Load More |
| **Placement** | Horizontally centered beneath the transaction rows |
| **Appearance** | Filled teal-looking button with light text |
| **Icon** | None visible |
| **Variant** | Primary-looking; actual component variant unavailable |
| **Dimensions/padding** | Unavailable |
| **Radius** | Unavailable |
| **Typography** | Unavailable |
| **Interaction** | Not defined |
| **Loading / end state** | Not represented |

---

## 8. Typography Inventory

Every visible text role is listed below. No internal font metadata exists in this source.

| Text role | Content |
| :--- | :--- |
| **Header date** | May 19, 2023 |
| **Search placeholder** | Search here |
| **Section heading** | Account Details |
| **Information label** | Bank Name |
| **Information value** | AB Bank Ltd. |
| **Information label** | Account Type |
| **Information value** | Checking |
| **Information label** | Balance |
| **Information value** | $25,056.00 |
| **Information label** | Branch Name |
| **Information value** | Park Street Branch |
| **Information label** | Account Number | Masked account number; exact string requires confirmation |
| **Primary action** | Edit Details |
| **Text action** | Remove |
| **Section heading** | Transactions History |
| **Table headers** | Date, Status, Transaction Type, Receipt, Amount |
| **Table dates** | 17 Apr, 2023, repeated four times |
| **Table statuses** | Complete, repeated four times |
| **Table transaction types** | Credit, repeated four times |
| **Table receipts** | Four rasterized identifiers requiring confirmation |
| **Table amounts** | $160.00, repeated four times |
| **Bottom action** | Load More |

For **each** text role above, the following properties are **unavailable**:
* Font family
* Font size
* Numeric font weight
* Exact line height
* Letter spacing
* Exact HEX/RGBA text color
* Text-box dimensions and resizing mode
* Actual text transform
* Confirmed text alignment property

*Do not assign Inter, specific weights, or previously observed typography tokens without additional evidence.*

---

## 9. Icons and Media Assets

| Asset | Visible placement | Exact size/color/path |
| :--- | :--- | :--- |
| **Double-chevron icon** | Before the header date | Unavailable |
| **Notification bell** | Left of the search field | Unavailable |
| **Notification indicator** | Near the bell’s upper-right region | Unavailable |
| **Search magnifying glass** | Right side of the search field | Unavailable |

* No account logo or additional media is visible in the account information or transaction sections.
* The icons are embedded in the raster image. There are no independent vector paths or icon components to export.

---

## 10. Component States and Behavior

| State | Source evidence |
| :--- | :--- |
| **Default** | Visible raster appearance only |
| **Hover** | Not represented |
| **Focus / focus-visible** | Not represented |
| **Active / pressed** | Not represented |
| **Disabled** | Not represented |
| **Error / validation** | Not represented |
| **Loading** | Not represented |
| **Empty transactions** | Not represented |
| **Search results / no results** | Not represented |

### Explicitly Undefined
* Focus ring width, offset, and color.
* Error border color and helper-message styling.
* Hover backgrounds or text-color changes.
* Disabled opacity or cursor behavior.
* Button press effects.
* Edit destination or dialog.
* Remove confirmation behavior.
* Search behavior.
* Load More request, pagination model, and loading feedback.

> *The absence of represented states does not imply that keyboard focus styling or other accessibility requirements should be omitted in production. Those requirements need a separate implementation decision, not an invented Figma value.*

---

## 11. Implementation Boundaries

### Confirmed Requirements
* Exclude the navigation menu from the requested interface.
* Preserve the visible content hierarchy.
* Include the header, account information, transaction table, and all three content actions.
* Display four transaction rows in the captured state.
* Preserve confirmed visible copy, punctuation, and amount formatting.
* Use `#F4F5F7` as the confirmed outer frame background.

### Outstanding Inputs Required for a Fully Precise Build
* Editable layers or an authoritative design-token specification.
* Exact navigation-free content bounds.
* All internal container dimensions, padding, and gaps.
* Typography values for every text role.
* Internal surface, text, divider, button, and icon colors.
* Card radii and shadow definitions.
* Exact masked account-number string and receipt identifiers.
* Responsive behavior.
* Interaction and state requirements.

*No exact internal CSS values are supplied because the source does not define them independently. Providing such values would contradict the requirement not to guess.*