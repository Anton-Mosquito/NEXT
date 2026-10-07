# UI Technical Specification: Overview Screen — Navbar Component

## 1. Component Overview

| Property | Value |
| :--- | :--- |
| **Component Name** | Nav bar |
| **Figma Node ID** | `411:6510` |
| **Component Type** | Instance (Vertical Sidebar Navigation) |
| **Overall Dimensions** | 280px (W) × 1024px (H) |
| **Role** | Primary left-side navigation for the FINEbank.IO dashboard |

---

## 2. Overall Layout & Container Architecture

### 2.1 Root Container — Nav bar

| Property | Value |
| :--- | :--- |
| **Layout** | Flexbox — `flex-direction: column` |
| **Width** | 280px (Hug content) |
| **Height** | 1024px (Hug content) |
| **Background** | `#191919` (solid, 100% opacity) |
| **Border** | None |
| **Border Radius** | 0px |
| **Box Shadow** | None |
| **Padding** | 48px 28px 48px 28px *(top, right, bottom, left)* |
| **Gap (item-spacing)** | 228px *(between "Logo & Menu" and "Footer" sections)* |
| **Align Items (cross-axis)** | `flex-start` |
| **Justify Content (main-axis)** | `flex-start` |

### 2.2 Structural Zones

The navbar is divided into two primary children separated by a **228px** gap:

```text
┌─────────────────────────────┐
│  padding: 48px 28px         │
│  ┌───────────────────────┐  │
│  │ Logo & Menu (224×504) │  │  ← Zone 1
│  │ - Logo                │  │
│  │ - Menu Items (×7)     │  │
│  └───────────────────────┘  │
│                             │
│     ↕ 228px gap             │
│                             │
│  ┌───────────────────────┐  │
│  │ Footer (224×196)      │  │  ← Zone 2
│  │ - Logout Button       │  │
│  │ - Profile Section     │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

---

## 3. Zone 1: Logo & Menu

### 3.1 Container — Logo & Menu

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6376` |
| **Type** | Frame |
| **Layout** | Flexbox — `flex-direction: column` |
| **Size** | 224px × 504px (Hug × Hug) |
| **Gap** | 40px *(between Logo and Menu list)* |
| **Padding** | 0px all sides |
| **Background** | Transparent |

### 3.2 Logo — FINEbank.IO

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6377` |
| **Type** | Text |
| **Size** | 224px × 32px |
| **Text Align** | center |
| **Text Auto Resize** | Height (width fills container) |
| **Line Height** | 32px |
| **Letter Spacing** | 8% (of font size) |

#### Mixed Typography Segments:

| Segment | Font Family | Font Weight | Font Size | Color |
| :--- | :--- | :--- | :--- | :--- |
| **FINE** | Poppins | 800 (ExtraBold) | 24px | `#FFFFFF` |
| **bank.** | Poppins | 500 (Medium) | 24px | `#FFFFFF` |
| **IO** | Poppins | 800 (ExtraBold) | 24px | `#FFFFFF` |

### 3.3 Menu List Container — Menu

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6378` |
| **Type** | Frame |
| **Layout** | Flexbox — `flex-direction: column` |
| **Size** | 224px × 432px (Hug × Hug) |
| **Gap** | 16px *(between each menu item)* |
| **Padding** | 0px all sides |
| **Background** | Transparent |

### 3.4 Menu Item — Reusable Component Structure

Each menu item is an Instance of the Menu component. All 7 items share the same structural layout. Two visual states exist: **Active** and **Inactive**.

#### Base Menu Item Layout:

| Property | Value |
| :--- | :--- |
| **Layout** | Flexbox — `flex-direction: row` |
| **Size** | 224px × 48px (Hug × Hug) |
| **Align Items (cross-axis)** | `center` |
| **Justify Content (main-axis)** | `flex-start` |
| **Gap** | 12px *(between icon and text label)* |
| **Padding** | 12px 16px 12px 16px |
| **Border Radius** | 4px |

### 3.5 Menu Item States

#### Active State (e.g., "Overview"):

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6379` |
| **Background** | `#299D91` (solid, 100% opacity — teal/green accent) |
| **Icon Color** | `#FFFFFF` at 100% opacity (stroke: 2px, center-aligned) |
| **Text** | "Overview" |
| **Font** | Inter, SemiBold (600), 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0% |
| **Text Color** | `#FFFFFF` at 100% opacity |
| **Text Align** | left |

#### Inactive State (e.g., "Balances", "Transactions", etc.):

