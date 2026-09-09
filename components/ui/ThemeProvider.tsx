"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with "light" on server — the inline script in layout.tsx already set
  // the correct data-theme attribute before hydration, so there's no flash.
  // suppressHydrationWarning on <html> handles the attribute mismatch.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Read what the inline script actually set
    const current = document.documentElement.getAttribute("data-theme") as Theme | null;
    if (current === "dark") setTheme("dark");
  }, []);

  const toggle = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
