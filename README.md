
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

```
      +---------------------------+
      |   Off-Chain Monitoring    |
      |     (DowntimeBot.js)     |
      +------------+-------------+
                   |
                   v
     +----------------------------+
     |     NodeHealthReporter     |  <-- Authorized Reporter Contract
     +------------+--------------+
                  |
                  v
     +----------------------------+
     |      ValidatorUtils        |  <-- Stores lastSeenBlock & slashed status
     +------------+--------------+
                  |
     +------------+-------------+
     |                          |
     v                          v
+-----------------+    +---------------------+
|   Downtime.sol   |    |   DoubleSign.sol    |  <-- Modular AVS rules
+------------------+   +----------------------+
         |                         |
         +-----------+------------+
                     v
     +----------------------------+
     |   SlashingTriggerManager   |  <-- Routes rules & checks delegation
     +----------------------------+
                  |
     +------------+-------------+
     |                          |
     v                          v
+-------------------+   +----------------------+
| DelegationManager  |   | AllocationManager    |  <-- EigenLayer Core Integration
+--------------------+   +----------------------+
```

---

## 📁 Directory Structure

```
Slashing-Saas-AVS/
│
├── contracts/
│   ├── core/
│   │   └── SlashingTriggerManager.sol      # AVS logic router with Eigen integration
│   ├── rules/
│   │   ├── Downtime.sol                    # Rule: Monitor missed blocks
│   │   └── DoubleSign.sol                  # Rule: Verify ECDSA double signs
│   ├── utils/
│   │   └── ValidatorUtils.sol              # Central storage of operator metadata
│   ├── reporters/
│   │   └── NodeHealthReporter.sol          # Off-chain reporter contract (updates health)
│   └── integrations/
│       ├── IDelegationManager.sol
│       ├── IAllocationManager.sol
│       └── (Other core EigenLayer interfaces)
│
├── bots/
│   ├── DowntimeBot.js                      # Sends lastSeenBlock to NodeHealthReporter
│   ├── DoubleSignBot.js                    # Sends ECDSA proof to SlashingTriggerManager
│   └── TriggerSlashingRouter.js            # Routes all slashing via manager
│
├── script/
│   ├── Deploy.s.sol                        # Foundry deploy script for entire stack
│   └── DeployHealthReporter.s.sol         # Optional dedicated deploy
│
├── frontend/
│   └── index.html                          # Optional UI for validator status
│   └── statusTable.js                      # JS script to render validator state
│
├── test/
│   └── SlashingTests.t.sol                 # Unit tests (optional)
│
├── operators.json                          # Dummy or fetched operator data
├── .env                                    # Secrets for RPC, PK, contract addresses
├── foundry.toml
└── README.md
```

---

## 🔐 Core Components

| Component | Description |
|----------|-------------|
| ValidatorUtils.sol | Tracks validator metadata and slashing status |
| NodeHealthReporter.sol | Off-chain authorized reporter updates health |
| Downtime.sol | Slashing logic for missed blocks |
| DoubleSign.sol | Slashing logic for ECDSA double-sign detection |
| SlashingTriggerManager.sol | Centralized router contract for rule execution |
| DelegationManager / AllocationManager | Core EigenLayer staking logic integration |

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
cd Slashing-Saas-AVS

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
```

---

## 📈 Future Scope

- Add **LatencySlashing.sol**
- Integration with **EigenDA**
- Real validator telemetry integration
- Complete monitoring dashboard UI

---

## 🙌 Credits

Inspired by EigenLayer AVS architecture and decentralized validation principles.

---

## 📄 License

MIT License
