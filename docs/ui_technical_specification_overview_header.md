# UI Technical Specification — Overview Header

## 1. Source and Scope

### Source
| Property | Value |
| :--- | :--- |
| Source type | Main component |
| Component key | `2bbebeb647b5c3bcdfa367744173141bc841c15e` |
| Dimensions | 1160px × 88px |
| Component properties | None |
| Variants | None |
| Variable bindings | None |
| Prototype interactions | None |

This component differs from the previously inspected header instance: it includes **Hello Tanzir** and has no background fill. Do not apply the earlier instance’s white background or omit the greeting.

All positions below are relative to the specified container. Editor placement is not a page-layout requirement.

---

## 2. Element Hierarchy

```text
Header
├── Greeting/date group
│   ├── Hello Tanzir
│   └── Date group
│       ├── Double-chevron icon
│       └── May 19, 2023
└── Utility group
    ├── Notification icon
    │   ├── Bell body
    │   └── Bell lower detail
    └── Search surface
        ├── Search here
        └── Search icon
```

---

## 3. Shared Interpretation Rules

- All dimensions and distances are in pixels.
- All inspected nodes have `opacity: 1` and `rotation: 0`.
- No inspected nodes have minimum or maximum dimensions set.
- No child uses Fill-container sizing.
- Nodes without visible paints must remain transparent; stored stroke weights alone do not create visible borders.
- Figma does not define CSS margins. Internal spacing is provided by auto-layout gaps, padding, and alignment.
- Fixed-width children must not shrink when reproducing the captured layout.
- No responsive behavior or breakpoint is defined.
- Color HEX values below are rounded to 8-bit RGB. Section 10 additionally preserves the source’s normalized values.

---

## 4. Root Container

### Layout
| Property | Value |
| :--- | :--- |
| Direction | Horizontal |
| Wrapping | No wrap |
| Main-axis alignment | Space between |
| Cross-axis alignment | Center |
| Width sizing | Fixed: 1160px |
| Height sizing | Hug content: resolves to 88px |
| Padding: top/right/bottom/left | 20px / 32px / 20px / 24px |
| Recorded item spacing | 406px |
| Actual inter-group separation | 406px |
| Background | None; transparent |
| Radius/smoothing | 0px / 0 |
| Border | Bottom only, 1px, solid, inside |
| Border color | `#E8E8E8` |
| Border style token | Gray/05 |
| Shadow | None |
| Clipping | Disabled |
| Constraints | Left/top |

### Geometry
```text
1160 = 24 left padding
     + 282 greeting/date group
     + 406 distributed space
     + 416 utility group
     + 32 right padding

88 = 20 top padding + 48 tallest child + 20 bottom padding
```

### CSS Layout Equivalent
The divider is an inside stroke. An inset pseudo-element preserves Figma’s content geometry more accurately than adding a border that participates in CSS box sizing.

```css
.overview-header {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 1160px;
}
```

> **Note:** Do not combine a fixed 406px CSS gap with `space-between`; the latter already produces the measured separation at the specified width.

---

## 5. Greeting and Date Group

### Outer Group
| Property | Value |
| :--- | :--- |
| Position in header | x: 24px; y: 30px |
| Dimensions | 282px × 28px |
| Sizing | Hug width and height |
| Direction | Horizontal, no wrap |
| Main-axis alignment | Start |
| Cross-axis alignment | Center |
| Gap | 24px |
| Padding | 0px on all sides |
| Background/border/shadow | None |
| Radius | 0px |
| Clipping | Disabled |

### Greeting
*Exact content:* `Hello Tanzir`

| Property | Value |
| :--- | :--- |
| Position in group | x: 0px; y: 0px |
| Dimensions | 140px × 28px |
| Width sizing | Fixed |
| Height sizing | Hug |
| Text resizing | Height |
| Typography token | Bold 24-28 |
| Paint token | Default Black |

### Date Group
| Property | Value |
| :--- | :--- |
| Position in outer group | x: 164px; y: 2px |
| Dimensions | 118px × 24px |
| Sizing | Hug width and height |
| Direction | Horizontal, no wrap |
| Main-axis alignment | Start |
| Cross-axis alignment | Center |
| Gap | 4px |
| Padding | 0px |
| Background/border/shadow | None |
| Clipping | Disabled |

### Date Text
*Exact content:* `May 19, 2023`

| Property | Value |
| :--- | :--- |
| Position in date group | x: 28px; y: 2px |
| Dimensions | 90px × 20px |
| Sizing | Hug width and height |
| Text resizing | Width and height |
| Typography token | Regular 14-20 |
| Paint token | Gray/03 |

> **Note:** The layer’s name contains an older year, but its actual text content is 2023. Use the text content.

