"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UsernameProvider } from "@/contexts/UsernameContext";
import { theme } from "@/theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30 * 1000 },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <UsernameProvider>{children}</UsernameProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
