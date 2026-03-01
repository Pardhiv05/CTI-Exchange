import { useTheme } from "../context/ThemeContext";
import { PulsingDot } from "./UI";

export default function Header({ page, setPage }) {
  const { theme, isDark, toggle } = useTheme();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "submit",    label: "Submit IoC", icon: "⬆" },
    { id: "members",   label: "Members",    icon: "◉" },
  ];

  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      padding: "0 1.5rem",
      height: "54px",
      borderBottom: `1px solid ${theme.border}`,
      background: theme.headerBg,
      backdropFilter: "blur(16px)",
      position: "relative",
      zIndex: 100,
      flexShrink: 0,
      gap: "1rem",
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: "1.5rem" }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px",
          background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px",
          boxShadow: "0 0 12px rgba(14,165,233,0.4)"
        }}>🛡️</div>
        <div>
          <div style={{ color: theme.text, fontWeight: "900", fontSize: "0.82rem", letterSpacing: "0.08em", lineHeight: 1 }}>
            CTI EXCHANGE
          </div>
          <div style={{ color: theme.textSubtle, fontSize: "0.57rem", letterSpacing: "0.14em" }}>
            TRUST BUT VERIFY
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", gap: "3px" }}>
        {navItems.map(({ id, label, icon }) => {
          const active = page === id;
          return (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                padding: "0.38rem 1rem",
                background: active ? `${theme.accent}15` : "transparent",
                color: active ? theme.accent : theme.textMuted,
                border: active ? `1px solid ${theme.accent}30` : "1px solid transparent",
                borderRadius: "7px",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: active ? "700" : "500",
                fontSize: "0.76rem",
                letterSpacing: "0.04em",
                transition: "all 0.15s",
              }}
            >
              <span style={{ marginRight: "5px", opacity: 0.7 }}>{icon}</span>
              {label}
            </button>
          );
        })}
      </nav>

      {/* Right side */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1.25rem" }}>

        {/* Status dots */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {[
            { label: "GANACHE", color: "#22c55e" },
            { label: "API",     color: "#38bdf8" },
          ].map(({ label, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <PulsingDot color={color} size={6} />
              <span style={{ color: theme.textSubtle, fontSize: "0.65rem", letterSpacing: "0.1em" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "20px", background: theme.border }} />

        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
            border: `1px solid ${theme.border}`,
            borderRadius: "8px",
            padding: "0.35rem 0.75rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s",
          }}
        >
          {/* Toggle track */}
          <div style={{
            width: "32px", height: "16px",
            background: isDark ? "#1e3a5f" : "#bae6fd",
            borderRadius: "8px",
            position: "relative",
            border: `1px solid ${isDark ? "#38bdf8" : "#0284c7"}40`,
            transition: "background 0.3s",
          }}>
            <div style={{
              position: "absolute",
              top: "1px",
              left: isDark ? "1px" : "15px",
              width: "12px", height: "12px",
              borderRadius: "50%",
              background: isDark ? "#38bdf8" : "#0284c7",
              transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: `0 0 6px ${isDark ? "#38bdf8" : "#0284c7"}80`,
            }} />
          </div>
          <span style={{ fontSize: "0.72rem", color: theme.textMuted, fontFamily: "monospace" }}>
            {isDark ? "🌙" : "☀️"}
          </span>
        </button>

        {/* Clock */}
        <span style={{ color: theme.textSubtle, fontSize: "0.68rem", fontFamily: "monospace" }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </header>
  );
}
