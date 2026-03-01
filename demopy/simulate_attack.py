import requests
import time

API = "http://localhost:8000"

print("\n" + "="*60)
print("  PHISHING CAMPAIGN SIMULATION")
print("  CTI Exchange — Real-time Blocking Demo")
print("="*60)

# Simulated incoming network traffic
traffic = [
    ("secure-paypa1.com",              "User clicked phishing email link"),
    ("google.com",                      "Normal web browsing"),
    ("185.220.101.5",                   "Outbound connection attempt"),
    ("login-bankofamerica-verify.net",  "Credential harvesting attempt"),
    ("github.com",                      "Developer activity"),
    ("apple-id-confirm.xyz",            "Phishing link from SMS"),
    ("194.165.16.77",                   "C2 beacon detected"),
    ("stackoverflow.com",               "Normal browsing"),
]

print(f"\n{'CONNECTION':<40} {'STATUS':<15} {'THREAT':<12} {'SEV':<5} {'ACTION'}")
print("-" * 95)

blocked = 0
allowed = 0

for ioc_val, description in traffic:
    time.sleep(0.8)
    try:
        r = requests.get(f"{API}/iocs/check/{ioc_val}").json()
        if r.get("malicious"):
            blocked += 1
            print(f"{ioc_val:<40} {'⛔ BLOCKED':<15} {r['threat_type']:<12} {r['severity']:<5} ALERT RAISED — {description}")
        else:
            allowed += 1
            print(f"{ioc_val:<40} {'✅ ALLOWED':<15} {'—':<12} {'—':<5} {description}")
    except Exception as e:
        print(f"{ioc_val:<40} ERROR: {e}")

print("-" * 95)
print(f"\n  SUMMARY: {blocked} connections BLOCKED | {allowed} connections ALLOWED")
print(f"  All blocks sourced from immutable on-chain CTI")
print("="*60 + "\n")