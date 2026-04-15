---
applyTo: "**"
---

# Code Review Instructions

When reviewing code check for these issues in order:

1. **FSD import violations** — `shared` must not import from upper layers; `entities` only from `shared`; etc.
2. **Client Components fetching data** — data fetching belongs in Server Components or React Query hooks, not in `"use client"` files
3. **Redux used for server state** — Redux Toolkit is for UI state only; async/server data must use React Query
4. **Missing Zod validation** — all external data (forms, API responses, URL params) must be validated with Zod
5. **SQL string interpolation** — all queries must use parameterized statements via `pg`; never template literals in SQL
6. **Missing `server-only`** — files with DB queries or secrets must have `import 'server-only'` at the top
7. **Legacy code modified** — flag any changes to legacy code that were not explicitly requested
