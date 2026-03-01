import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import * as api from "../api";
import { Card, SectionHeader, Input, Button, Label, ResultBox } from "./UI";

function AddMemberForm() {
  const { theme } = useTheme();
  const [form, setForm]     = useState({ admin_private_key: "", member_address: "", org_name: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const add = async () => {
    if (!form.admin_private_key || !form.member_address || !form.org_name) return;
    setLoading(true);
    try {
      const r = await api.addMember(form);
      setResult({ success: !r.detail, tx: r.tx_hash, error: r.detail });
    } catch (e) {
      setResult({ success: false, error: e.message });
    }
    setLoading(false);
  };

  return (
    <Card>
      <SectionHeader accent="#7c3aed">➕ Add Consortium Member</SectionHeader>
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.1rem" }}>

        <div style={{
          padding: "0.75rem 1rem", borderRadius: "8px",
          background: theme.bgSecondary, border: `1px solid ${theme.border}`,
          fontSize: "0.72rem", color: theme.textMuted, lineHeight: 1.6
        }}>
          Only the <span style={{ color: "#a78bfa", fontWeight: "700" }}>admin account</span> (contract deployer) can add members. Use Account #1's private key in the field below.
        </div>

        <div>
          <Label>Admin Private Key</Label>
          <Input
            type="password"
            value={form.admin_private_key}
            onChange={e => setForm({ ...form, admin_private_key: e.target.value })}
            placeholder="0x... (Account #1 — deployer key)"
          />
        </div>

        <div>
          <Label>Member Wallet Address</Label>
          <Input
            value={form.member_address}
            onChange={e => setForm({ ...form, member_address: e.target.value })}
            placeholder="0x... (Account #2, #3, #4...)"
          />
        </div>

        <div>
          <Label>Organization Name</Label>
          <Input
            value={form.org_name}
            onChange={e => setForm({ ...form, org_name: e.target.value })}
            placeholder="e.g. CrowdStrike, Palo Alto Networks"
          />
        </div>

        <Button variant="purple" onClick={add} disabled={loading} style={{ padding: "0.8rem" }}>
          {loading ? "ADDING TO BLOCKCHAIN..." : "ADD MEMBER"}
        </Button>

        {result && (
          <ResultBox success={result.success}>
            {result.success ? (
              <>
                <div style={{ color: "#22c55e", fontWeight: "700", marginBottom: "0.3rem" }}>✅ Member added successfully!</div>
                <div style={{ color: "#475569", fontSize: "0.7rem", fontFamily: "monospace" }}>TX: {result.tx?.slice(0, 30)}...</div>
              </>
            ) : (
              <div style={{ color: "#ef4444", fontSize: "0.82rem" }}>❌ {result.error}</div>
            )}
          </ResultBox>
        )}
      </div>
    </Card>
  );
}

function ReputationLookup() {
  const { theme } = useTheme();
  const [addr, setAddr]     = useState("");
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!addr.trim()) return;
    setLoading(true);
    try {
      const r = await api.getReputation(addr.trim());
      setData(r);
    } catch {
      setData({ error: "Member not found or invalid address" });
    }
    setLoading(false);
  };

  const score     = data?.reputation || 0;
  const scoreColor = score >= 200 ? "#22c55e" : score >= 100 ? "#38bdf8" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel = score >= 200 ? "TRUSTED" : score >= 100 ? "RELIABLE" : score >= 50 ? "CAUTION" : "LOW";

  return (
    <Card>
      <SectionHeader accent="#f59e0b">⭐ Reputation Lookup</SectionHeader>
      <div style={{ padding: "1.5rem" }}>

        <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
          <Input
            value={addr}
            onChange={e => setAddr(e.target.value)}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="Enter wallet address 0x..."
          />
          <Button variant="cyan" onClick={check} disabled={loading} style={{ whiteSpace: "nowrap" }}>
            {loading ? "..." : "CHECK"}
          </Button>
        </div>

        {!data && (
          <div style={{ color: theme.textSubtle, fontSize: "0.78rem", textAlign: "center", padding: "2rem 0" }}>
            Enter a wallet address to view reputation score and contribution stats
          </div>
        )}

        {data?.error && (
          <div style={{ color: "#ef4444", fontSize: "0.82rem" }}>❌ {data.error}</div>
        )}

        {data && !data.error && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Score display */}
            <div style={{
              textAlign: "center", padding: "1.5rem 0",
              borderBottom: `1px solid ${theme.border}`, marginBottom: "1.25rem"
            }}>
              <div style={{
                fontSize: "3.8rem", fontWeight: "900",
                color: scoreColor, fontFamily: "monospace", lineHeight: 1
              }}>{score}</div>
              <div style={{
                display: "inline-block", marginTop: "0.4rem",
                background: `${scoreColor}15`, color: scoreColor,
                border: `1px solid ${scoreColor}35`,
                borderRadius: "20px", padding: "2px 12px",
                fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.1em"
              }}>{scoreLabel}</div>
              <div style={{ color: theme.textSubtle, fontSize: "0.68rem", marginTop: "0.3rem" }}>REPUTATION SCORE</div>

              {/* Score bar */}
              <div style={{ margin: "0.85rem auto 0", maxWidth: "200px" }}>
                <div style={{ height: "5px", background: theme.border, borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(score / 5, 100)}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${scoreColor}70, ${scoreColor})`,
                    borderRadius: "3px",
                    transition: "width 0.8s ease"
                  }} />
                </div>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {[
                { label: "Organization",    value: data.org_name,  color: theme.text },
                { label: "IoCs Submitted",  value: data.ioc_count, color: "#38bdf8" },
                { label: "Member Since",    value: new Date(data.joined_at * 1000).toLocaleDateString(), color: theme.textMuted },
                { label: "Status",          value: data.active ? "● ACTIVE" : "○ REVOKED", color: data.active ? "#22c55e" : "#ef4444" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: theme.textMuted, fontSize: "0.78rem" }}>{label}</span>
                  <span style={{ color, fontSize: "0.82rem", fontWeight: "700", fontFamily: "monospace" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Scoring legend */}
            <div style={{
              marginTop: "1.25rem", padding: "0.75rem",
              background: theme.bgSecondary, borderRadius: "8px",
              border: `1px solid ${theme.border}`
            }}>
              <div style={{ color: theme.textMuted, fontSize: "0.65rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                REPUTATION SCORING
              </div>
              {[
                { action: "Submit IoC",        points: "+10" },
                { action: "IoC upvoted",       points: "+5"  },
                { action: "IoC downvoted",     points: "-3"  },
              ].map(({ action, points }) => (
                <div key={action} style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ color: theme.textSubtle, fontSize: "0.7rem" }}>{action}</span>
                  <span style={{
                    color: points.startsWith("+") ? "#22c55e" : "#ef4444",
                    fontSize: "0.7rem", fontWeight: "700", fontFamily: "monospace"
                  }}>{points}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function MembersPage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", maxWidth: "920px", margin: "0 auto" }}>
      <AddMemberForm />
      <ReputationLookup />
    </div>
  );
}
