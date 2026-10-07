# COMPONENT SET — СПЕЦИФІКАЦІЯ ДЛЯ АУДИТУ

Цей документ містить точні значення кольорів, шрифтів, розмірів, відступів та інших властивостей компонентів. 
Використовується AI-агентом для автоматичної звірки реалізації з еталонним описом.

---

## 1. ПАЛІТРА КОЛЬОРІВ

### PRIMARY (Акцентний колір)
* **`#299D91`** — основний teal/бірюзовий, фон активного пункту меню

### BACKGROUNDS (Фони)
* **`#FFFFFF` opacity 8%** — фон hover-стану меню
* **`#FFFFFF` opacity 5%** — фон компонента Logout (menu item)
* **Без фону (transparent)** — inactive стан меню

### TEXT COLORS (Кольори тексту)
* **`#FFFFFF` opacity 100%** — текст активного стану + заголовок профілю
* **`#FFFFFF` opacity 70%** — текст inactive та hover станів
* **`#FFFFFF` opacity 50%** — підзаголовок "View profile"

### ICON COLORS — Sidebar Menu Icons (stroke-based)
* **`#FFFFFF` opacity 100%** — іконки в Active стані
* **`#FFFFFF` opacity 70%** — іконки в Inactive стані

### ICON COLORS — Standalone (utility icons)
* **`#656575`** — Clock, Search, Down arrow, Notification icon
* **`#999DA3`** — Icon/eye, Icon/eyeoff
* **`#525256`** — Award, x (close)
* **`#191919`** — Movie, Others, Food, Transport, Shopping, Back arrow
* **`#696969`** — chevron-right
* **`#9F9F9F`** — arrow-right (24px)
* **`#666666`** — octicon:goal-16, mdi:achievement-award
* **`#4B5768`** — Icon/separator

### ICON COLORS — Semantic / Status
* **`#71EF9C`** — Down arrow (16px) — позитивна зміна (зелений)
* **`#FA0F00`** — Up arrow (16px) — негативна зміна (червоний)
* **`#000000`** — arrow-up-right (16px)
* **`#FFFFFF`** — arrow-right (16px), Logout icon

### CATEGORY ICONS (fill-based, specific colors)
* **`#299D91`** — Housing
* **`#191919`** — Movie, Others, Food, Transport, Shopping
* **`#525256`** — Award
* **`#FFFFFF`** — Menu/Car, Menu/Payment, Menu/Transaction, Target, Bill

---

## 2. ТИПОГРАФІКА

**Шрифтова родина:** Inter (єдина для всього набору)

### MENU ITEM — Active стан:
* **Font:** Inter Semi Bold
* **Size:** 16px
* **Line Height:** 24px (1.5×)
* **Letter Spacing:** 0%
* **Text Align:** LEFT / TOP
* **Text Auto Resize:** NONE (фіксована ширина)

### MENU ITEM — Inactive / Hover стан:
* **Font:** Inter Regular
* **Size:** 16px
* **Line Height:** 24px
* Решта параметрів ідентичні Active

### PROFILE — Ім'я користувача:
* **Font:** Inter Semi Bold
* **Size:** 16px
* **Line Height:** 24px
* **Text Auto Resize:** HEIGHT

### PROFILE — "View profile":
* **Font:** Inter Regular
* **Size:** 12px
* **Line Height:** 16px
* **Text Auto Resize:** WIDTH_AND_HEIGHT

### LOGOUT MENU (sidebar):
* **Font:** Inter Semi Bold
* **Size:** 16px
* **Line Height:** 24px

### LOGOUT BUTTON (standalone):
* **Font:** Inter Medium
* **Size:** 18px
* **Line Height:** 24px

---

## 3. РОЗМІРИ КОМПОНЕНТІВ

### MENU ITEM (Component Set "Menu"):
* **Розмір:** 224 × 48 px
* **Corner Radius:** 4px
* **Варіанти:** 7 типів × 3 стани = 21 варіант
* **Типи:** Overview, Balances, Transactions, Bills, Expenses, Goals, Settings
* **Стани:** Active, Inactive, Hover

### PROFILE COMPONENT:
* **Розмір:** 224 × 104 px (HUG content)
* **Corner Radius:** 0 (без заокруглення)

### LOGOUT MENU ITEM:
* **Розмір:** 224 × 48 px
* **Corner Radius:** 4px

### LOGOUT BUTTON:
* **Розмір:** 192 × 48 px
* **Corner Radius:** 8px

