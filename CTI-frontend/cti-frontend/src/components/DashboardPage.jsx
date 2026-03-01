import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLiveStats } from "../hooks/useStats";
import * as api from "../api";
import {
  StatCard, ThreatBadge, SeverityBar, Card,
  SectionHeader, Input, Button, ResultBox,
  ScanLine, PulsingDot, THREAT_COLORS, TLP_COLORS
} from "./UI";

function IoCLookup() {
  const { theme } = useTheme();
  const [query, setQuery]   = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await api.checkIoC(query.trim());
      setResult(r);
    } catch { setResult({ error: true }); }
    setLoading(false);
  };

  return (
    <Card style={{ position: "relative", flex: 1 }}>
      <ScanLine />
      <SectionHeader accent="#38bdf8">Real-time IoC Lookup</SectionHeader>
      <div style={{ padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="IP / Domain / Hash / URL..."
          />
          <Button onClick={check} disabled={loading} style={{ whiteSpace: "nowrap" }}>
            {loading ? "SCANNING..." : "CHECK"}
          </Button>
        </div>

        {result && !result.error && (
          <ResultBox success={!result.malicious}>
            {result.malicious ? (
              <div>
                <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "1rem", marginBottom: "0.6rem" }}>
                  ⛔ MALICIOUS — BLOCK IMMEDIATELY
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Type: <span style={{ color: "#e2e8f0" }}>{result.ioc_type}</span>
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Threat: <ThreatBadge type={result.threat_type} />
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    Severity: <span style={{ color: "#ef4444", fontWeight: "700" }}>{result.severity}/10</span>
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    TLP: <span style={{ color: TLP_COLORS[result.tlp], fontWeight: "700" }}>{result.tlp}</span>
                  </span>
                </div>
                <div style={{ color: "#475569", fontSize: "0.7rem", marginTop: "0.6rem", fontFamily: "monospace" }}>
                  ▲ {result.upvotes} ▼ {result.downvotes} | {result.contributor?.slice(0, 20)}...
                </div>
              </div>
            ) : (
              <div style={{ color: "#22c55e", fontWeight: "700" }}>
                ✅ NOT FOUND IN THREAT DATABASE — Appears clean
              </div>
            )}
          </ResultBox>
        )}

        {/* Threat legend */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "1rem" }}>
          {Object.entries(THREAT_COLORS).filter(([k]) => k !== "default").map(([type, color]) => (
            <span key={type} style={{
              fontSize: "0.62rem", color, background: `${color}12`,
              padding: "2px 9px", borderRadius: "20px", border: `1px solid ${color}28`
            }}>{type}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ThreatMix({ iocs }) {
  const { theme } = useTheme();
  const counts = iocs.reduce((acc, ioc) => {
    acc[ioc.threat_type] = (acc[ioc.threat_type] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card style={{ width: "190px", flexShrink: 0 }}>
      <SectionHeader accent={theme.textMuted}>Threat Mix</SectionHeader>
      <div style={{ padding: "1rem" }}>
        {Object.entries(counts).length === 0 ? (
          <div style={{ color: theme.textSubtle, fontSize: "0.75rem", textAlign: "center", padding: "1rem 0" }}>
            No data yet
          </div>
        ) : Object.entries(counts).map(([type, count]) => {
          const color = THREAT_COLORS[type] || THREAT_COLORS.default;
          const pct = iocs.length ? Math.round(count / iocs.length * 100) : 0;
          return (
            <div key={type} style={{ marginBottom: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color, fontSize: "0.68rem", textTransform: "uppercase", fontWeight: "700" }}>{type}</span>
                <span style={{ color: theme.textMuted, fontSize: "0.68rem" }}>{count}</span>
              </div>
              <div style={{ height: "3px", background: theme.border, borderRadius: "2px" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "2px", transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function IoCTable({ iocs }) {
  const { theme } = useTheme();
  const cols = ["ID", "Value", "Type", "Threat", "Severity", "TLP", "Status", "Votes"];

  return (
    <Card style={{ flex: 1 }}>
      <div style={{
        padding: "0.9rem 1.25rem", borderBottom: `1px solid ${theme.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <PulsingDot color="#22c55e" size={6} />
          <span style={{ color: theme.textMuted, fontWeight: "700", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Recent IoCs on Chain
          </span>
        </div>
        <span style={{ color: theme.textSubtle, fontSize: "0.68rem" }}>{iocs.length} records</span>
      </div>

      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "260px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border}`, position: "sticky", top: 0, background: theme.bgCard, zIndex: 2 }}>
              {cols.map(h => (
                <th key={h} style={{
                  padding: "0.55rem 1rem", color: theme.textMuted,
                  fontWeight: "600", textAlign: "left",
                  fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase"
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {iocs.map((ioc, i) => (
              <tr key={ioc.id} style={{
                borderBottom: `1px solid ${theme.bgSecondary}`,
                background: i % 2 === 0 ? "transparent" : theme.tableRowAlt,
              }}>
                <td style={{ padding: "0.55rem 1rem", color: theme.textSubtle, fontFamily: "monospace" }}>#{ioc.id}</td>
                <td style={{ padding: "0.55rem 1rem", color: theme.text, fontFamily: "monospace", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ioc.value}</td>
                <td style={{ padding: "0.55rem 1rem" }}>
                  <span style={{ color: "#38bdf8", background: "#0ea5e918", border: "1px solid #0ea5e928", borderRadius: "4px", padding: "2px 8px", fontSize: "0.67rem" }}>
                    {ioc.ioc_type}
                  </span>
                </td>
                <td style={{ padding: "0.55rem 1rem" }}><ThreatBadge type={ioc.threat_type} /></td>
                <td style={{ padding: "0.55rem 1rem" }}><SeverityBar value={ioc.severity} /></td>
                <td style={{ padding: "0.55rem 1rem" }}>
                  <span style={{ color: TLP_COLORS[ioc.tlp_level] || theme.textMuted, fontSize: "0.7rem", fontWeight: "700" }}>
                    {ioc.tlp_level}
                  </span>
                </td>
                <td style={{ padding: "0.55rem 1rem" }}>
                  <span style={{ color: ioc.active ? "#22c55e" : "#ef4444", fontSize: "0.7rem", fontWeight: "600" }}>
                    {ioc.active ? "● ACTIVE" : "○ INACTIVE"}
                  </span>
                </td>
                <td style={{ padding: "0.55rem 1rem", fontFamily: "monospace", fontSize: "0.7rem" }}>
                  <span style={{ color: "#22c55e" }}>▲{ioc.upvotes}</span>{" "}
                  <span style={{ color: "#ef4444" }}>▼{ioc.downvotes}</span>
                </td>
              </tr>
            ))}
            {iocs.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: theme.textSubtle }}>
                  No IoCs submitted yet — go to Submit IoC tab to add indicators
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { stats, iocs, lastUpdated } = useLiveStats(api);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", height: "100%", overflow: "auto" }}>
      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <StatCard label="Total IoCs"  value={stats.total_iocs}   color="#ef4444" icon="🎯" subtitle="Indicators on-chain" />
        <StatCard label="Members"     value={stats.member_count} color="#38bdf8" icon="🏢" subtitle="Consortium orgs" />
        <StatCard label="Chain ID"    value={stats.chain_id || "..."} color="#a78bfa" icon="⛓️" subtitle="Local blockchain" />
        <StatCard label="Block"       value={stats.block_number} color="#22c55e" icon="📦" subtitle={`Updated ${lastUpdated.toLocaleTimeString()}`} />
      </div>

      {/* Middle row */}
      <div style={{ display: "flex", gap: "1rem", minHeight: 0 }}>
        <IoCLookup />
        <ThreatMix iocs={iocs} />
      </div>

      {/* Table */}
      <IoCTable iocs={iocs} />
    </div>
  );
}
