# 🛡️ Trust but Verify — Decentralized CTI Exchange

> *Trust the mathematics, not the middleman.*

A blockchain-based Cyber Threat Intelligence sharing platform where security 
organizations publish Indicators of Compromise (IoCs) immutably, verify each 
other's contributions through community voting, and consume threat data in 
real time — without fear of manipulation, tampering, or centralized failure.

---

## 🔍 What Problem Does This Solve?

Traditional threat intelligence sharing is broken in three ways:

- **No trust** — When Company A shares an IoC with Company B, there is no 
  cryptographic proof the data wasn't tampered with in transit
- **Centralized failure** — Every major CTI platform depends on a single 
  server that can be hacked, taken offline, or shut down
- **No incentive** — Organizations spend hours analyzing threats but get 
  nothing in return for sharing, so they hoard intelligence instead

This project fixes all three using Ethereum smart contracts.

---

## ✨ Features

- **Immutable IoC Storage** — Once written to the blockchain, threat 
  indicators cannot be modified or deleted by anyone, including the admin
- **Cryptographic Attribution** — Every IoC is signed by the submitting 
  organization's Ethereum wallet using ECDSA — identity is mathematically 
  provable
- **Consortium Access Control** — Only approved organizations can write data, 
  enforced at the EVM level via Solidity modifiers
- **Real-time SOC Integration** — REST API allows firewalls and SIEM tools 
  to query the threat registry before allowing network connections
- **On-chain Reputation Scoring** — Contributors earn reputation for quality 
  submissions (+10 per IoC, +5 per upvote) and lose it for false positives 
  (-3 per downvote)
- **Auto-deactivation** — IoCs with more than 5 net downvotes are 
  automatically removed from active threat feeds
- **TLP Classification** — Industry-standard Traffic Light Protocol levels 
  (WHITE / GREEN / AMBER / RED) embedded in every on-chain record
- **Dark / Light Mode** — Full SOC dashboard with animated theme toggle
- **Live Blockchain Stats** — Auto-refreshing stats, threat mix chart, and 
  scrollable IoC table

---

## 🏗️ Architecture

React Frontend (Port 5173)
↓
FastAPI Backend (Port 8000)
↓
Web3.py — JSON-RPC Bridge
↓
Ganache Local Blockchain (Port 7545)
↓
CTIRegistry.sol — Smart Contract

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Smart Contract | Solidity 0.8.19 |
| Blockchain | Ethereum — Ganache (Chain ID 1337) |
| Deployment | Remix IDE |
| Backend | Python FastAPI + Web3.py |
| Validation | Pydantic |
| Frontend | React + Vite |
| Font | JetBrains Mono |

---

## 📁 Project Structure

