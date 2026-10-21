# UI Technical Specification — Settings: Account and Security

## 1. Scope and Evidence

### Sources

| State                 | Source                                |
| :-------------------- | :------------------------------------ |
| Account tab selected  | Screenshot 2026-10-20 at 15.50.15.png |
| Security tab selected | Screenshot 2026-10-20 at 15.50.26.png |

### Included

- Main settings card.
- Account / Security tabs.
- Account form.
- Profile-picture upload box.
- Security form.
- Update Profile and Update Password buttons.

### Explicitly Excluded

- Sidebar.
- Header.
- Their content, styling, dimensions, and behavior.

### Critical Source Limitation

Both selected screens are flattened raster images. The settings card, tabs, fields, text, upload box, and buttons have no independent editable properties.

Consequently:

- Visible content and the two selected-tab states can be documented.
- Exact internal dimensions, spacing, typography, colors, borders, radii, and shadows are not independently defined.
- No input semantics, validation rules, or interaction metadata are available.
- Outer-frame properties do not establish the settings card’s properties.

This document uses:

- **Observed:** Readable or visibly distinguishable in the images.
- **Not defined:** Unavailable from the source.
- **Recommendation:** An implementation decision, not a Figma requirement.

No inferred numerical styling values are presented as confirmed requirements.

---

## 2. Main Card Architecture

### Observed Shared Structure

Both states show the same overall card arrangement:

```text
Settings card
├── Tab navigation
│   ├── Account
│   └── Security
└── Selected panel
    ├── Form content
    └── Primary update action
```

The Account panel additionally includes a profile-picture area to the right of the form.

### Card Properties

| Property                       | Specification                                                          |
| :----------------------------- | :--------------------------------------------------------------------- |
| Background                     | White-looking surface; exact HEX/RGBA not defined                      |
| Border                         | No clearly distinguishable perimeter border; exact styling not defined |
| Corner radius                  | Rounded; exact value not defined                                       |
| Shadow                         | Soft shadow visible below the card; exact parameters not defined       |
| Width/height                   | Not defined independently                                              |
| Padding: top/right/bottom/left | Not defined                                                            |
| Margins                        | Not defined                                                            |
| Fixed / Fill / Hug sizing      | Not defined                                                            |
| Minimum/maximum dimensions     | Not defined                                                            |
| Clipping behavior              | Not defined                                                            |
| Responsive behavior            | Not defined                                                            |

### Layout Relationships

| Region          | Observed arrangement                                | Exact unavailable properties                          |
| :-------------- | :-------------------------------------------------- | :---------------------------------------------------- |
| Tabs            | Horizontal row near the card’s upper-left           | Gap, padding, dimensions, alignment properties        |
| Account panel   | Form on the left; profile-picture area to the right | Column widths, column gap, Flexbox/Grid configuration |
| Account fields  | Four vertically stacked label/value groups          | Group heights, spacing, input dimensions              |
| Security fields | Four vertically stacked label/value groups          | Group heights, spacing, input dimensions              |
| Update action   | Below the fields, aligned with the form’s left edge | Top gap, margins, dimensions                          |

> **Note:** Do not infer CSS padding from the apparent text inset. An inset may belong to the field, a wrapper, or the text itself.

---

## 3. Tab Navigation

### Visible Text

- Account
- Security

### State Matrix

| State               | Account tab | Security tab |
| :------------------ | :---------- | :----------- |
| Account screenshot  | Active      | Inactive     |
| Security screenshot | Inactive    | Active       |

### Observed Visual Styling

- **Active State:** Teal-looking text. Thin teal-looking horizontal indicator below the tab (appears only beneath the selected tab).
- **Inactive State:** Muted gray-looking text. No active indicator underneath.

### Tab Properties

