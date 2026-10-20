---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"
---

# Test Generation Instructions

- Use the Vitest version in `package.json` (currently Vitest 5) with
  @testing-library/react and @testing-library/user-event. For version-sensitive
  APIs and configuration, follow the upstream `vitest` skill and installed
  Vitest 5 documentation.
- Mock HTTP requests with MSW handlers — never mock fetch or axios directly
- Test user behavior, not implementation details (no testing internal state or private methods)
- Co-locate test files next to the component: `ComponentName.test.tsx`
- Group related tests in `describe` blocks
- Prefer `userEvent` over `fireEvent` for all interactions
- Use `screen` queries in priority order: `getByRole` → `getByLabelText` → `getByText` → `getByTestId`
- Never use `getByTestId` unless no semantic query is possible
