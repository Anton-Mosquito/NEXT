// src/__mocks__/handlers/postHandlers.ts
import { http, HttpResponse } from "msw";
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
  http.get("https://jsonplaceholder.typicode.com/posts", ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const limit = Number(url.searchParams.get("_limit")) || mockPosts.length;

    const posts = userId
      ? mockPosts.filter((p) => p.userId === Number(userId))
      : mockPosts;

    return HttpResponse.json(posts.slice(0, limit));
  }),

  // GET /posts/:id
  http.get("https://jsonplaceholder.typicode.com/posts/:id", ({ params }) => {
    const { id } = params;
    const post = mockPosts.find((p) => p.id === Number(id));

    if (!post) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  // POST /posts
  http.post(
    "https://jsonplaceholder.typicode.com/posts",
    async ({ request }) => {
      const body = (await request.json()) as Omit<Post, "id">;
      const newPost: Post = { ...body, id: 101 };
      return HttpResponse.json(newPost, { status: 201 });
    },
  ),

  // PATCH /posts/:id
  http.patch(
    "https://jsonplaceholder.typicode.com/posts/:id",
    async ({ request, params }) => {
      const { id } = params;
      const body = (await request.json()) as Partial<Post>;
      const post = mockPosts.find((p) => p.id === Number(id));

      if (!post) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json({ ...post, ...body });
    },
  ),

  // DELETE /posts/:id
  http.delete(
    "https://jsonplaceholder.typicode.com/posts/:id",
    () => {
      return new HttpResponse(null, { status: 200 });
    },
  ),
];
