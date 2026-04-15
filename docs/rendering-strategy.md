<!-- src/docs/rendering-strategy.md -->

# Стратегія рендерингу

## Server Components (без 'use client')

- app/layout.tsx → Layout (PostProvider обгортає)
- app/page.tsx → Головна сторінка
- app/posts/page.tsx → Сторінка постів (async fetch)
- app/posts/[id]/page.tsx → Сторінка поста (async fetch by id)
- app/profile/page.tsx → Профіль (частково серверний)
- entities/post/ui/PostCard.tsx → Відображення поста (НЕ потребує стану)

## Client Components ('use client')

- app/providers/StoreProvider.tsx → Redux Provider
- widgets/header/ui/Header.tsx → Auth стан, навігація
- widgets/post-feed/ui/PostFeed.tsx → Фільтри, пагінація
- features/like-post/ui/LikeButton.tsx → dispatch
- features/create-post/ui/CreatePostForm.tsx → форма
- features/filter-posts/ui/PostsFilter.tsx → dispatch

## Hybrid (Server shell + Client interactive parts)

- posts/[id]/page.tsx:
  Server → fetch post data
  Client → LikeButton, CommentForm, ShareButton

## Правила проекту

1. Компоненти що тільки відображають дані → Server
2. Компоненти з onClick/onChange → Client
3. Компоненти що читають Redux → Client
4. Компоненти що пишуть у Redux → Client
5. Async data fetching → Server (якщо не потрібен re-fetch)
