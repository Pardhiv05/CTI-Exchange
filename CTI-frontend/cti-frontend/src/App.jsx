import { useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Header     from "./components/Header";
import Footer     from "./components/Footer";
import DashboardPage from "./components/DashboardPage";
import SubmitPage    from "./components/SubmitPage";
import MembersPage   from "./components/MembersPage";

function AppShell() {
  const { theme, isDark } = useTheme();
  const [page, setPage] = useState("dashboard");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #root { width: 100%; height: 100%; }
        body {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          background: ${theme.bg};
          color: ${theme.text};
          transition: background 0.35s ease, color 0.35s ease;
        }

        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.scrollbar}; border-radius: 2px; }

        select option { background: ${theme.bgSecondary}; color: ${theme.text}; }

        input:focus, select:focus {
          border-color: ${theme.accent} !important;
          box-shadow: 0 0 0 2px ${theme.accent}18;
        }

        @keyframes scanline {
          0%   { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gridScroll {
          0%   { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
      `}</style>

      <div style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        transition: "background 0.35s ease",
      }}>

        {/* Animated background grid */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `
            linear-gradient(${theme.gridLine} 1px, transparent 1px),
            linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "gridScroll 10s linear infinite",
        }} />

        {/* Top glow */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "800px", height: "250px", pointerEvents: "none", zIndex: 0,
          background: isDark
            ? "radial-gradient(ellipse at top, rgba(56,189,248,0.05) 0%, transparent 70%)"
            : "radial-gradient(ellipse at top, rgba(2,132,199,0.04) 0%, transparent 70%)",
          transition: "background 0.35s ease",
        }} />

        {/* Header */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <Header page={page} setPage={setPage} />
        </div>

        {/* Main content */}
        <main style={{
          flex: 1,
          overflow: "auto",
          padding: "1.25rem 1.5rem",
          position: "relative",
          zIndex: 1,
        }}>
          {page === "dashboard" && <DashboardPage />}
          {page === "submit"    && <SubmitPage />}
          {page === "members"   && <MembersPage />}
        </main>

        {/* Footer */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
