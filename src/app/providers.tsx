"use client";

/**
 * Custom theme provider — API-compatible with next-themes' useTheme() but
 * does NOT inject a <script> tag into the React render tree (which triggers
 * a React 19 console warning). Theme initialisation is handled by the
 * <Script strategy="beforeInteractive"> in layout.tsx instead.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  themes: readonly Theme[];
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  systemTheme: "light",
  themes: ["light", "dark", "system"],
  setTheme: () => {},
});

const STORAGE_KEY = "theme";

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    // Sync React state with the DOM state that was set by the inline script
    const sys = getSystemTheme();
    setSystemTheme(sys);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeState(saved);
      }
    } catch {
      // localStorage unavailable (private browsing, etc.)
    }

    // Keep in sync with OS preference changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const newSys: ResolvedTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSys);
      setThemeState((current) => {
        if (current === "system") applyTheme(newSys);
        return current;
      });
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    const resolved: ResolvedTheme =
      next === "system" ? getSystemTheme() : next;
    applyTheme(resolved);
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? systemTheme : theme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      themes: ["light", "dark", "system"] as const,
      setTheme,
    }),
    [theme, resolvedTheme, systemTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Drop-in replacement for next-themes' useTheme() */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
