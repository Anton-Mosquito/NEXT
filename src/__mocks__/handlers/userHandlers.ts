// src/__mocks__/handlers/userHandlers.ts
import { rest } from "msw";
import type { User } from "@/entities/user";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Smith",
    username: "alice",
    email: "alice@test.com",
    phone: "555-1234",
    website: "alice.dev",
    address: { city: "Kyiv", street: "Main St 1" },
    company: { name: "TechCorp" },
  },
  {
    id: 2,
    name: "Bob Johnson",
    username: "bob",
    email: "bob@test.com",
    phone: "555-5678",
    website: "bob.dev",
    address: { city: "Lviv", street: "Oak Ave 5" },
    company: { name: "StartupXYZ" },
  },
];

export const userHandlers = [
  rest.get("https://jsonplaceholder.typicode.com/users", (req, res, ctx) => {
    return res(ctx.json(mockUsers));
  }),

  rest.get("https://jsonplaceholder.typicode.com/users/:id", (req, res, ctx) => {
    const { id } = req.params;
    const user = mockUsers.find((u) => u.id === Number(id));
    if (!user) return res(ctx.status(404));
    return res(ctx.json(user));
  }),
];
