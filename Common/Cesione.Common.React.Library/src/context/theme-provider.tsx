import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ITheme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ITheme;
  storageKey?: string;
};

type Coords = { x: number; y: number };

export type ThemeProviderState = {
  /** Preferencia del usuario: "light" | "dark" | "system" */
  theme: ITheme;
  /** Tema efectivamente aplicado al <html>: "light" | "dark" */
  resolvedTheme: Exclude<ITheme, "system">;
  setTheme: (theme: ITheme) => void;
  toggleTheme: (coords?: Coords) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  // 1) Estado controlado por el usuario (light/dark/system)
  const [theme, setTheme] = useState<ITheme>(defaultTheme);

  // 2) Cargar preferencia desde localStorage (SSR-safe: solo en cliente)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey) as ITheme | null;
      if (saved) setTheme(saved);
    } catch {
      // no-op: almacenamiento no disponible (modo privado, etc.)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) Resuelve el tema efectivo (lo que realmente se aplica al <html>)
  const resolvedTheme = useMemo<"light" | "dark">(() => {
    if (theme !== "system") return theme;
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, [theme]);

  // 4) Aplica clases al <html> cuando cambie el resolvedTheme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  // 5) Si el usuario está en "system", escucha cambios del SO y actualiza clases al vuelo
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = mql.matches ? "dark" : "light";
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(next);
    };
    // addEventListener es el moderno; fallback por compatibilidad
    mql.addEventListener?.("change", handler);
    mql.addListener?.(handler);
    return () => {
      mql.removeEventListener?.("change", handler);
      mql.removeListener?.(handler);
    };
  }, [theme]);

  // 6) Guardar en localStorage cuando cambie la preferencia del usuario
  const handleSetTheme = (t: ITheme) => {
    try {
      window.localStorage.setItem(storageKey, t);
    } catch {
      // no-op
    }
    setTheme(t);
  };

  // 7) Toggle con animación (opcional, si el browser soporta View Transitions)
  const toggleTheme = (coords?: Coords) => {
    // Si el usuario está en "system", togglear entre light/dark sobre el resolved
    const base = resolvedTheme;
    const next: Exclude<ITheme, "system"> = base === "light" ? "dark" : "light";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canAnimate = typeof document !== "undefined" && "startViewTransition" in document;

    const applyNext = () => handleSetTheme(next);

    if (!canAnimate || prefersReducedMotion) {
      applyNext();
      return;
    }

    // Efecto "reveal" opcional: pasa coords al CSS si quieres usar clip-path animado
    const root = document.documentElement;
    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    document.startViewTransition(() => {
      applyNext();
    });
  };

  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme: handleSetTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeProviderContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
