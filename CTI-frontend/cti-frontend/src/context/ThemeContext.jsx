import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();

export const dark = {
  name: "dark",
  bg: "#030712",
  bgSecondary: "#0f172a",
  bgCard: "rgba(15,23,42,0.85)",
  bgCardHover: "rgba(15,23,42,0.95)",
  bgInput: "rgba(15,23,42,0.9)",
  border: "#1e293b",
  borderAccent: "#1e3a5f",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textSubtle: "#334155",
  accent: "#38bdf8",
  accentGlow: "rgba(56,189,248,0.08)",
  gridLine: "rgba(56,189,248,0.03)",
  scrollbar: "#1e3a5f",
  headerBg: "rgba(3,7,18,0.92)",
  footerBg: "rgba(3,7,18,0.92)",
  tableRowAlt: "rgba(30,41,59,0.3)",
  danger: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  purple: "#a78bfa",
};

export const light = {
  name: "light",
  bg: "#f0f4f8",
  bgSecondary: "#e2e8f0",
  bgCard: "rgba(255,255,255,0.9)",
  bgCardHover: "rgba(255,255,255,1)",
  bgInput: "rgba(248,250,252,0.95)",
  border: "#cbd5e1",
  borderAccent: "#93c5fd",
  text: "#0f172a",
  textMuted: "#475569",
  textSubtle: "#94a3b8",
  accent: "#0284c7",
  accentGlow: "rgba(2,132,199,0.06)",
  gridLine: "rgba(2,132,199,0.04)",
  scrollbar: "#93c5fd",
  headerBg: "rgba(255,255,255,0.95)",
  footerBg: "rgba(255,255,255,0.95)",
  tableRowAlt: "rgba(241,245,249,0.7)",
  danger: "#dc2626",
  success: "#16a34a",
  warning: "#d97706",
  purple: "#7c3aed",
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? dark : light;
  const toggle = () => setIsDark(p => !p);
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