### ICON SIZES:
* **24 × 24 px** — основний розмір (більшість іконок)
* **16 × 16 px** — малі іконки (chevron-right, arrows, edit)
* **32 × 32 px** — x (close icon)
* **12 × 24 px** — Icon/separator (вертикальна лінія)
* **20 × 20 px** — Logout icon (всередині frame wrapper)

### LOGO SIZES:
* **Figma:** 120 × 40 px
* **Adobe:** 120 × 31 px
* **Mastercard:** 48 × 32 px
* **Visa:** 48 × 32 px

### AVATAR:
* **32 × 32 px** — круглий (Ellipse)
* **Заповнення:** Image fill
* **Обводка:** без обводки

### DOTS MENU (вертикальний):
* **Frame:** 4 × 20 px
* **Кожна крапка:** 4 × 4 px (Ellipse)
* **Колір крапок:** `#FFFFFF`
* **Відстань між крапками:** 4px

---

## 4. ВІДСТУПИ ТА КОМПОНОВКА (AUTO LAYOUT)

### MENU ITEM (всі варіанти однакові):
* **Layout:** HORIZONTAL
* **Padding:** 12px top, 16px right, 12px bottom, 16px left
* **Item Spacing:** 12px (відстань між іконкою та текстом)
* **Primary Axis Align:** MIN (left)
* **Counter Axis Align:** CENTER (вертикально по центру)
* **Sizing:** HUG × HUG

### PROFILE COMPONENT:
* **Layout:** HORIZONTAL
* **Padding:** 32px top, 0 right, 32px bottom, 0 left
* **Item Spacing:** 32px (між контентом та dots menu)
* **Primary Axis Align:** MIN
* **Counter Axis Align:** CENTER

#### Inner Frame (avatar + text):
* **Layout:** HORIZONTAL
* **Padding:** 0 all sides
* **Item Spacing:** 16px (між аватаром та текстовим блоком)

#### Text Frame (ім'я + "View profile"):
* **Layout:** VERTICAL
* **Item Spacing:** 0 (тексти стикаються)

### LOGOUT MENU ITEM:
* **Layout:** HORIZONTAL
* **Padding:** 12px top, 16px right, 12px bottom, 16px left
* **Item Spacing:** 12px
* **Primary Axis Align:** MIN
* **Counter Axis Align:** CENTER

### LOGOUT BUTTON:
* **Layout:** HORIZONTAL
* **Padding:** 12px top, 46px right, 12px bottom, 46px left
* **Item Spacing:** 12px
* **Primary Axis Align:** MIN
* **Counter Axis Align:** CENTER
* **Corner Radius:** 8px

---

## 5. СТИЛЬ ІКОНОК (STROKE / FILL)

### SIDEBAR MENU ICONS (stroke-based, outline style):
* **Stroke Weight:** 2px
* **Stroke Cap:** ROUND
* **Stroke Join:** ROUND
* **Stroke Align:** CENTER
* **Fills:** порожні (transparent) — лише обведення

**Іконки, що використовують STROKE стиль:**
Menu/Overview, Menu/Settings, Menu/Bell, Menu/Report, wallet, Expencces, Transaction, Goal, Clock, Search, Down arrow (24px), Back arrow, Logout icon

### UTILITY ICONS (stroke-based, різна товщина):
* **Search (обидві версії):** Stroke Weight ≈ 1.8px, Cap: ROUND, Join: MITER
* **chevron-right:** Stroke Weight: 1px
* **Down arrow / Up arrow (16px):** Stroke Weight: 1.5px
* **arrow-up-right:** Stroke Weight: 1.5px
* **arrow-right (24px):** Stroke Weight: 2px
* **arrow-right (16px):** Stroke Weight: 1.5px
* **x (close):** Stroke Weight: 3px
* **Icon/separator:** Stroke Weight: 2px

### FILL-BASED ICONS (solid fill, no stroke):
Menu/Car, Menu/Payment, Menu/Transaction, Target, Bill, Housing, Movie, Others, Food, Transport, Shopping, Award, Notification icon, octicon:goal-16, mdi:achievement-award

---

## 6. VARIANT PROPERTIES (COMPONENT SET "MENU")

* **Property 1: "Type" (enum)**  
  *Значення:* Overview, Balances, Transactions, Bills, Expenses, Goals, Settings

* **Property 2: "Status" (enum)**  
  *Значення:* Active, Inactive, Hover

### ПРАВИЛА ЗА СТАНОМ:

| Властивість | Active | Inactive | Hover |
| :--- | :--- | :--- | :--- |
| **Фон** | `#299D91` 100% | transparent | `#FFFFFF` 8% |
| **Текст колір** | `#FFFFFF` 100% | `#FFFFFF` 70% | `#FFFFFF` 70% |
| **Текст вага** | Inter Semi Bold | Inter Regular | Inter Regular |
| **Іконка** | `#FFFFFF` 100% | `#FFFFFF` 70% | `#FFFFFF` 70% |
| **Radius** | 4px | 4px | 4px |

