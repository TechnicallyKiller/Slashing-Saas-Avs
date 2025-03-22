
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
│   │   └── SlashingTriggerManager.sol          # Central AVS logic & slashing router
│   ├── rules/
│   │   ├── Downtime.sol                        # Downtime-based slashing rule
│   │   └── DoubleSigning.sol                   # Double-signature detection rule
│   ├── reporters/
│   │   └── NodeHealthReporter.sol              # Reports last seen block to utils
│   ├── utils/
│   │   └── ValidatorUtils.sol                  # Tracks last seen block, slashed status
│   └── OperatorRegistry.sol                    # Registers operators + links metadataURI
│
├── interfaces/                                 # Core EigenLayer contract interfaces
│   ├── IDelegationManager.sol
│   ├── IAllocationManager.sol
│   ├── IStrategyManager.sol
│   ├── IStrategy.sol
│   └── IPermissionController.sol
│
├── bots/                                       # Off-chain JS Bots
│   ├── Downtime.js                             # Pings health + reports downtime
│   ├── DoubleSign.js                           # Simulates conflicting signature slashing
│   ├── TriggerSlashingRouter.js                # Routes slashing to SlashingTriggerManager
│   └── RegisterDummyOperators.js               # Registers dummy operators
│
├── script/                                     # Foundry Deploy Scripts
│   ├── Deploy.s.sol                            # Full stack deploy: contracts + utils
│   ├── DeployHealthReporter.s.sol              # Dedicated script for NodeHealthReporter
│   └── DeployOperatorReg.s.sol                 # Deploy OperatorRegistry (Eigen-ready)
│
├── frontend/                                   # React UI (TailwindCSS + Ethers.js)
│   ├── public/
│   │   └── operators.json                      # Operator status, updated by bots
│   ├── pages/
│   │   └── Register.jsx                        # Operator registration via frontend
│   │   └── Dashboard.jsx                       # Operator Status Dashboard UI
│   ├── components/
│   │   └── OperatorTable.js                    # Status table showing health, slash, etc.
│   ├── App.jsx                                 # Root component
│   ├── index.html                              # HTML entry point
│   └── tailwind.config.js                      # TailwindCSS configuration
│
├── test/
│   ├── SlashingLogic.t.sol                     # Forge tests for slashing flows
│   └── OperatorRegistry.t.sol                  # Operator registry logic tests
│
├── .env                                        # Environment variables (RPC, PKs, Contract Addrs)
├── foundry.toml                                # Foundry project config
└── README.md                                   # 📘 Full project documentation

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
