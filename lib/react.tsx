import { QueryClient, onlineManager } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { type AppRouter } from "@/server/api/root";
import { getTrpcApiUrl, transformer } from "@/lib/shared";
import { tokenCache } from "@/utils/cache";

export const api = createTRPCReact<AppRouter>();

const queryClient = new QueryClient({});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000, // Only persist to storage at most every 3 seconds
});

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          transformer,
          url: getTrpcApiUrl(),
          async headers() {
            const headers = new Map<string, string>();

            if (Platform.OS === "web") {
              // For web: rely on cookies (set credentials: include)
              headers.set("Content-Type", "application/json");
            } else {
              // For native: use Authorization header with token
              const accessToken = await tokenCache?.getToken("accessToken");
              if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
              }
            }

            return Object.fromEntries(headers);
          },
          fetch(url, options) {
            if (Platform.OS === "web") {
              // Include credentials for web to send cookies
              return fetch(url, {
                ...options,
                credentials: "include",
              });
            }
            return fetch(url, options);
          },
        }),
      ],
    })
  );

  // Set up network status monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const status = !!state.isConnected;
      onlineManager.setOnline(status);
    });

    return unsubscribe;
  }, []);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() => {
        // Resume paused mutations when coming back online
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries());
      }}
    >
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </PersistQueryClientProvider>
  );
}
