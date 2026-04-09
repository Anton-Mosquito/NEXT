export const ROUTES = {
  HOME: "/",
  POSTS: "/posts",
  POST: (id: number) => `/posts/${id}`,
  PROFILE: "/profile",
  LOGIN: "/login",
  PREFETCHED_POSTS: "/posts/prefetched",
  STREAMING_POSTS: "/posts/streaming",
  HYBRID: "/hybrid",
  USERS: "/users",

} as const;

export const NAV_LINKS = [
  { href: ROUTES.HOME, label: "🏠" },
  { href: ROUTES.POSTS, label: "📝 Пости" },
  { href: ROUTES.PREFETCHED_POSTS, label: "⚡ Prefetch" },
  { href: ROUTES.STREAMING_POSTS, label: "🌊 Streaming" },
  { href: ROUTES.HYBRID, label: "🏛️ Hybrid" },
  { href: ROUTES.PROFILE, label: "👤 Профіль" },
  { href: ROUTES.USERS, label: "🗄️ Users DB" },
] as const;