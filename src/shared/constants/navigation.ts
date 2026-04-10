export const ROUTES = {
  HOME: "/",
  POSTS: "/posts",
  POST: (id: number) => `/posts/${id}`,
  PROFILE: "/profile",
  LOGIN: "/login",
} as const;
