# UI Technical Specification

## 1. Source Metadata

| Property                     | Value                                      |
| :--------------------------- | :----------------------------------------- |
| **Node type**                | Component instance                         |
| **Main component**           | Header                                     |
| **Component key**            | `2bbebeb647b5c3bcdfa367744173141bc841c15e` |
| **Dimensions**               | 1160px × 88px                              |
| **Position in screen frame** | x: 280px; y: 0px                           |
| **Parent screen dimensions** | 1440px × 1024px                            |
| **Component properties**     | None                                       |
| **Prototype interactions**   | None                                       |
| **Design variables**         | None                                       |

---

## 2. Header Container

```css
.header {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;

  width: 1160px;
  height: 88px;
}
```

### Sizing and Placement
* **Fixed width:** 1160px.
* **Content-hugging height:** Resolves to 88px.
* **Width constraints:** No minimum or maximum width.
* **Height constraints:** No minimum or maximum height.
* **Position:** Positioned after a 280px-wide left-side region.
* **Top offset:** 0px.
* **Right edge alignment:** Aligns with the 1440px parent edge.
* **Vertical alignment:** Children are vertically centered.
* **Separation:** The measured space between the two direct child groups is 570px.
* **Auto-layout note:** The source auto-layout records an item-spacing value of 406px, but `space-between` determines the rendered separation.

---

## 3. Child Architecture

```text
Header
├── Date Region
│   ├── Double-chevron Icon
│   └── Date Text
└── Utility Region
    ├── Notification Icon
    └── Search Field
        ├── Placeholder Text
        └── Search Icon
```

---

## 4. Date Region

### Region Layout

```css
.header-date {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;

  width: 118px;
  height: 24px;
  gap: 4px;
}
```

* **Position relative to header:** x: 24px; y: 32px.
* **Sizing:** Hug content horizontally and vertically.
* **Constraints:** No minimum or maximum sizing constraints.

### Double-chevron Icon

```css
.header-date__chevrons {
  position: relative;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
```

| Vector            | Position in icon | Dimensions | Styling                                 |
| :---------------- | :--------------- | :--------- | :-------------------------------------- |
| **Left chevron**  | x: 6px; y: 7px   | 5px × 10px | 2px centered stroke, `#9F9F9F`, no fill |
| **Right chevron** | x: 13px; y: 7px  | 5px × 10px | 2px centered stroke, `#9F9F9F`, no fill |

* **Distance between vector bounds:** 2px.
* **Background:** Transparent.
* **Note:** Decorative 24px × 24px white fill exists in the source but is hidden.

### Date Text

* **Exact content:** `May 19, 2023`

```css
.header-date__text {
  width: max-content;
  height: 20px;
  margin: 0;

  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}
```

| Token          | Source style  |
| :------------- | :------------ |
| **Typography** | Regular 14-20 |
| **Color**      | Gray/03       |

---

## 5. Utility Region

```css
.header-utilities {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;

  width: 416px;
  height: 48px;
  gap: 40px;
}
```

* **Position relative to header:** x: 712px; y: 20px.
* **Right offset from header:** 32px.
* **Sizing:** Hug content horizontally and vertically.

---

## 6. Notification Icon

```css
.notification-icon {
  position: relative;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;

  background: transparent;
  border: 0;
}
```

* **Position within utility region:** x: 0px; y: 12px.
* **Main notification artwork:**
  * **Position:** x: 2.0329px; y: 1.1834px.
  * **Dimensions:** 19.8667px × 19.45px.
  * **Fill:** `#666666`.
* **Lower bell detail:**
  * **Position:** x: 10.213px; y: 21.3333px.
  * **Dimensions:** 3.5067px × 1.5202px.
  * **Fill:** `#666666`.
* **Notification badge:**
  * **Position:** x: 16.6663px; y: 0.6667px.
  * **Dimensions:** 6.6667px × 6.6667px.
  * **Fill:** `#299D91`.
* **Stroke/Shadow:** No visible stroke or shadow.

| Token           | Source style  |
| :-------------- | :------------ |
| **Bell color**  | Gray/01       |
| **Badge color** | Primary color |

