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
