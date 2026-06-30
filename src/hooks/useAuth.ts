"use client";

import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "@/lib/db";
import { deriveHash, generateRecoveryCode, normalizeRecoveryCode, randomSalt } from "@/lib/authCrypto";

export interface AuthAccount {
  name: string;
  passwordSalt: string;
  passwordHash: string;
  recoverySalt: string;
  recoveryHash: string;
  createdAt: number;
}

const ACCOUNT_KEY = "auth_account";
const SESSION_KEY = "wc_unlocked";

export function useAuth() {
  const [account, setAccountState] = useState<AuthAccount | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const acc = await getSetting<AuthAccount | null>(ACCOUNT_KEY, null);
      setAccountState(acc);
      setUnlocked(typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1");
      setReady(true);
    })();
  }, []);

  const signup = useCallback(async (name: string, password: string): Promise<string> => {
    const passwordSalt = randomSalt();
    const passwordHash = await deriveHash(password, passwordSalt);
    const recoveryCode = generateRecoveryCode();
    const recoverySalt = randomSalt();
    const recoveryHash = await deriveHash(recoveryCode, recoverySalt);
    const account: AuthAccount = {
      name: name.trim(),
      passwordSalt,
      passwordHash,
      recoverySalt,
      recoveryHash,
      createdAt: Date.now(),
    };
    await setSetting(ACCOUNT_KEY, account);
    setAccountState(account);
    sessionStorage.setItem(SESSION_KEY, "1");
    setUnlocked(true);
    return recoveryCode;
  }, []);

  const login = useCallback(
    async (password: string): Promise<boolean> => {
      if (!account) return false;
      const hash = await deriveHash(password, account.passwordSalt);
      if (hash !== account.passwordHash) return false;
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      return true;
    },
    [account]
  );

  const lock = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  }, []);

  const resetWithRecoveryCode = useCallback(
    async (recoveryCode: string, newPassword: string): Promise<string | null> => {
      if (!account) return null;
      const hash = await deriveHash(normalizeRecoveryCode(recoveryCode), account.recoverySalt);
      if (hash !== account.recoveryHash) return null;

      const passwordSalt = randomSalt();
      const passwordHash = await deriveHash(newPassword, passwordSalt);
      const newRecoveryCode = generateRecoveryCode();
      const recoverySalt = randomSalt();
      const recoveryHash = await deriveHash(newRecoveryCode, recoverySalt);

      const next: AuthAccount = { ...account, passwordSalt, passwordHash, recoverySalt, recoveryHash };
      await setSetting(ACCOUNT_KEY, next);
      setAccountState(next);
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
      return newRecoveryCode;
    },
    [account]
  );

  const deleteAccount = useCallback(async () => {
    await setSetting(ACCOUNT_KEY, null);
    setAccountState(null);
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  }, []);

  return { account, unlocked, ready, signup, login, lock, resetWithRecoveryCode, deleteAccount };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
