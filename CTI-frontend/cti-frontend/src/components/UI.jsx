import { useTheme } from "../context/ThemeContext";
import { useAnimatedNumber } from "../hooks/useStats";

export const THREAT_COLORS = {
  phishing:   "#f59e0b",
  malware:    "#ef4444",
  c2:         "#8b5cf6",
  ransomware: "#ec4899",
  default:    "#38bdf8",
};

export const TLP_COLORS = {
  WHITE: "#94a3b8",
  GREEN: "#22c55e",
  AMBER: "#f59e0b",
  RED:   "#ef4444",
};

export function PulsingDot({ color = "#22c55e", size = 7 }) {
  return (
    <span style={{ position: "relative", display: "inline-flex", width: size, height: size, flexShrink: 0 }}>
      <span style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: color, opacity: 0.6,
        animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite"
      }} />
      <span style={{ position: "relative", display: "inline-flex", borderRadius: "50%", width: size, height: size, background: color }} />
    </span>
  );
}

export function ScanLine() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, #00ff88 50%, transparent)",
        animation: "scanline 4s linear infinite", opacity: 0.3
      }} />
    </div>
  );
}

export function StatCard({ label, value, color, icon, subtitle }) {
  const { theme } = useTheme();
  const animated = useAnimatedNumber(typeof value === "number" ? value : 0);

  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${color}25`,
      borderRadius: "14px",
      padding: "1.25rem 1.5rem",
      flex: 1,
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(16px)",
      transition: "border-color 0.3s, box-shadow 0.3s",
      boxShadow: `0 0 20px ${color}08`,
    }}>
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
        background: `linear-gradient(90deg, transparent, ${color}80, transparent)`
      }} />
      <div style={{
        position: "absolute", bottom: -15, right: -5,
        fontSize: "4.5rem", opacity: 0.06, userSelect: "none", lineHeight: 1
      }}>{icon}</div>

      <div style={{ color: theme.textMuted, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.6rem", fontWeight: "600" }}>
        {label}
      </div>
      <div style={{ color, fontSize: "2.4rem", fontWeight: "900", lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>
        {typeof value === "number" ? animated : value}
      </div>
      {subtitle && (
        <div style={{ color: theme.textSubtle, fontSize: "0.68rem", marginTop: "0.35rem" }}>{subtitle}</div>
      )}
    </div>
  );
}

export function ThreatBadge({ type }) {
  const color = THREAT_COLORS[type] || THREAT_COLORS.default;
  return (
    <span style={{
      background: `${color}15`, color, border: `1px solid ${color}35`,
      borderRadius: "5px", padding: "2px 9px",
      fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase"
    }}>{type}</span>
  );
}

export function SeverityBar({ value }) {
  const color = value >= 8 ? "#ef4444" : value >= 5 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
      <div style={{ width: "55px", height: "3px", background: "#1e293b", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ width: `${value * 10}%`, height: "100%", background: color, borderRadius: "2px" }} />
      </div>
      <span style={{ color, fontSize: "0.72rem", fontWeight: "700", fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}

export function Card({ children, style = {} }) {
  const { theme } = useTheme();
  return (
    <div style={{
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: "14px",
      backdropFilter: "blur(16px)",
      overflow: "hidden",
      ...style
    }}>
      {children}
    </div>
  );
}

export function Input({ style = {}, ...props }) {
  const { theme } = useTheme();
  return (
    <input
      {...props}
      style={{
        background: theme.bgInput,
        color: theme.text,
        border: `1px solid ${theme.borderAccent}`,
        borderRadius: "8px",
        padding: "0.65rem 1rem",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.83rem",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
        ...style
      }}
    />
  );
}

export function Select({ children, style = {}, ...props }) {
  const { theme } = useTheme();
  return (
    <select
      {...props}
      style={{
        background: theme.bgInput,
        color: theme.text,
        border: `1px solid ${theme.borderAccent}`,
        borderRadius: "8px",
        padding: "0.65rem 1rem",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.83rem",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        cursor: "pointer",
        ...style
      }}
    >
      {children}
    </select>
  );
}

export function Button({ children, variant = "primary", style = {}, ...props }) {
  const { theme } = useTheme();
  const variants = {
    primary:   { background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", color: "#fff" },
    purple:    { background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff" },
    cyan:      { background: "linear-gradient(135deg, #0891b2, #0e7490)", color: "#fff" },
    danger:    { background: "linear-gradient(135deg, #dc2626, #b91c1c)", color: "#fff" },
    ghost:     { background: "transparent", color: theme.textMuted, border: `1px solid ${theme.border}` },
  };
  return (
    <button
      {...props}
      style={{
        ...variants[variant],
        border: "none",
        borderRadius: "8px",
        padding: "0.7rem 1.4rem",
        cursor: props.disabled ? "not-allowed" : "pointer",
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: "700",
        fontSize: "0.82rem",
        letterSpacing: "0.06em",
        opacity: props.disabled ? 0.6 : 1,
        transition: "opacity 0.2s, transform 0.1s",
        ...style
      }}
    >
      {children}
    </button>
  );
}

export function SectionHeader({ children, accent }) {
  const { theme } = useTheme();
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "8px",
      padding: "0.9rem 1.25rem", borderBottom: `1px solid ${theme.border}`
    }}>
      <PulsingDot color={accent || theme.accent} size={6} />
      <span style={{
        color: accent || theme.accent,
        fontWeight: "700", fontSize: "0.75rem",
        letterSpacing: "0.12em", textTransform: "uppercase"
      }}>{children}</span>
    </div>
  );
}

export function Label({ children, style = {} }) {
  const { theme } = useTheme();
  return (
    <label style={{
      color: theme.textMuted, fontSize: "0.68rem",
      letterSpacing: "0.12em", textTransform: "uppercase",
      display: "block", marginBottom: "0.4rem", fontWeight: "600",
      ...style
    }}>
      {children}
    </label>
  );
}

export function ResultBox({ success, children }) {
  return (
    <div style={{
      padding: "0.9rem 1rem", borderRadius: "8px",
      background: success ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
      border: `1px solid ${success ? "#22c55e35" : "#ef444435"}`,
      animation: "fadeIn 0.3s ease"
    }}>
      {children}
    </div>
  );
}
