import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import * as api from "../api";
import { Card, SectionHeader, Input, Select, Button, Label, ResultBox } from "./UI";
import { TLP_COLORS } from "./UI";

export default function SubmitPage() {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    private_key: "", ioc_type: "ip", value: "",
    threat_type: "phishing", severity: 5, tlp_level: "GREEN"
  });
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.private_key || !form.value) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await api.submitIoC({ ...form, severity: parseInt(form.severity) });
      setResult({ success: !r.detail, data: r, error: r.detail });
    } catch (e) {
      setResult({ success: false, error: e.message });
    }
    setLoading(false);
  };

  const severityColor = form.severity >= 8 ? "#ef4444" : form.severity >= 5 ? "#f59e0b" : "#22c55e";

  return (
    <div style={{ maxWidth: "580px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ color: theme.text, margin: 0, fontSize: "1.2rem", fontWeight: "900", letterSpacing: "0.02em" }}>
          Submit Threat Indicator
        </h2>
        <p style={{ color: theme.textMuted, margin: "0.3rem 0 0", fontSize: "0.78rem" }}>
          Publish an IoC immutably to the blockchain with source attribution
        </p>
      </div>

      <Card>
        <SectionHeader accent="#3b82f6">⬆ New Indicator</SectionHeader>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.15rem" }}>

          <div>
            <Label>Private Key (your Ganache account)</Label>
            <Input name="private_key" type="password" value={form.private_key} onChange={handle} placeholder="0x..." />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <Label>IoC Type</Label>
              <Select name="ioc_type" value={form.ioc_type} onChange={handle}>
                <option value="ip">IP Address</option>
                <option value="domain">Domain</option>
                <option value="hash">File Hash</option>
                <option value="url">URL</option>
              </Select>
            </div>
            <div>
              <Label>Threat Type</Label>
              <Select name="threat_type" value={form.threat_type} onChange={handle}>
                <option value="phishing">Phishing</option>
                <option value="malware">Malware</option>
                <option value="c2">C2 Server</option>
                <option value="ransomware">Ransomware</option>
              </Select>
            </div>
          </div>

          <div>
            <Label>IoC Value</Label>
            <Input
              name="value"
              value={form.value}
              onChange={handle}
              placeholder="e.g. 185.220.101.5 or evil-domain.com"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <Label>
                Severity —{" "}
                <span style={{ color: severityColor, fontWeight: "900" }}>{form.severity}/10</span>
              </Label>
              <input
                name="severity" type="range" min="1" max="10"
                value={form.severity} onChange={handle}
                style={{ width: "100%", accentColor: severityColor, cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                <span style={{ color: "#22c55e", fontSize: "0.6rem" }}>LOW</span>
                <span style={{ color: "#f59e0b", fontSize: "0.6rem" }}>MED</span>
                <span style={{ color: "#ef4444", fontSize: "0.6rem" }}>HIGH</span>
              </div>
            </div>
            <div>
              <Label>TLP Level</Label>
              <Select
                name="tlp_level"
                value={form.tlp_level}
                onChange={handle}
                style={{ color: TLP_COLORS[form.tlp_level] }}
              >
                <option value="WHITE">WHITE — Public</option>
                <option value="GREEN">GREEN — Community</option>
                <option value="AMBER">AMBER — Limited</option>
                <option value="RED">RED — Restricted</option>
              </Select>
            </div>
          </div>

          {/* TLP explanation */}
          <div style={{
            padding: "0.75rem", borderRadius: "8px",
            background: theme.bgSecondary,
            border: `1px solid ${theme.border}`,
            fontSize: "0.72rem", color: theme.textMuted, lineHeight: 1.6
          }}>
            <span style={{ color: TLP_COLORS[form.tlp_level], fontWeight: "700" }}>{form.tlp_level}:</span>{" "}
            {{
              WHITE: "Unrestricted — can be shared publicly",
              GREEN: "Community only — share within trusted groups",
              AMBER: "Limited distribution — need-to-know basis",
              RED:   "Restricted — do not share outside recipient",
            }[form.tlp_level]}
          </div>

          <Button onClick={submit} disabled={loading} style={{ padding: "0.85rem" }}>
            {loading ? "⏳ WRITING TO BLOCKCHAIN..." : "⬆ SUBMIT IoC TO CHAIN"}
          </Button>

          {result && (
            <ResultBox success={result.success}>
              {result.success ? (
                <>
                  <div style={{ color: "#22c55e", fontWeight: "700", marginBottom: "0.4rem" }}>
                    ✅ IoC written to blockchain!
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.72rem", fontFamily: "monospace" }}>TX: {result.data?.tx_hash}</div>
                  <div style={{ color: "#475569", fontSize: "0.72rem", fontFamily: "monospace" }}>Block: #{result.data?.block}</div>
                </>
              ) : (
                <div style={{ color: "#ef4444", fontSize: "0.82rem" }}>❌ {result.error}</div>
              )}
            </ResultBox>
          )}
        </div>
      </Card>
    </div>
  );
}
