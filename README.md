# ⚡ Slashing-as-a-Service (SaaS) AVS on EigenLayer

## 🛠 Overview

**Slashing-as-a-Service (SaaS) AVS** is a modular, EigenLayer-integrated system that monitors validator misbehavior (like **downtime** and **double-signing**) and autonomously triggers slashing through AVS logic.

It leverages:
- **DelegationManager & AllocationManager** from EigenLayer Core
- **Modular slashing rules** for scalability
- **Off-chain bots** for real-time validator health reporting
- **On-chain AVS enforcement layer** for actual punishment logic

---

## 🚀 Why This Project?
> “Restaking is powerful — but slashing needs to evolve too.”

This AVS brings **automated integrity enforcement** into the EigenLayer ecosystem, enabling restakers to hold operators accountable using customizable and pluggable slashing logic.

---

## ⚙️ Architecture

          +---------------------------+
          |   Off-Chain Monitoring    |
          |     (DowntimeBot.js)     |
          +------------+-------------+
                       |
                       v
         +----------------------------+
         |     NodeHealthReporter     |   <-- Authorized Reporter Contract
         +------------+--------------+
                      |
                      v
         +----------------------------+
         |      ValidatorUtils        |   <-- Stores lastSeenBlock & slashed status
         +------------+--------------+
                      |
     +----------------+----------------+
     |                                 |
     v                                 v
+-----------------+         +---------------------+
|   Downtime.sol  |         |  DoubleSign.sol     | <-- Modular AVS rules
+-----------------+         +---------------------+
     |                                 |
     +-------------+  +----------------+
                   v  v
         +----------------------------+
         | SlashingTriggerManager     | <-- Routes to rules & checks EigenLayer delegation
         +----------------------------+
                      |
       +--------------+--------------+
       |                             |
       v                             v
+-------------------+      +----------------------+
| DelegationManager |      | AllocationManager    | <-- EigenLayer Core Integration
+-------------------+      +----------------------+


## Directory Structure

Slashing-Saas-AVS/
│
├── contracts/
│   ├── core/
│   │   └── SlashingTriggerManager.sol       # AVS logic router with Eigen integration
│   ├── rules/
│   │   ├── Downtime.sol                     # Rule: Monitor missed blocks
│   │   └── DoubleSign.sol                   # Rule: Verify ECDSA double signs
│   ├── utils/
│   │   └── ValidatorUtils.sol               # Central storage of operator metadata
│   ├── reporters/
│      └── NodeHealthReporter.sol          # Off-chain reporter contract (updates health)
│
├── bots/
│   ├── DowntimeBot.js                       # Sends lastSeenBlock to NodeHealthReporter
│   ├── DoubleSignBot.js                     # Sends ECDSA proof to SlashingTriggerManager
│   └── TriggerSlashingRouter.js             # Routes all slashing via manager
│
├── script/
│   ├── Deploy.s.sol                         # Foundry deploy script for entire stack
│   └── DeployHealthReporter.s.sol          # Optional dedicated deploy
│
├── frontend/                                # Optional UI for validators health
│   └── index.html, statusTable.js (later)
│
├── test/                                    # Forge-based unit test folder
│   └── SlashingTests.t.sol
│
├── operators.json                           # Dummy or fetched operator data
├── .env                                     # Secrets for bot RPC, PK, contract addresses
├── foundry.toml
└── README.md




---

## 🔐 Core Concepts
- **ValidatorUtils.sol** — Tracks metadata (last seen blocks, slashed status)
- **NodeHealthReporter.sol** — Off-chain bots update lastSeenBlock
- **Downtime.sol / DoubleSign.sol** — Modular slashing rules
- **SlashingTriggerManager.sol** — Routes checks to rule contracts & integrates with EigenLayer
- **DelegationManager.sol / AllocationManager.sol** — Enforces restaker delegation + executes slashing

---

## 🚦 Slashing Rules

| Rule | Trigger Condition | Action |
|------|--------------------|--------|
| **Downtime** | Operator not seen in `X` blocks | Slash if delegated |
| **Double Sign** | Off-chain signature mismatch | Slash via trigger route |

---

## 🤖 Bots

| Bot | Purpose |
|-----|--------|
| **DowntimeBot.js** | Periodically updates `lastSeenBlock` from off-chain |
| **DoubleSignBot.js** | Detects signature conflict and routes slash |
| **TriggerSlashingRouter.js** | Calls `SlashingTriggerManager` to enforce slashing routes |

---

## 📦 Setup & Deployment

```bash
git clone <repo_url>
cd Slashing-SaaS-AVS

# Install dependencies
forge install
npm install dotenv ethers

# Create .env file
RPC_URL=...
PRIVATE_KEY=...
REPORTER_ADDRESS=...
OPERATOR_REGISTRY=...
SLASHING_TRIGGER_MANAGER=...

# Compile
forge build

# Deploy contracts
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --private-key $PRIVATE_KEY
