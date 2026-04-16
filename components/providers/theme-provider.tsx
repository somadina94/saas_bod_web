"use client";

import * as React from "react";

const STORAGE_KEY = "theme";

export type ThemeName = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  resolvedTheme: "light" | "dark";
  systemTheme: "light" | "dark";
  themes: string[];
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: ThemeName, system: "light" | "dark"): "light" | "dark" {
  if (theme === "system") return system;
  return theme;
}

function applyDom(resolved: "light" | "dark") {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }
}

/**
 * Dark mode without injecting a script from a client component (React 19 warns on that pattern).
 * Pair with the inline init script in `app/layout.tsx` to avoid FOUC.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<ThemeName>("system");
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("light");
  const [mounted, setMounted] = React.useState(false);

  const resolvedTheme = React.useMemo(
    () => resolveTheme(theme, systemTheme),
    [theme, systemTheme],
  );

  React.useLayoutEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
      if (raw === "light" || raw === "dark" || raw === "system") {
        setThemeState(raw);
      }
    } catch {
      /* noop */
    }
    setSystemTheme(getSystemTheme());
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(getSystemTheme());
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  React.useLayoutEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* noop */
    }
    applyDom(resolvedTheme);
  }, [theme, resolvedTheme, mounted]);

  const setTheme = React.useCallback((t: ThemeName) => {
    setThemeState(t);
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
      themes: ["light", "dark", "system"],
    }),
    [theme, setTheme, resolvedTheme, systemTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Drop-in shape compatible with `next-themes` for Sonner / toggles. */
export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: undefined as string | undefined,
      setTheme: (_t: string) => {},
      resolvedTheme: undefined as string | undefined,
      systemTheme: undefined as "light" | "dark" | undefined,
      themes: [] as string[],
    };
  }
  return {
    theme: ctx.theme,
    setTheme: (t: string) => {
      if (t === "light" || t === "dark" || t === "system") ctx.setTheme(t);
    },
    resolvedTheme: ctx.resolvedTheme,
    systemTheme: ctx.systemTheme,
    themes: ctx.themes,
  };
}
