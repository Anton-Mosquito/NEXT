<!-- src/docs/performance-checklist.md -->
# Production Performance Checklist

## Redux/RTK Query
- [ ] createSelector для всіх derived state
- [ ] selectFromResult де потрібна часткова підписка
- [ ] React.memo для list items
- [ ] useCallback для handlers у memo компонентах
- [ ] injectEndpoints для code splitting
- [ ] Видалено зайвий loggerMiddleware у production

## Next.js
- [ ] Server Components для статичного контенту
- [ ] dynamic() для важких Client Components
- [ ] next/image для всіх зображень
- [ ] next/font для шрифтів
- [ ] Metadata для всіх сторінок (SEO)
- [ ] generateStaticParams для dynamic routes

## Bundle
- [ ] ANALYZE=true build — перевірено
- [ ] Немає великих залежностей у client bundle
- [ ] Named imports (не * from)
- [ ] Видалено dev-only code через NODE_ENV

## Testing
- [ ] Unit тести для всіх slices
- [ ] Unit тести для селекторів
- [ ] Integration тести для RTK Query
- [ ] Component тести для ключових форм
- [ ] npm test → 100% passing
- [ ] Coverage > 70%

## Hydration
- [ ] Немає "Hydration failed" warnings у console
- [ ] localStorage/sessionStorage тільки у useEffect
- [ ] Немає нових Date() без suppressHydrationWarning
- [ ] preloadedState передається у StoreProvider



### 🎯 Бонус челендж
```
□ Встанови why-did-you-render для dev mode:
  npm install -D @welldone-software/why-did-you-render
  Підключи у _app або layout і знайди зайві ре-рендери

□ Додай Lighthouse CI до GitHub Actions:
  // .github/workflows/lighthouse.yml
  Автоматична перевірка performance при кожному PR

□ Виміряй RTK Query cache hit rate:
  Підрахуй скільки разів queryFulfilled vs cacheHit
  через кастомний middleware
```

### 💡 Testing Golden Rules
```
1. Unit тести для reducer/selector:
   reducer(state, action) → чисті функції, легко тестувати
   
2. MSW handler override у тесті:
   server.use(http.get('/posts', () => HttpResponse.json([])))
   → Тестуємо edge cases без зміни основних handlers
   
3. waitFor для async UI:
   await waitFor(() => expect(screen.getByTestId('data')).toBeInTheDocument())
   
4. toBe для мемоізації:
   expect(result1).toBe(result2)  // ← той самий об'єкт у пам'яті
   
5. store.getState() після user actions:
   await user.click(button)
   expect(store.getState().counter.value).toBe(1)
   
6. renderWithProviders завжди:
   Ніколи не рендери Redux компоненти без Provider!
```

### 🗂️ Нові файли
```
src/
├── __mocks__/
│   ├── handlers/
│   │   ├── postHandlers.ts       ← MSW mock data
│   │   └── userHandlers.ts
│   └── server.ts                 ← MSW Node server
│
├── __tests__/utils/
│   └── renderWithProviders.tsx   ← Test utility
│
├── shared/lib/
│   └── performance.ts            ← Dev performance tools
│
├── entities/post/model/
│   ├── postSelectors.ts          ← Мемоізовані selectors
│   └── __tests__/
│       ├── currentPostSlice.test.ts
│       └── postSelectors.test.ts
│
├── features/
│   ├── like-post/model/__tests__/
│   │   └── likeSlice.test.ts
│   └── filter-posts/
│       ├── model/__tests__/filterSlice.test.ts
│       └── ui/__tests__/PostsFilter.test.tsx
│
├── app/performance/page.tsx      ← Performance dashboard
│
├── docs/
│   └── performance-checklist.md
│
├── jest.config.ts
└── jest.setup.ts