### Double-Chevron Icon
| Property | Value |
| :--- | :--- |
| Container position in date group | x: 0px; y: 0px |
| Container dimensions | 24px × 24px, fixed |
| Clipping | Enabled |
| Visible background | None |
| Hidden background paint | `#FFFFFF`; must remain hidden |

| Part | Position in icon | Dimensions |
| :--- | :--- | :--- |
| Left chevron | x: 6px; y: 7px | 5px × 10px |
| Right chevron | x: 13px; y: 7px | 5px × 10px |

Both paths use:
```text
M 0 10 L 5 5 L 0 0
```
- **Fill:** none.
- **Stroke:** 2px, centered.
- **Stroke color:** `#9F9F9F`.
- **Caps:** round.
- **Joins:** round.
- **Dash pattern:** none.
- **Vector constraints:** scale horizontally and vertically.

---

## 6. Utility Group

| Property | Value |
| :--- | :--- |
| Position in header | x: 712px; y: 20px |
| Dimensions | 416px × 48px |
| Sizing | Hug width and height |
| Direction | Horizontal, no wrap |
| Main-axis alignment | Start |
| Cross-axis alignment | Center |
| Gap | 40px |
| Padding | 0px |
| Background/border/shadow | None |
| Clipping | Disabled |

```text
416 = 24 notification icon + 40 gap + 352 search surface
```

---

## 7. Notification Icon

### Container
| Property | Value |
| :--- | :--- |
| Position in utility group | x: 0px; y: 12px |
| Position in header | x: 712px; y: 32px |
| Dimensions | 24px × 24px |
| Sizing | Hug width and height |
| Padding | 0px |
| Background/border/shadow | None |
| Inner artwork viewport | 24px × 24px, clipped |
| Component key | `4b411266d6114dfc018a54720af50dfce8262212` |

> **Note:** The container records a 32px gap but contains only one child group, so that value produces no visible spacing.

### Vector Parts (Source Precision)
| Part | X | Y | Width | Height | Fill |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Lower bell detail | 10.2129707 | 21.3333320 | 3.5066668 | 1.5201852 | `#666666` |
| Bell body | 2.0329277 | 1.1833885 | 19.866666 | 19.450002 | `#666666` |
| Badge | 16.6662559 | 0.6667082 | 6.6666665 | 6.6666665 | `#299D91` |
| Bounds vector | 0 | 0 | 24 | 24 | None |

- All four vectors have no visible stroke.
- **Bell paint token:** Gray/01.
- **Badge paint token:** Primary color.
- The bounds vector is unpainted and must not render a rectangle.
- The badge is already present in the default artwork; no unread/read variant is defined.
- Preserve the source icon geometry rather than replacing it with an arbitrary bell.

---

## 8. Search Surface

### Container
| Property | Value |
| :--- | :--- |
| Position in utility group | x: 64px; y: 0px |
| Position in header | x: 776px; y: 20px |
| Dimensions | 352px × 48px |
| Sizing | Hug width and height |
| Direction | Horizontal, no wrap |
| Main-axis alignment | Start |
| Cross-axis alignment | Start |
| Gap | 170px |
| Padding: top/right/bottom/left | 12px / 24px / 12px / 32px |
| Background | `#FFFFFF` |
| Paint token | White |
| Border | None |
| Radius | 12px, all corners |
| Corner smoothing | 0 |
| Clipping | Disabled |
| Component key | `561474605cdad6afa47098486c25cfa9faee7cc9` |

> **Note:** A stored stroke weight of `0.901030957698822px` exists, but the stroke paint list is empty. Do not render a border.

### Shadow
| Property | Value |
| :--- | :--- |
| Type | Drop shadow |
| X offset | 0px |
| Y offset | 26px |
| Blur radius | 26px |
| Spread | 0px |
| Color | `rgba(0, 0, 0, 0.25)` |
| Blend mode | Normal |
| Show behind node | False |

```css
.search-surface {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 170px;
  width: max-content;
}
```

### Placeholder-Like Text
*Exact content:* `Search here`

| Property | Value |
| :--- | :--- |
| Position in search surface | x: 32px; y: 12px |
| Dimensions | 102px × 24px |
| Width sizing | Fixed |
| Height sizing | Hug |
| Text resizing | Height |
| Typography token | Regular 16-24 |
| Paint token | Gray/03 |

### Search Icon
| Property | Value |
| :--- | :--- |
| Position in search surface | x: 304px; y: 12px |
| Dimensions | 24px × 24px, fixed |
| Background | None |
| Clipping | Enabled |
| Component key | `1a1e5dab0b9eaa8ab5946965be4d97b3fe15a215` |

| Part | Position in icon | Dimensions |
| :--- | :--- | :--- |
| Lens | x: 3px; y: 3px | 16px × 16px |
| Handle | x: 16.65px; y: 16.65px | 4.35px × 4.35px |