| Property               | Active                                 | Inactive                               |
| :--------------------- | :------------------------------------- | :------------------------------------- |
| Font family            | Not defined                            | Not defined                            |
| Font size              | Not defined                            | Not defined                            |
| Numeric font weight    | Not defined                            | Not defined                            |
| Line height            | Not defined                            | Not defined                            |
| Letter spacing         | Not defined                            | Not defined                            |
| Exact text color       | Not defined                            | Not defined                            |
| Tab dimensions/padding | Not defined                            | Not defined                            |
| Background             | No distinct filled tab surface visible | No distinct filled tab surface visible |
| Indicator thickness    | Not defined                            | Not applicable                         |
| Indicator width        | Not defined                            | Not applicable                         |
| Indicator offset/color | Not defined                            | Not applicable                         |

The images establish two visual selection states, but not the tab-switching mechanism, animation, keyboard behavior, or URL behavior.

_Recommendation:_ Implement semantic tabs with associated tab panels and keyboard support. This is an accessibility recommendation, not recovered interaction metadata.

---

## 4. Account Panel

### Field Inventory

| Order | Exact visible label | Observed content                                  |
| :---- | :------------------ | :------------------------------------------------ |
| 1     | Full name           | Tanzir Rahman                                     |
| 2     | Email               | tanzir.rahman@email.com                           |
| 3     | Username            | tanzir.rahman                                     |
| 4     | Phone Number        | +880, a vertical separator, then the local number |

The local phone number visually reads `51547 58868`. Confirm the digits and spacing against an authoritative text source before using it as production data. The vertical separator’s implementation is unknown: it may be decorative rather than part of the stored phone value.

### Observed Field Appearance

- Labels sit above their corresponding content.
- Labels appear darker than field content.
- Content appears inset to the right relative to labels.
- No clearly distinguishable rectangular input border is visible.
- No required-field marker, helper text, validation message, or error icon is visible.

### Field Properties

The following applies separately to all four fields:

| Requirement                                         | Source status   |
| :-------------------------------------------------- | :-------------- |
| Label typography/color                              | Not defined     |
| Value typography/color                              | Not defined     |
| Actual placeholder text                             | Not established |
| Whether displayed content is a value or placeholder | Not established |
| Input width/height                                  | Not defined     |
| Internal padding                                    | Not defined     |
| Background                                          | Not defined     |
| Border width/style/color                            | Not defined     |
| Border radius                                       | Not defined     |
| Label-to-input gap                                  | Not defined     |
| Inter-field gap                                     | Not defined     |
| Input type                                          | Not defined     |
| Editable/read-only status                           | Not defined     |
| Autocomplete behavior                               | Not defined     |
| Validation rules                                    | Not defined     |

> Do not infer read-only or disabled behavior from muted content color.

---

## 5. Profile-Picture Upload Area

### Visible Content

| Element                | Text                 |
| :--------------------- | :------------------- |
| Label above upload box | Your Profile Picture |
| Upload instruction     | Upload your photo    |

The upload instruction wraps onto two visible lines. Its underlying text does not necessarily contain a newline.

### Observed Structure

```text
Profile-picture area
├── Your Profile Picture
└── Upload box
    ├── Image/add icon
    └── Upload your photo
```

### Upload Box Styling

| Property         | Specification                                              |
| :--------------- | :--------------------------------------------------------- |
| Position         | Right of the Account form                                  |
| Border           | Dashed neutral-looking outline                             |
| Border width     | Not defined                                                |
| Border color     | Not defined                                                |
| Dash length/gap  | Not defined                                                |
| Dimensions       | Not defined                                                |
| Radius           | Slight rounding appears visible; exact value not defined   |
| Background       | Light/white-looking; exact value not defined               |
| Padding          | Not defined                                                |
| Icon placement   | Above the instruction, approximately centered horizontally |
| Icon-to-text gap | Not defined                                                |
| Text alignment   | Visually centered; underlying property not defined         |

### Icon

- Image/photo-style outline with an add mark.
- Muted gray-looking stroke.
- Exact dimensions, stroke width, color, and vector geometry are not available.

### Upload Behavior

_Not defined:_ Click-to-upload behavior, drag-and-drop support, accepted file types, file-size limit, crop/resize behavior, preview state, remove/replace action, progress/success/failure states. The dashed border alone does not establish drag-and-drop support.

