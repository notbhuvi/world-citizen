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
// Persisted in IndexedDB (not sessionStorage) so staying logged in survives the
// PWA being closed/backgrounded — only an explicit "Lock app" or delete clears it.
const UNLOCKED_KEY = "auth_unlocked";

export function useAuth() {
  const [account, setAccountState] = useState<AuthAccount | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const [acc, wasUnlocked] = await Promise.all([
        getSetting<AuthAccount | null>(ACCOUNT_KEY, null),
        getSetting<boolean>(UNLOCKED_KEY, false),
      ]);
      setAccountState(acc);
      setUnlocked(wasUnlocked);
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
    await setSetting(UNLOCKED_KEY, true);
    setUnlocked(true);
    return recoveryCode;
  }, []);

  const login = useCallback(
    async (password: string): Promise<boolean> => {
      if (!account) return false;
      const hash = await deriveHash(password, account.passwordSalt);
      if (hash !== account.passwordHash) return false;
      await setSetting(UNLOCKED_KEY, true);
      setUnlocked(true);
      return true;
    },
    [account]
  );

  const lock = useCallback(() => {
    setSetting(UNLOCKED_KEY, false);
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
      await setSetting(UNLOCKED_KEY, true);
      setUnlocked(true);
      return newRecoveryCode;
    },
    [account]
  );

  const deleteAccount = useCallback(async () => {
    await setSetting(ACCOUNT_KEY, null);
    setAccountState(null);
    await setSetting(UNLOCKED_KEY, false);
    setUnlocked(false);
  }, []);

  return { account, unlocked, ready, signup, login, lock, resetWithRecoveryCode, deleteAccount };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