- Lens center in the icon: `(11px, 11px)`.
- Lens radius: `8px`.
- Handle runs diagonally from its local `(0, 0)` to `(4.35, 4.35)`.
- **Fill:** none.
- **Stroke:** 2px, centered.
- **Color:** `#525256`.
- **Caps and joins:** round.
- **Dash pattern:** none.
- **Paint token:** Secondary.

---

## 9. Complete Typography Specification

| Property | Greeting | Date | Search text |
| :--- | :--- | :--- | :--- |
| Exact text | Hello Tanzir | May 19, 2023 | Search here |
| Font family | Inter | Inter | Inter |
| Font style | Bold | Regular | Regular |
| Font size | 24px | 14px | 16px |
| Numeric weight | 700 | 400 | 400 |
| Line height | 28px | 20px | 24px |
| Letter spacing | 0% / 0px | 0% / 0px | 0% / 0px |
| Horizontal alignment | Left | Left | Left |
| Vertical text alignment | Top | Top | Top |
| Color | `#191919` | `#9F9F9F` | `#9F9F9F` |
| Case transform | None | None | None |
| Decoration | None | None | None |
| Paragraph spacing | 0px | 0px | 0px |
| Paragraph indent | 0px | 0px | 0px |
| Hyperlink | None | None | None |

Font variation settings specify `wght` equal to the listed weight and `slnt: 0`.

---

## 10. Color Tokens and Source Precision

| Token | Rounded HEX | Source normalized RGB |
| :--- | :--- | :--- |
| Default Black | `#191919` | `(0.098039, 0.098039, 0.098039)` |
| Gray/03 | `#9F9F9F` | `(0.625, 0.625, 0.625)` |
| Gray/05 | `#E8E8E8` | `(0.908333, 0.908333, 0.908333)` |
| Gray/01 | `#666666` | `(0.400000, 0.400000, 0.400000)` |
| Primary color | `#299D91` | `(0.160784, 0.615686, 0.568627)` |
| White | `#FFFFFF` | `(1, 1, 1)` |
| Secondary | `#525256` | `(0.321568, 0.321568, 0.337254)` |

- All listed paints have alpha 1. Shadow alpha is 0.25.
- For sub-8-bit color fidelity:
  - Gray/03 corresponds to `rgb(159.375 159.375 159.375)`.
  - Gray/05 corresponds approximately to `rgb(231.625007 231.625007 231.625007)`.
- Use the normalized source values when exact color matching is required; HEX values are the conventional rounded equivalents.

---

## 11. Forms, Actions, and States

### Defined Elements
| Element | Source representation | Behavior |
| :--- | :--- | :--- |
| Greeting | Text | None |
| Date | Text and decorative vectors | None |
| Notification | Icon component instance | None |
| Search | Visual component with text and icon | None |

> **Note:** The search text is not a native input. Mapping it to a functioning search input requires an additional behavior decision.

### Not Present or Not Defined
| Requirement | Status |
| :--- | :--- |
| External input label | Not present |
| Entered-value styling | Not defined |
| Helper or validation text | Not present |
| Primary/secondary/ghost button variants | Not present |
| Checkboxes | Not present |
| Links | Not present |
| Notification click action | Not defined |
| Search-submit action | Not defined |
| Hover | Not defined |
| Focus/focus-visible | Not defined |
| Active/pressed | Not defined |
| Disabled | Not defined |
| Error | Not defined |
| Loading | Not defined |

Do not attribute invented state colors, error borders, helper messages, or focus treatments to this component. Production keyboard-focus and interaction requirements must be specified separately.

---

## 12. Verification Checklist

- [ ] Root measures 1160px × 88px.
- [ ] Root background remains transparent.
- [ ] Greeting remains visible and reads "Hello Tanzir".
- [ ] Greeting/date group measures 282px × 28px at (24px, 30px).
- [ ] Greeting-to-date gap is 24px.
- [ ] Date text reads "May 19, 2023".
- [ ] Date icon-to-text gap is 4px.
- [ ] Utility group measures 416px × 48px at (712px, 20px).
- [ ] Notification-to-search gap is 40px.
- [ ] Search surface measures 352px × 48px.
- [ ] Search padding is 12px 24px 12px 32px.
- [ ] Search text has a fixed 102px width.
- [ ] Search icon remains 24px × 24px.
- [ ] Search text-to-icon gap is 170px.
- [ ] Search radius is 12px.
- [ ] Search shadow is 0px 26px 26px 0px rgba(0, 0, 0, 0.25).
- [ ] Only the root’s bottom divider is rendered.
- [ ] Hidden white icon backgrounds remain hidden.
- [ ] No unsupported responsive rules or component states are presented as source-defined requirements.