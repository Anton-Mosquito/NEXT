---
applyTo: "**"
---

# Copilot Instructions — Expense Tracker

## 🗂 Project Overview

This is a **fullstack Next.js 16 Expense Tracker** application. Users can manage multiple accounts (cash, cards, crypto wallets), log income/expenses with categories, track budgets, and view analytics dashboards with charts.

The app is built with **Feature-Sliced Design (FSD)** architecture and a **dual state management** strategy. There is legacy code in the project — **never delete or refactor legacy code unless explicitly asked**. Legacy code will be migrated gradually.

---

## ⚙️ Tech Stack (do not suggest alternatives)

### Runtime & Framework

- **Next.js 16.1.6** — App Router, React Server Components (RSC), Server Actions, Streaming, PPR, Turbopack
- **React 19.2.3** — Server Components, Client Components, hooks
- **TypeScript ^5** — strict mode enabled (`"strict": true`)

### State Management

- **Redux Toolkit ^2.11.2** — global **client-side** state only (UI state, auth, modals)
- **React Redux ^9.2.0** — `useSelector` / `useDispatch` hooks
- **TanStack React Query ^5.90.21** — all **server state**: fetching, caching, prefetching, optimistic updates, background refetch

> Rule: Never use Redux for server data. Never use React Query for pure UI state.

### Forms & Validation

- **React Hook Form ^7.71.2** — all form management (minimal re-renders)
- **@hookform/resolvers ^5.2.2** — Zod integration
- **Zod ^4.3.6** — all runtime validation schemas (forms, API responses, env vars)

### UI & Styling

- **Tailwind CSS ^4.2.1** — utility-first CSS
- **shadcn/ui ^4.1.1** — component library (Radix UI + Tailwind)
- **Radix UI ^1.4.3** — headless primitives
- **Lucide React ^0.577.0** — icons
- **CVA ^0.7.1** — component variants
- **clsx ^2.1.1 + tailwind-merge ^3.5.0** — conditional class merging via `cn()` utility

### Database

- **PostgreSQL 16** via Prisma Postgres (cloud) or any PostgreSQL instance
- **pg (node-postgres) ^8.20.0** — direct SQL queries

### Testing

- **Vitest ^4.1.2** — unit and integration tests
- **@testing-library/react ^16.3.2** — component tests (test behavior, not implementation)
- **MSW ^1.3.3** — HTTP mocking at network level
- **jsdom ^29.0.1** — browser-like environment

### Code Quality

- **ESLint ^9** with `eslint-config-next` and `eslint-plugin-boundaries`

---

## 🏗 Architecture: Feature-Sliced Design (FSD)

The project strictly follows FSD. Always place new code in the correct layer.

```
src/
├── shared/      # Reusable utils, API clients, Zod schemas, constants, UI kit
├── entities/    # Business entities: user, account, category, transaction, budget
├── features/    # Business logic features: create-transaction, delete-account, filter-transactions, etc.
├── widgets/     # Composite UI blocks: transaction-table, dashboard-summary, account-list
└── app/         # Next.js pages, layouts, providers, global config
```

### Import Rules (enforced by eslint-plugin-boundaries)

| Layer         | Can import from                  |
| ------------- | -------------------------------- |
| `shared`      | nothing (no upper layers)        |
| `entities`    | `shared` only                    |
| `features`    | `entities`, `shared`             |
| `widgets`     | `features`, `entities`, `shared` |
| `app` (pages) | everything                       |

**Never violate these import rules.** If you need cross-entity communication, use `features`.

### Slice Structure

Each slice (e.g., `features/create-transaction`) should follow:

```
features/create-transaction/
├── ui/               # React components
├── model/            # store slices, hooks, business logic
├── api/              # API calls, React Query hooks
├── lib/              # helpers, utils specific to this slice
└── index.ts          # public API — only export what other layers need
```

**Always export through `index.ts`**. Never import from internal paths of another slice.

---

## 📐 Coding Conventions

### TypeScript

- Strict mode is on — no `any`, no type assertions without justification
- Prefer `type` over `interface` for data shapes; use `interface` for extensible contracts
- All Zod schemas live in `shared/schemas/` or co-located in the slice's `lib/`
- Infer types from Zod: `type Transaction = z.infer<typeof transactionSchema>`

### React Components

- **Server Components by default** — add `"use client"` only when needed (hooks, events, browser APIs)
- **Never put data fetching inside Client Components** — use Server Components or React Query
- Component files: `PascalCase.tsx`; utility files: `camelCase.ts`
- Extract complex logic into custom hooks (`use` prefix)

### Forms

Always use this pattern — never build forms without React Hook Form + Zod:

```tsx
const schema = z.object({ amount: z.number().positive(), ... });
type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({ resolver: zodResolver(schema) });
```

### State

```tsx
// ✅ Server state — React Query
const { data: transactions } = useQuery({ queryKey: ['transactions', filters], queryFn: ... });

// ✅ Optimistic update pattern for deletes/updates
useMutation({ onMutate: async () => { /* cancel queries, snapshot, update cache */ }, onError: () => { /* rollback */ } });

// ✅ Client UI state — Redux slice
dispatch(openModal('createTransaction'));
```

### Styling

Always use the `cn()` utility from `shared/lib/utils`:

```tsx
import { cn } from '@/shared/lib/utils';
className={cn('base-class', condition && 'conditional-class', className)}
```

Use CVA for components with multiple visual variants.

### Database

- All DB queries go in `shared/api/db/` or in the slice's `api/` (server-only files)
- Mark server-only files with `import 'server-only'` at the top
- Use parameterized queries — never string interpolation in SQL
- Transactions for multi-step writes

---

## 🚫 Critical Rules

1. **Do not delete or rewrite legacy code.** Only touch what is explicitly in scope.
2. **Do not suggest library changes.** Use only what is in the tech stack above.
3. **Do not use `fetch` directly in components.** Use Server Actions or React Query.
4. **Do not mix server and client concerns.** RSC for data fetching, Client Components for interactivity.
5. **Always validate with Zod** — all external data (forms, API responses, URL params).
6. **Respect FSD import rules** — if unsure which layer something belongs to, ask first.
7. **No `eslint-disable` comments** without explaining why in a comment above it.

---

## 📁 Key Domain Models

```ts
// Account — cash, card, crypto wallet
type Account = {
  id: string;
  name: string;
  type: "cash" | "card" | "crypto";
  balance: number;
  currency: string;
};

// Category — income or expense with optional icon/color
type Category = {
  id: string;
  name: string;
  type: "income" | "expense";
  color?: string;
  icon?: string;
};

// Transaction — core entity
type Transaction = {
  id: string;
  amount: number;
  date: Date;
  description?: string;
  accountId: string;
  categoryId: string;
  type: "income" | "expense";
};

// Budget — monthly limit per category
type Budget = {
  id: string;
  categoryId: string;
  limitAmount: number;
  month: string;
}; // month: 'YYYY-MM'
```

---

## 💡 When Generating Code

- Always specify the **file path** as a comment at the top of the code block
- For new features, scaffold all FSD layers (ui, model, api, index.ts)
- For Server Actions, use `'use server'` directive and validate inputs with Zod before any DB call
- Prefer `const` arrow functions for components exported from `index.ts`; use `export default function` for Next.js page/layout files
- Date formatting: use `Intl.DateTimeFormat` — no external date libraries unless already in the stack
