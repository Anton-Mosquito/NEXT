// src/__mocks__/handlers/userHandlers.ts
import { http, HttpResponse } from "msw";
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
  http.get("https://jsonplaceholder.typicode.com/users", () => {
    return HttpResponse.json(mockUsers);
  }),

  http.get("https://jsonplaceholder.typicode.com/users/:id", ({ params }) => {
    const { id } = params;
    const user = mockUsers.find((u) => u.id === Number(id));
    if (!user) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(user);
  }),
];