cti-blockchain-exchange/
│
├── contracts/
│   └── CTIRegistry.sol          # Main smart contract
│
├── cti-backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── contract.py              # Web3 connection + contract instance
│   ├── models.py                # Pydantic request schemas
│   ├── .env                     # Ganache URL, contract address, admin key
│   ├── abi/
│   │   └── CTIRegistry.json     # Contract ABI from Remix
│   └── routes/
│       ├── iocs.py              # IoC submit, check, vote endpoints
│       ├── members.py           # Add member, reputation endpoints
│       └── stats.py             # Blockchain stats endpoint
│
├── cti-frontend/
│   └── src/
│       ├── App.jsx              # Root component + theme provider
│       ├── api.js               # Centralized API calls
│       ├── context/
│       │   └── ThemeContext.jsx # Dark/light mode global state
│       ├── hooks/
│       │   └── useStats.js      # Live blockchain data hooks
│       └── components/
│           ├── UI.jsx           # Shared primitives (Button, Card, Input...)
│           ├── Header.jsx       # Navbar + theme toggle
│           ├── Footer.jsx       # Tech stack footer bar
│           ├── DashboardPage.jsx
│           ├── SubmitPage.jsx
│           └── MembersPage.jsx
│
└── demo/
└── simulate_attack.py       # Phishing campaign simulation script

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python](https://python.org/) 3.11+
- [Ganache Desktop](https://trufflesuite.com/ganache/)
- [Remix IDE](https://remix.ethereum.org/) (browser)

### 1. Deploy the Smart Contract

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create `CTIRegistry.sol` and paste the contract code
3. Compile with Solidity **0.8.19**, EVM version **London**
4. Start Ganache Desktop and open a workspace on port **7545**
5. In Remix — Environment: `Dev - Ganache Provider` → `http://127.0.0.1:7545`
6. Click **Deploy & Verify**
7. Copy the deployed contract address and ABI

### 2. Configure the Backend

```bash
cd cti-backend
pip install fastapi uvicorn web3 python-dotenv
```

Create `.env`:
```env
GANACHE_URL=http://127.0.0.1:7545
CONTRACT_ADDRESS=0xYourDeployedContractAddress
ADMIN_PRIVATE_KEY=0xYourGanacheAccount1PrivateKey
```

Paste the ABI from Remix into `abi/CTIRegistry.json`

### 3. Start the Backend

```bash
cd cti-backend
uvicorn main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### 4. Start the Frontend

```bash
cd cti-frontend
npm install
npm run dev
```

Dashboard available at: `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats/` | Blockchain stats — total IoCs, members, chain ID, block |
| POST | `/iocs/submit` | Submit a new IoC to the blockchain |
| GET | `/iocs/check/{value}` | Real-time malicious check for any IP/domain/hash/URL |
| GET | `/iocs/{id}` | Fetch a specific IoC by on-chain ID |
| POST | `/iocs/vote` | Upvote or downvote an existing IoC |
| POST | `/members/add` | Admin-only — add a new consortium member |
| GET | `/members/{address}/reputation` | Get member reputation score and stats |

---

## 🎭 Running the Demo

### Add Consortium Members
Use the **Members** tab in the dashboard. Add organizations using their 
Ganache account addresses. Admin private key (Account #1) is required.

CrowdStrike       → Account #2 address
Palo Alto Networks → Account #3 address
IBM Security      → Account #4 address
Kaspersky Lab     → Account #5 address

### Submit IoCs
Use the **Submit IoC** tab with each organization's private key.
Verified real-world malicious indicators:
185.220.101.34              ip      c2          severity 9   AMBER
secure-paypa1.com           domain  phishing    severity 8   GREEN
275a021bbfb6489e54d471899f7db9d1  hash  malware  severity 10  RED
45.142.212.100              ip      ransomware  severity 9   RED

### Run the Attack Simulation

```bash
cd demo
python simulate_attack.py
```

This simulates a phishing campaign hitting your network and shows 
real-time blocking decisions sourced from the on-chain CTI registry.

### Test Edge Cases

| Test | Expected Result |
|---|---|
| Submit duplicate IoC | ❌ "IoC already exists" |
| Submit from non-member account | ❌ "Not a consortium member" |
| Add member from non-admin account | ❌ "Not admin" |
| Vote on own IoC | ❌ "Cannot vote own IoC" |
| Vote twice on same IoC | ❌ "Already voted" |
| Submit severity 0 or 11 | ❌ "Severity must be 1-10" |

---

## ⭐ Reputation Scoring

| Action | Points |
|---|---|
| Submit an IoC | +10 |
| Your IoC receives an upvote | +5 |
| Your IoC receives a downvote | -3 |
| Starting score | 100 |
| IoC auto-deactivated (5+ net downvotes) | isActive = false |

---

## 🔒 Smart Contract — Key Functions

```solidity
// Submit a new IoC (consortium members only)
function submitIoC(string iocType, string value, string threatType, 
                   uint8 severity, string tlpLevel) returns (uint256)

// Real-time threat check (free, no gas)
function checkIoC(string value) returns (bool isMalicious, uint256 id)

// Community verification voting
function voteOnIoC(uint256 id, bool upvote)

// Admin: add consortium member
function addMember(address addr, string orgName)

// Get full IoC details
function getIoC(uint256 id) returns (IoC memory)
```

---

## 🌍 Real-World Alignment

This project implements recommendations from:

- **ENISA** — *Blockchain for Cyber Security* report (2020)
- **CISA** — Automated Indicator Sharing (AIS) programme research
- **FS-ISAC** — Financial sector threat sharing consortium model
- **Palo Alto Unit 42** — Blockchain CTI whitepaper (2022)

Simulated consortium members (CrowdStrike, Palo Alto Networks, IBM Security, 
Kaspersky Lab) reflect the real organizations actively researching and 
piloting blockchain-based CTI sharing today.

---

## ⚠️ Known Limitations

- Runs on local Ganache — not a persistent production network
- IoC values stored as plaintext — no encryption for sensitive indicators
- No STIX 2.1 / TAXII 2.1 compatibility yet
- Single admin key — no multi-signature governance
- Private key entered in browser form — MetaMask integration pending

---

## 🔮 Future Enhancements

- [ ] MetaMask browser extension integration
- [ ] STIX 2.1 serialization for SIEM compatibility
- [ ] Multi-signature admin governance (Gnosis Safe)
- [ ] IoC expiry / TTL mechanism
- [ ] Bulk IoC submission API
- [ ] Weighted reputation voting with time decay
- [ ] Webhook / SIEM alerting on new high-severity IoCs
- [ ] Production deployment on Hyperledger Besu or Polygon

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Built With

Solidity · FastAPI · Web3.py · React · Vite · Ganache · Remix IDE

---

*"Trust the mathematics, not the middleman."*