---

## 6. Update Profile Button

**Exact text:** Update Profile

| Property                   | Specification                                             |
| :------------------------- | :-------------------------------------------------------- |
| Observed variant           | Primary-looking filled action                             |
| Placement                  | Below the Account fields, aligned to the form’s left edge |
| Dimensions                 | Not defined                                               |
| Padding                    | Not defined                                               |
| Background                 | Teal-looking; exact HEX/RGBA not defined                  |
| Border                     | No distinct border visible; exact properties not defined  |
| Radius                     | Slightly rounded; exact value not defined                 |
| Shadow                     | No distinct button shadow identifiable                    |
| Text                       | Light/white-looking                                       |
| Text alignment             | Visually centered                                         |
| Font family/size/weight    | Not defined                                               |
| Line height/letter spacing | Not defined                                               |
| Icon                       | None visible                                              |
| Submission behavior        | Not defined                                               |

No success message, pending state, or validation result is shown.

---

## 7. Security Panel

### Field Inventory

| Order | Exact visible label | Observed content                                           |
| :---- | :------------------ | :--------------------------------------------------------- |
| 1     | Old Password        | Repeated masking glyphs                                    |
| 2     | New Password        | Repeated masking glyphs                                    |
| 3     | Retype Password     | Repeated masking glyphs                                    |
| 4     | Phone Number        | Same visually displayed phone content as the Account panel |

Preserve the phone field in the Security panel. It is present in the source and must not be removed based on assumptions about a password form.

### Password Representation

- All three password fields display masking characters.
- The actual passwords are unavailable.
- Exact masking-character count and glyph identity are not reliably established.
- No show/hide-password icon is visible.
- No password-strength meter or requirements list is visible.

> Do not implement the displayed masking glyphs as literal input values.

### Security Field Properties

| Requirement                     | Source status            |
| :------------------------------ | :----------------------- |
| Label font/color                | Not defined              |
| Masked-value font/color         | Not defined              |
| Field dimensions                | Not defined              |
| Padding                         | Not defined              |
| Border/background/radius        | Not defined              |
| Vertical field gaps             | Not defined              |
| Placeholder text                | Not established          |
| Native password-input semantics | Not defined by the image |
| Autocomplete attributes         | Not defined              |
| Minimum/maximum length          | Not defined              |
| Password complexity rules       | Not defined              |
| Confirmation-matching behavior  | Not defined              |
| Phone-field purpose             | Not defined              |
| Error messages                  | Not represented          |

_Recommendation:_ Use password inputs for the password fields; determine their validation and autocomplete requirements separately.

---

## 8. Update Password Button

**Exact text:** Update Password

| Property            | Specification                                              |
| :------------------ | :--------------------------------------------------------- |
| Observed variant    | Primary-looking filled action                              |
| Placement           | Below the Security fields, aligned to the form’s left edge |
| Dimensions          | Not defined                                                |
| Padding             | Not defined                                                |
| Background          | Teal-looking; exact HEX/RGBA not defined                   |
| Border/radius       | Exact values not defined                                   |
| Shadow              | No distinct button shadow identifiable                     |
| Text color          | Light/white-looking; exact value not defined               |
| Text alignment      | Visually centered                                          |
| Typography          | Not defined                                                |
| Icon                | None visible                                               |
| Submission behavior | Not defined                                                |

The two update buttons look similar, but exact shared dimensions or token identity cannot be confirmed.

---

## 9. Complete Typography Inventory

| Role               | Visible content                                                                |
| :----------------- | :----------------------------------------------------------------------------- |
| Tabs               | Account, Security                                                              |
| Account labels     | Full name, Email, Username, Phone Number                                       |
| Account content    | Tanzir Rahman, tanzir.rahman@email.com, tanzir.rahman, displayed phone content |
| Upload label       | Your Profile Picture                                                           |
| Upload instruction | Upload your photo                                                              |
| Account action     | Update Profile                                                                 |
| Security labels    | Old Password, New Password, Retype Password, Phone Number                      |
| Security content   | Three masked displays and displayed phone content                              |
| Security action    | Update Password                                                                |

