// src/__mocks__/handlers/postHandlers.ts
import { rest } from "msw";
import type { Post } from "@/entities/post";

// ✅ Фікстурні дані — використовуємо в тестах
export const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: "Test Post One",
    body: "This is the body of test post one with enough words",
  },
  {
    id: 2,
    userId: 1,
    title: "Test Post Two",
    body: "This is the body of test post two with enough words",
  },
  {
    id: 3,
    userId: 2,
    title: "Test Post Three",
    body: "This is the body of test post three with enough words",
  },
];

export const postHandlers = [
  // GET /posts
  rest.get("https://jsonplaceholder.typicode.com/posts", (req, res, ctx) => {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const limit = Number(url.searchParams.get("_limit")) || mockPosts.length;

    const posts = userId
      ? mockPosts.filter((p) => p.userId === Number(userId))
      : mockPosts;

    return res(ctx.json(posts.slice(0, limit)));
  }),

  // GET /posts/:id
  rest.get("https://jsonplaceholder.typicode.com/posts/:id", (req, res, ctx) => {
    const { id } = req.params;
    const post = mockPosts.find((p) => p.id === Number(id));

    if (!post) {
      return res(ctx.status(404));
    }

    return res(ctx.json(post));
  }),

  // POST /posts
  rest.post(
    "https://jsonplaceholder.typicode.com/posts",
    async (req, res, ctx) => {
      const body = (await req.json()) as Omit<Post, "id">;
      const newPost: Post = { ...body, id: 101 };
      return res(ctx.json(newPost), ctx.status(201));
    },
  ),

  // PATCH /posts/:id
  rest.patch(
    "https://jsonplaceholder.typicode.com/posts/:id",
    async (req, res, ctx) => {
      const { id } = req.params;
      const body = (await req.json()) as Partial<Post>;
      const post = mockPosts.find((p) => p.id === Number(id));

      if (!post) {
        return res(ctx.status(404));
      }

      return res(ctx.json({ ...post, ...body }));
    },
  ),

  // DELETE /posts/:id
  rest.delete(
    "https://jsonplaceholder.typicode.com/posts/:id",
    (req, res, ctx) => {
      return res(ctx.status(200));
    },
  ),
];
