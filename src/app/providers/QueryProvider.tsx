"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Lazy useState initializer: the factory runs only on the first render,
  // guaranteeing a single QueryClient instance for the component's lifetime.
  // This is the React 19-compatible alternative to the useRef-during-render pattern.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // data stays fresh for 1 minute
            refetchOnWindowFocus: false, // avoid unexpected refetch on tab switch
            retry: 1, // one retry before surfacing the error
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