For every text role above, the following are **not defined**: font family, font size in pixels, numeric font weight, line height, letter spacing, exact HEX/RGBA color, text-box dimensions, actual text alignment property, text resizing mode, text transform and decoration properties.

---

## 10. Component State Specification

| Element         | Represented states                                                  | Unrepresented states                                    |
| :-------------- | :------------------------------------------------------------------ | :------------------------------------------------------ |
| Tabs            | Account active; Security active; corresponding inactive appearances | Hover, focus, pressed, disabled                         |
| Account fields  | Displayed content appearance                                        | Focus, hover, disabled, read-only, error                |
| Password fields | Masked appearance                                                   | Focus, hover, disabled, error, revealed password        |
| Phone fields    | Displayed content appearance                                        | Focus, disabled, error                                  |
| Upload box      | Empty upload-prompt appearance                                      | Hover, drag-over, uploading, preview, error             |
| Update buttons  | Default appearance                                                  | Hover, focus, active, disabled, loading, success, error |

### Explicitly Undefined Visual Changes

- Focus outline color, width, and offset.
- Focus border or shadow.
- Hover backgrounds and border colors.
- Pressed-state styling.
- Disabled opacity.
- Error border color.
- Error/helper text typography and spacing.
- Upload error styling.
- Button loading indicators.
- Success notifications.

No error message appears beneath any field. Do not invent a specific error color such as `#EF4444` and present it as a source requirement. Accessible focus and validation feedback remain production requirements to define separately.

---

## 11. Implementation Verification Contract

### Supported Requirements

1. Exclude the sidebar and header entirely.
2. Implement both tab-panel content sets.
3. Show only the active tab’s panel.
4. Move the active underline between Account and Security.
5. Preserve all field labels and their order.
6. Include the profile-picture upload area in Account only.
7. Preserve the Phone Number field in both panels.
8. Use "Update Profile" for Account.
9. Use "Update Password" for Security.
10. Do not treat masked password glyphs as actual data.
11. Do not infer disabled fields from muted styling.

### Outstanding Inputs for an Exact Production Rewrite

- Main-card dimensions, padding, radius, and shadow.
- Form widths, field heights, internal padding, and spacing.
- Typography and exact color tokens.
- Active-tab indicator dimensions and offsets.
- Upload-box dimensions and dashed-border parameters.
- Button dimensions and state styling.
- Authoritative field values and placeholder definitions.
- Validation, submission, and upload behavior.
- Responsive rules.
- Accessibility behavior and focus treatments.

These sources support a complete visible-content and state inventory, but not an exact internal styling contract. Unavailable values are intentionally left undefined rather than guessed.

---

## 12. Application Implementation Decisions

The following items describe the application implementation, not additional requirements recovered from the flattened reference screenshots:

- Account is selected by default. The tab component provides keyboard navigation and keeps the active indicator on the selected tab.
- The existing profile identity block displays the account email once. The editable account fields are Display name and Phone Number.
- Although the flattened reference image includes a Username row, the application uses `name` as the account's display identity; the duplicate Username field is intentionally omitted from application forms and persistence.
- Phone number is persisted on the Auth.js user record.
- Because migration 009 has already been applied, its name and contents remain unchanged; migration 010 removes the redundant username column and unique index.
- Phone Number is shown in both tabs and updates the same saved value.
- Password updates require the current password, a new password with the existing registration rules (at least eight characters, one uppercase letter, and one number), and a matching confirmation. Password hashes are verified and replaced server-side.
- The dashed profile-picture area is present but non-interactive until Cloudinary is integrated. It does not claim to upload or save a file.
- Field spacing, text styles, focus feedback, surfaces, and active-tab color use the application’s existing semantic design tokens for both light and dark themes.
- The existing Appearance switch, Danger Zone, and account-deletion confirmation remain in the Account panel.
