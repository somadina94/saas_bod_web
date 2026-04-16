"use client";

import { useEffect } from "react";
import { fetchCurrentUser } from "@/lib/api/auth-client";
import { clearAuth, setUser } from "@/lib/store/slices/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";

/** Reconcile persisted Redux user with server session (httpOnly cookies). */
export function AuthSync() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const user = await fetchCurrentUser();
        if (!cancelled) dispatch(setUser(user));
      } catch {
        if (!cancelled) dispatch(clearAuth());
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return null;
}
