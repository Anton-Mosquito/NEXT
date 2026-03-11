// src/shared/api/baseApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

// Єдиний базовий API — всі entities інʼєктують свої endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Post", "User", "Comment", "Auth"],
  endpoints: () => ({}),
});