### Іконка кожного Type:
* **Overview** → Menu/Overview (4 квадрати, grid pattern)
* **Balances** → wallet
* **Transactions** → Transaction (стрілки вгору/вниз)
* **Bills** → Bill (документ)
* **Expenses** → Expencces (графік)
* **Goals** → Goal (crosshair/target)
* **Settings** → Menu/Settings (gear/шестерня)

---

## 7. ПОВНИЙ ПЕРЕЛІК КОМПОНЕНТІВ

### COMPONENT SETS (з варіантами):
1. **Menu** — 21 варіант (7 types × 3 statuses)

### STANDALONE COMPONENTS — Navigation / UI:
2. **Profile** — блок профілю з аватаром, ім'ям, dots-menu
3. **Menu (Logout menu item)** — пункт меню logout у сайдбарі
4. **Logout** — кнопка logout (standalone)

### STANDALONE COMPONENTS — Icons 24×24:
5. Menu/Overview
6. Menu/Car
7. Icon/eye
8. Menu/Settings
9. Icon/eyeoff
10. Menu/Bell
11. Menu/Payment
12. Menu/Transaction
13. Menu/Report
14. wallet
15. Expencces
16. Transaction
17. Target
18. Goal
19. Bill
20. arrow-right [42:642]
21. Search [2:110]
22. Down arrow [2:44]
23. Notification icon
24. Search [43:614]
25. octicon:goal-16
26. mdi:achievement-award
27. Housing
28. Movie
29. Others
30. Food
31. Transport (Trasnport)
32. Shopping
33. Back arrow
34. Award
35. Clock

### STANDALONE COMPONENTS — Icons 16×16:
36. chevron-right
37. Down arrow [28:470]
38. Up arrow [28:469]
39. arrow-up-right
40. arrow-right [18:454]
41. edit

### STANDALONE COMPONENTS — Special sizes:
42. **x (close)** — 32×32
43. **Icon/separator** — 12×24
44. **Frame 39997** (Logout icon wrapper) — 20×20

### STANDALONE COMPONENTS — Logos:
45. **Figma** — 120×40
46. **Adobe** — 120×31
47. **Mastercard** — 48×32
48. **Visacard** — 48×32

---

## 8. ВІДОМІ РОЗБІЖНОСТІ / ПРИМІТКИ ДЛЯ АУДИТУ

### ⚠️ TYPOS / NAMING:
* Компонент `"Expencces"` — ймовірно має бути `"Expenses"`
* Компонент `"Trasnport"` — ймовірно має бути `"Transport"`

### ⚠️ TEXT CONTENT:
* Текст `"Expenses
"` в Active/Inactive/Hover містить зайвий символ нового рядка (`
`)

### ⚠️ LOGOUT BUTTON:
* Logout button `[13:612]` не має ні fills, ні strokes — візуально може бути невидимим без контексту (залежить від фону батьківського елемента)
* Горизонтальний padding: `46px` — значно більший ніж у menu items (`16px`)

### ⚠️ INCONSISTENCIES IN ICON STYLE:
* Більшість sidebar icons використовують stroke style (outline)
* Деякі icons використовують fill style (solid) — `Menu/Car`, `Menu/Payment`, `Menu/Transaction`
* Search icon має нестандартний `strokeWeight ≈ 1.8px` (замість рівних `2px`)
* Clock icon має `strokeCap: NONE` замість `ROUND` (на одному з векторів)

### ⚠️ DUPLICATE NAMES:
* Два компоненти `"Search"` (IDs: `2:110` та `43:614`) — різні ID, однакова назва
* Два компоненти `"arrow-right"` (IDs: `18:454` [16px] та `42:642` [24px])
* Два компоненти `"Down arrow"` (IDs: `2:44` [24px] та `28:470` [16px])

### ⚠️ AVATAR:
* Avatar (Ellipse) не має `cornerRadius` — відображається як коло завдяки типу Ellipse, а не `cornerRadius`

### ⚠️ COMPONENT STRUCTURE:
* `"Frame 39997"` `[13:630]` — нейтральна назва, не описує призначення (це wrapper для Logout icon)
* Logout icon instances (`13:626`, `13:607`) — різні обгортки для однієї іконки

---

*Документ згенеровано автоматично на основі аналізу фрейму "Components" [66:1754].*  
**Дата:** 15.08.2026  
**Версія:** 1.0
