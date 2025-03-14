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

+------------------------+ +----------------------+ | Off-chain Bot (JS) | ---> | NodeHealthReporter | +------------------------+ +----------------------+ | v +------------------------+ | ValidatorUtils (Utils) | +------------------------+ | +------------+-------------+ | Downtime.sol | DoubleSign.sol | +-----------------------------+ | v +----------------------------+ | SlashingTriggerManager | +----------------------------+ | DelegationManager | AllocationManager (EigenLayer)

## Directory Structure


Slashing-SaaS-AVS/ │ ├── contracts/ │ ├── utils/ │ │ └── ValidatorUtils.sol │ ├── rules/ │ │ ├── Downtime.sol │ │ └── DoubleSign.sol │ ├── core/ │ │ └── SlashingTriggerManager.sol │ ├── integrations/ │ │ └── IDelegationManager.sol, IAllocationManager.sol, etc. │ ├── bots/ │ ├── DowntimeBot.js │ ├── DoubleSignBot.js │ └── TriggerSlashingRouter.js │ ├── script/ │ ├── Deploy.s.sol │ └── DeployHealthReporter.s.sol │ ├── frontend/ (optional UI dashboard) │ └── Show slashed / healthy operators │ ├── operators.json ├── .env └── README.md



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