---

## 7. Search Field

> **Important Semantic Note:**
> The source represents this element as a component instance containing text and an icon. It does not contain a native input node, label, helper text, validation message, or interaction definition.

### Field Container

```css
.search-field {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;

  width: 352px;
  height: 48px;
}
```

* **Position within utility region:** x: 64px; y: 0px.
* **Border:** The source records an internal stroke weight of 0.901px, but the stroke paint list is empty; therefore no border is rendered.
* **Fill style token:** White.

### Placeholder Text

* **Exact content:** `Search here`

```css
.search-field__input {
  box-sizing: border-box;
  width: 102px;
  height: 24px;
  padding: 0;
  margin: 0;

  font-family: "Inter", sans-serif;
  font-size: 16px;
  font-style: normal;
}
```

| Token          | Source style  |
| :------------- | :------------ |
| **Typography** | Regular 16-24 |
| **Color**      | Gray/03       |

### Search Icon

```css
.search-field__icon {
  position: relative;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  overflow: hidden;
}
```

| Vector            | Position in icon       | Dimensions      | Styling                                 |
| :---------------- | :--------------------- | :-------------- | :-------------------------------------- |
| **Search lens**   | x: 3px; y: 3px         | 16px × 16px     | 2px centered stroke, `#525256`, no fill |
| **Search handle** | x: 16.65px; y: 16.65px | 4.35px × 4.35px | 2px centered stroke, `#525256`, no fill |

* **Icon position within field:** x: 304px; y: 12px.
* **Color token:** Secondary.

---

## 8. Interactive Elements

| Element               | Source representation | Dimensions   | Defined interaction |
| :-------------------- | :-------------------- | :----------- | :------------------ |
| **Notification icon** | Component instance    | 24px × 24px  | None                |
| **Search field**      | Component instance    | 352px × 48px | None                |
| **Search icon**       | Component instance    | 24px × 24px  | None                |
| **Date chevrons**     | Static frame/vectors  | 24px × 24px  | None                |

*No buttons, checkboxes, links, labels, helper text, or validation messages are present.*

---

## 9. Component States

The selected component and its nested components do not define variants, component properties, prototype reactions, or alternate visual states.

| State              | Source-defined visual change |
| :----------------- | :--------------------------- |
| **Default**        | Values specified above       |
| **Hover**          | Not defined                  |
| **Focus**          | Not defined                  |
| **Active/Pressed** | Not defined                  |
| **Disabled**       | Not defined                  |
| **Error**          | Not defined                  |
| **Loading**        | Not defined                  |

*Implementation must not infer unsupported colors, borders, shadows, helper text, or validation styling from this frame.*

---

## 10. Design Tokens

| Semantic use          | Exact value           | Source style  |
| :-------------------- | :-------------------- | :------------ |
| **Header background** | `#FFFFFF`             | —             |
| **Header divider**    | `#E8E8E8`             | Gray/05       |
| **Muted text/icon**   | `#9F9F9F`             | Gray/03       |
| **Notification icon** | `#666666`             | Gray/01       |
| **Primary accent**    | `#299D91`             | Primary color |
| **Search icon**       | `#525256`             | Secondary     |
| **Search background** | `#FFFFFF`             | White         |
| **Search shadow**     | `rgba(0, 0, 0, 0.25)` | —             |

---

## 11. Verification Checklist

- [ ] Header renders at exactly 1160px × 88px.
- [ ] Header begins 280px from the left edge of the 1440px screen.
- [ ] Header padding is 20px 32px 20px 24px.
- [ ] Only the bottom border is visible.
- [ ] Date region is 118px × 24px.
- [ ] Utility region is 416px × 48px.
- [ ] Notification-to-search gap is exactly 40px.
- [ ] Search field is 352px × 48px.
- [ ] Search field radius is exactly 12px.
- [ ] Search field internal padding is 12px 24px 12px 32px.
- [ ] Date text is exactly `May 19, 2023`.
- [ ] Placeholder text is exactly `Search here`.
- [ ] No unrepresented hover, focus, disabled, or error styling is introduced.