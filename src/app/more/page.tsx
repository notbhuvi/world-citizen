"use client";

import { useState } from "react";
import Link from "next/link";
import { LockKeyhole, Trash2, UserCircle } from "lucide-react";
import { SECTIONS } from "@/lib/sections";
import { useAuthContext } from "@/components/auth/AuthProvider";

export default function MorePage() {
  const auth = useAuthContext();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="px-4 pt-4">
      {auth.account && (
        <div className="glass mb-5 rounded-2xl p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
              <UserCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">{auth.account.name}</p>
              <p className="text-[11px] text-muted">Account stored only on this device</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={auth.lock}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-black/5 py-2 text-xs font-medium dark:bg-white/10"
            >
              <LockKeyhole size={13} /> Lock app
            </button>
            {!confirmingDelete ? (
              <button
                onClick={() => setConfirmingDelete(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-danger/10 py-2 text-xs font-medium text-danger"
              >
                <Trash2 size={13} /> Delete account
              </button>
            ) : (
              <button
                onClick={auth.deleteAccount}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-danger py-2 text-xs font-medium text-white"
              >
                Confirm delete
              </button>
            )}
          </div>
          {confirmingDelete && (
            <p className="mt-2 text-[11px] text-danger">
              This permanently erases your password and recovery code from this device. You&apos;ll need to sign up
              again. Your bookmarks and other data stay intact.
            </p>
          )}
        </div>
      )}

      <h1 className="mb-1 text-xl font-semibold">All Sections</h1>
      <p className="mb-5 text-xs text-muted">Everything Moved Out covers, in one place.</p>
      <div className="grid grid-cols-2 gap-3 pb-4">
        {SECTIONS.filter((s) => s.slug !== "").map((section) => (
          <Link key={section.slug} href={`/${section.slug}`} className="glass flex items-center gap-3 rounded-2xl p-3.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: section.color }}
            >
              <section.icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{section.title}</p>
              <p className="truncate text-[11px] text-muted leading-tight">{section.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
