import { useTheme } from "../context/ThemeContext";

const items = [
  "Blockchain: Ethereum (Ganache)",
  "Contract: CTIRegistry.sol",
  "Backend: FastAPI + Web3.py",
  "Frontend: React + Vite",
  "TLP: Traffic Light Protocol",
];

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer style={{
      height: "26px",
      borderTop: `1px solid ${theme.border}`,
      background: theme.footerBg,
      display: "flex",
      alignItems: "center",
      padding: "0 1.5rem",
      gap: "2rem",
      flexShrink: 0,
    }}>
      {items.map((item, i) => (
        <span key={i} style={{
          color: theme.textSubtle,
          fontSize: "0.6rem",
          letterSpacing: "0.08em",
        }}>
          {item}
        </span>
      ))}
    </footer>
  );
}
