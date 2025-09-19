'use client';

import { ReactNode, useState } from "react";
import { Environment, ParaProvider } from "@getpara/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@getpara/react-sdk/styles.css";

type ProvidersProps = {
  children: ReactNode;
};

const environmentMap: Record<string, Environment> = {
  DEV: Environment.DEV,
  SANDBOX: Environment.SANDBOX,
  BETA: Environment.BETA,
  PROD: Environment.PROD,
  DEVELOPMENT: Environment.DEVELOPMENT,
  PRODUCTION: Environment.PRODUCTION,
};

const resolveEnvironment = (value?: string) =>
  environmentMap[value?.toUpperCase() ?? ""] ?? Environment.BETA;

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const paraApiKey = process.env.NEXT_PUBLIC_PARA_API_KEY ?? "";
  const paraEnv = resolveEnvironment(process.env.NEXT_PUBLIC_PARA_ENV);
  const appName = process.env.NEXT_PUBLIC_PARA_APP_NAME ?? "0G Resume Debug";

  return (
    <QueryClientProvider client={queryClient}>
      <ParaProvider
        paraClientConfig={{
          apiKey: paraApiKey,
          env: paraEnv,
        }}
        config={{
          appName,
        }}
      >
        {children}
      </ParaProvider>
    </QueryClientProvider>
  );
}
