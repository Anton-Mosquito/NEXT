---
applyTo: "**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx"
---

# Test Generation Instructions

- Use Vitest + @testing-library/react + @testing-library/user-event
- Mock HTTP requests with MSW handlers — never mock fetch or axios directly
- Test user behavior, not implementation details (no testing internal state or private methods)
- Co-locate test files next to the component: `ComponentName.test.tsx`
- Group related tests in `describe` blocks
- Prefer `userEvent` over `fireEvent` for all interactions
- Use `screen` queries in priority order: `getByRole` → `getByLabelText` → `getByText` → `getByTestId`
- Never use `getByTestId` unless no semantic query is possible