| Property | Value |
| :--- | :--- |
| **Background** | Transparent (no fill) |
| **Icon Color** | `#FFFFFF` at 70% opacity → effective `rgba(255, 255, 255, 0.7)` |
| **Text Font** | Inter, Regular (400), 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0% |
| **Text Color** | `#FFFFFF` at 70% opacity → `rgba(255, 255, 255, 0.7)` |
| **Text Align** | left |
| **Instance Opacity** | 1.0 *(opacity is applied at icon-stroke / text-fill level, NOT at the instance)* |

> **Note:** Inactive icons use stroke opacity: 70% on their vector paths. The one exception is the **"Bills"** icon which uses a filled vector (fill `#FFFFFF` at 70% opacity) instead of stroked paths.

### 3.6 Complete Menu Items List

| # | Label | Icon Name | State | Node ID |
| :---: | :--- | :--- | :---: | :--- |
| **1** | Overview | Menu/Overview (4-square grid) | **Active** | `I411:6510;411:6379` |
| **2** | Balances | wallet | Inactive | `I411:6510;411:6380` |
| **3** | Transactions | Transaction (arrows) | Inactive | `I411:6510;411:6381` |
| **4** | Bills | Bill (receipt) | Inactive | `I411:6510;411:6382` |
| **5** | Expenses | Expencces (chart) | Inactive | `I411:6510;411:6383` |
| **6** | Goals | Goal (crosshair/target) | Inactive | `I411:6510;411:6384` |
| **7** | Settings | Menu/Settings (gear) | Inactive | `I411:6510;411:6385` |

---

## 4. Zone 2: Footer

### 4.1 Container — Footer

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6386` |
| **Type** | Frame |
| **Layout** | Flexbox — `flex-direction: column` |
| **Size** | 224px × 196px (Hug × Hug) |
| **Gap** | 44px *(between Logout button and Profile section)* |
| **Padding** | 0px all sides |
| **Background** | Transparent |

### 4.2 Logout Button

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6387` |
| **Type** | Instance (Logout Button) |
| **Layout** | Flexbox — `flex-direction: row` |
| **Size** | 224px × 48px (Hug × Hug) |
| **Align Items (cross-axis)** | `center` |
| **Gap** | 12px |
| **Padding** | 12px 16px 12px 16px |
| **Background** | `#FFFFFF` at 8% opacity → `rgba(255, 255, 255, 0.08)` |
| **Instance Opacity** | 0.75 (75%) — applied at the container level |
| **Border Radius** | 4px |
| **Border** | None |
| **Box Shadow** | None |

#### Logout Icon:

| Property | Value |
| :--- | :--- |
| **Container** | 24×24px frame (fixed) |
| **Icon** | 20×20px vector (Logout), positioned at (0, 2) inside container |
| **Stroke Color** | `#FFFFFF`, 2px, center-aligned |

#### Logout Text:

| Property | Value |
| :--- | :--- |
| **Text** | "Logout" |
| **Font** | Inter, SemiBold (600), 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0% |
| **Color** | `#FFFFFF` at 100% opacity |
| **Text Align** | left |
| **Size** | 156px × 24px (fixed) |

### 4.3 Profile Section

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6388` |
| **Type** | Instance (Profile) |
| **Layout** | Flexbox — `flex-direction: row` |
| **Size** | 224px × 104px (Hug × Hug) |
| **Align Items (cross-axis)** | `center` |
| **Gap** | 32px *(between "Name & Picture" group and kebab icon)* |
| **Padding** | 32px 0px 32px 0px |
| **Background** | Transparent |
| **Border Top** | 1px solid `#FFFFFF` at 8% opacity → `rgba(255, 255, 255, 0.08)`, stroke-align: inside |
| **Border Right/Bottom/Left** | 0px (no stroke) |

#### 4.3.1 Name & Picture Group

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6388;403:5380` |
| **Layout** | Flexbox — `flex-direction: row` |
| **Size** | 188px × 40px (Hug × Hug) |
| **Align Items (cross-axis)** | `center` |
| **Gap** | 16px *(between avatar and name text block)* |

##### Avatar — Image:

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6388;403:5381` |
| **Type** | Ellipse (circle) |
| **Size** | 32px × 32px |
| **Fill** | Image (profile photo) |
| **Border** | None |
| **Border Radius** | 50% (circular) |

##### Name Text Block — Name:

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6388;403:5382` |
| **Layout** | Flexbox — `flex-direction: column` |
| **Size** | 140px × 40px (Hug × Hug) |
| **Gap** | 0px |

###### Primary Name Text:

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6388;403:5383` |
| **Text** | "Tanzir Rahman" |
| **Font** | Inter, SemiBold (600), 16px |
| **Line Height** | 24px |
| **Letter Spacing** | 0% |
| **Color** | `#FFFFFF` at 100% opacity |
| **Text Align** | left |
| **Auto Resize** | Height |

