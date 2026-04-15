---
applyTo: "**"
---

# Commit Message Instructions

Use Conventional Commits format: `type(scope): short description`

**Types:** `feat` | `fix` | `refactor` | `test` | `chore` | `docs`

**Scope:** the FSD slice name or layer, e.g. `create-transaction`, `shared`, `entities/account`

**Examples:**

- `feat(create-transaction): add optimistic update on form submit`
- `fix(entities/account): correct balance calculation on delete`
- `test(filter-transactions): add MSW handlers for date range filter`
- `chore(shared): update cn utility to use tailwind-merge v3`

Keep the description under 72 characters, lowercase, no period at the end.
