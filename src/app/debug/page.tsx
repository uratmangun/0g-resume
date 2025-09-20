'use client';

import { useCallback } from "react";
import {
  OAuthMethod,
  ParaModal,
  useAccount,
  useLogout,
  useModal,
} from "@getpara/react-sdk";

const baseButtonStyles = "mt-4 px-6 py-2 font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";
const connectedStyles = "bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white";
const disconnectedStyles = "bg-blue-600 hover:bg-blue-700 text-white";

export default function DebugPage() {
  const { openModal } = useModal();
  const { data: account, isPending: isAccountPending } = useAccount();
  const { logoutAsync, isPending: isLogoutPending } = useLogout();

  const isConnected = account?.isConnected ?? false;
  const identifier = account?.email ?? account?.phone ?? null;

  const paraApiKey = process.env.NEXT_PUBLIC_PARA_API_KEY ?? "";
  const appName = process.env.NEXT_PUBLIC_PARA_APP_NAME ?? "0G Resume Debug";
  const isParaConfigured = paraApiKey.length > 0;
  const loginDisabled = (!isParaConfigured && !isConnected) || isLogoutPending;

  const buttonLabel = (() => {
    if (isLogoutPending) {
      return "Signing out...";
    }
    if (isAccountPending) {
      return "Checking Para session...";
    }

    return isConnected ? "Sign out of Para" : "Sign in";

  })();

  const buttonClasses = [
    baseButtonStyles,
    isConnected ? connectedStyles : disconnectedStyles,
  ].join(" ");

  const handleClick = useCallback(async () => {
    if (!isConnected) {
      if (!isParaConfigured) {
        console.warn("Set NEXT_PUBLIC_PARA_API_KEY to enable Para login.");
        return;
      }

      openModal();
      return;
    }

    try {
      await logoutAsync();
    } catch (error) {
      console.error("Failed to log out of Para", error);
    }
  }, [isConnected, isParaConfigured, logoutAsync, openModal]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Debug
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Quick diagnostics for server and client. Only public env vars are shown.
          </p>
          <button
            type="button"
            onClick={handleClick}
            disabled={loginDisabled}
            className={buttonClasses}
          >
            {buttonLabel}
          </button>
          {isConnected && identifier ? (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Connected as {identifier}
            </p>
          ) : null}
          {!isParaConfigured ? (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              Add NEXT_PUBLIC_PARA_API_KEY to enable Para authentication.
            </p>
          ) : null}
          <ParaModal
            appName={appName}

            oAuthMethods={[OAuthMethod.GOOGLE, OAuthMethod.APPLE]}

          />
        </header>
        {/* Intentionally left blank per request to remove all debug cards */}
      </div>
    </div>
  );
}