###### Secondary "View profile" Text:

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6388;403:5384` |
| **Text** | "View profile" |
| **Font** | Inter, Regular (400), 12px |
| **Line Height** | 16px |
| **Letter Spacing** | 0% |
| **Color** | `#FFFFFF` at 70% opacity → `rgba(255, 255, 255, 0.7)` |
| **Text Align** | left |
| **Auto Resize** | Width and Height |

#### 4.3.2 Kebab Menu Icon (three-dot vertical)

| Property | Value |
| :--- | :--- |
| **Node ID** | `I411:6510;411:6388;403:5385` |
| **Layout** | Flexbox — `flex-direction: column` |
| **Size** | 4px × 20px (Hug × Hug) |
| **Gap** | 4px *(between each dot)* |

Each dot is an **Ellipse (circle)**:

| Property | Value |
| :--- | :--- |
| **Size** | 4px × 4px |
| **Fill** | `#FFFFFF` at 100% opacity |
| **Count** | 3 dots |

---

## 5. Icons & Media Assets Summary

All navigation icons follow these conventions:

| Property | Value |
| :--- | :--- |
| **Container Size** | 24px × 24px |
| **Stroke Weight** | 2px |
| **Stroke Alignment** | Center |
| **Active Stroke Color** | `#FFFFFF` at 100% opacity |
| **Inactive Stroke Color** | `#FFFFFF` at 70% opacity |
| **Inactive Fill Color (Bills only)** | `#FFFFFF` at 70% opacity |
| **Logout Icon Actual Size** | 20×20px *(inside 24×24 container, offset y: 2px)* |

---

## 6. Design Tokens Summary

### Colors

| Token Name (Suggested) | Value | Usage |
| :--- | :--- | :--- |
| `--nav-bg` | `#191919` | Navbar background |
| `--nav-accent` | `#299D91` | Active menu item background |
| `--nav-text-primary` | `#FFFFFF` | Active text, logo, profile name, logout text |
| `--nav-text-secondary` | `rgba(255, 255, 255, 0.7)` | Inactive menu text, inactive icons, "View profile" |
| `--nav-icon-active` | `#FFFFFF` | Active icon stroke |
| `--nav-icon-inactive` | `rgba(255, 255, 255, 0.7)` | Inactive icon stroke/fill |
| `--nav-logout-bg` | `rgba(255, 255, 255, 0.08)` | Logout button background |
| `--nav-divider` | `rgba(255, 255, 255, 0.08)` | Profile section top border |

### Typography

| Token | Font | Weight | Size | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--logo-bold` | Poppins | 800 (ExtraBold) | 24px | 32px | 8% |
| `--logo-medium` | Poppins | 500 (Medium) | 24px | 32px | 8% |
| `--nav-menu-active` | Inter | 600 (SemiBold) | 16px | 24px | 0 |
| `--nav-menu-inactive` | Inter | 400 (Regular) | 16px | 24px | 0 |
| `--profile-name` | Inter | 600 (SemiBold) | 16px | 24px | 0 |
| `--profile-subtitle` | Inter | 400 (Regular) | 12px | 16px | 0 |

### Spacing

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--nav-padding-vertical` | 48px | Top and bottom padding of navbar |
| `--nav-padding-horizontal` | 28px | Left and right padding of navbar |
| `--nav-zone-gap` | 228px | Gap between Logo/Menu zone and Footer zone |
| `--logo-menu-gap` | 40px | Gap between logo and menu list |
| `--menu-item-gap` | 16px | Gap between menu items |
| `--menu-item-padding` | 12px 16px | Internal padding of each menu item |
| `--menu-icon-text-gap` | 12px | Gap between icon and label in menu item |
| `--footer-gap` | 44px | Gap between logout button and profile section |
| `--profile-avatar-text-gap` | 16px | Gap between avatar and name block |
| `--profile-padding-vertical` | 32px | Top/bottom padding of profile section |
| `--kebab-dot-gap` | 4px | Gap between kebab menu dots |

---

## 7. Component States Reference

### Menu Item States

| State | Background | Text Color | Text Weight | Icon Opacity |
| :--- | :--- | :--- | :--- | :--- |
| **Active** | `#299D91` | `#FFFFFF` 100% | 600 (SemiBold) | 100% |
| **Inactive (Default)** | Transparent | `#FFFFFF` 70% | 400 (Regular) | 70% |
| **Hover** | *(Not explicitly defined in Figma — recommend `rgba(255,255,255,0.08)`)* | — | — | — |
| **Focus** | *(Not explicitly defined — recommend `outline: 2px solid #299D91`)* | — | — | — |

### Logout Button

| State | Background | Container Opacity |
| :--- | :--- | :--- |
| **Default** | `rgba(255,255,255,0.08)` | 75% (0.75) |
| **Hover** | *(Not defined — recommend opacity 1.0 on hover)* | — |
