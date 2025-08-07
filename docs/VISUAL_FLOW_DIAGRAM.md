# 🔄 MLM React App - Visual Flow Diagrams

## 📊 Complete Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🚀 USER JOURNEY FLOW                               │
└─────────────────────────────────────────────────────────────────────────────────┘

    👤 User Visits App
           │
           ▼
    ┌─────────────┐
    │  main.tsx   │ ◄── 🎯 Entry Point
    │ ┌─────────┐ │     ├── Web3Provider
    │ │Providers│ │     ├── PriceProvider
    │ └─────────┘ │     └── App.tsx
    └─────────────┘
           │
           ▼
    ┌─────────────────────────────────────┐
    │         WALLET CONNECTION           │
    └─────────────────────────────────────┘
           │
           ▼
    🔍 Check localStorage
    ┌─────────────────┬─────────────────┐
    │  Session Exists │  No Session     │
    │                 │                 │
    ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│Auto-Restore │   │Multi-Wallet │   │Choose Wallet│
│   Session   │   │   Display   │   │   Connect   │
└─────────────┘   └─────────────┘   └─────────────┘
    │                 │                 │
    └─────────────────┼─────────────────┘
                      ▼
            ┌─────────────────┐
            │ Network Check   │ ◄── opBNB (204/5611)
            │ Contract Init   │
            └─────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │ Registration    │
            │ Check           │
            └─────────────────┘
                      │
            ┌─────────┼─────────┐
            │                   │
            ▼                   ▼
    ┌─────────────┐     ┌─────────────┐
    │ REGISTERED  │     │NOT REGISTERED│
    │             │     │             │
    │ → Dashboard │     │ → Register  │
    └─────────────┘     └─────────────┘
            │                   │
            │                   ▼
            │           ┌─────────────┐
            │           │Register Form│
            │           │Referral ID  │
            │           │Contract Call│
            │           └─────────────┘
            │                   │
            └─────────────────▼─────────────────
                      │
                      ▼
            ┌─────────────────┐
            │   🏠 DASHBOARD   │
            └─────────────────┘
```

---

## 🏗️ Component Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        🏗️ COMPONENT HIERARCHY                       │
└──────────────────────────────────────────────────────────────────────┘

main.tsx
└── StrictMode
    └── Web3Provider 🔗
        ├── PriceProvider 💰
        └── App 🌐
            └── BrowserRouter
                ├── Route "/"
                │   └── WalletConnectionChecker
                │       └── MultiWallet 🦊
                ├── Route "/session"
                │   └── Session 🔐
                ├── Route "/register"
                │   └── Register 📝
                └── Route "/dashboard/*"
                    └── ProtectedRoute 🛡️
                        └── Layout 🏠
                            ├── Sidebar 📋
                            ├── Header 📊
                            └── Outlet
                                ├── Personal 👤
                                ├── Income 💰
                                ├── LevelStatus 📈
                                └── GenealogyTree 🌳

┌──────────────────────────────────────────────────────────────────────┐
│                         🎣 HOOKS RELATIONSHIP                        │
└──────────────────────────────────────────────────────────────────────┘

useWeb3() ────────────┐
                      │
usePrice() ───────────┼────────► Dashboard Components
                      │
useMLMData() ─────────┘
    │
    └── fetchAllData()
        ├── getPersonalDash()
        ├── getTeamDevDash()
        ├── getLevelDash()
        ├── getIncomeDash()
        └── getGeneome()
```

---

## 🔐 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    🔐 WALLET AUTHENTICATION FLOW                       │
└─────────────────────────────────────────────────────────────────────────┘

🦊 MultiWallet Component
        │
        ▼
┌─────────────────┐
│ EIP-6963        │ ◄── Wallet Discovery Standard
│ requestProvider │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│Available Wallets│ ◄── MetaMask, WalletConnect, etc.
│ Display Grid    │
└─────────────────┘
        │
        ▼ User clicks wallet
┌─────────────────┐
│handleWalletClick│
│setWalletProvider│ ◄── Store wallet provider
└─────────────────┘
        │
        ▼
┌─────────────────┐
│  connectWallet  │ ◄── Request account access
│eth_requestAccounts│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Network Check   │ ◄── Validate opBNB network
│   (204/5611)    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│Contract Instance│ ◄── Initialize with ABI
│   Creation      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Session Storage │ ◄── localStorage persistence
│ account + rdns  │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      🔄 SESSION RESTORATION                             │
└─────────────────────────────────────────────────────────────────────────┘

Page Reload/Revisit
        │
        ▼
┌─────────────────┐
│initializeFrom   │ ◄── Check localStorage
│    Storage      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│waitForWallet    │ ◄── Listen for provider
│   Provider      │     announcements
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Auto-Initialize │ ◄── Seamless reconnection
│     Web3        │
└─────────────────┘
```

---

## ⛓️ Blockchain Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ⛓️ SMART CONTRACT INTEGRATION                        │
└─────────────────────────────────────────────────────────────────────────┘

📋 Contract Setup
├── ABI: newmlm.json
├── Address: 0x6b9c86c809321ba5e4ef4d96f793e45f34828e62
├── Network: opBNB (204/5611)
└── web3.eth.Contract(ABI, address)

🔗 Contract Methods Mapping
┌─────────────────────┬─────────────────────┐
│   Contract Method   │    UI Function      │
├─────────────────────┼─────────────────────┤
│ users(address)      │ getPersonalDash()   │
│ tusers(address)     │ getTeamDevDash()    │
│ LEVEL_PRICE(level)  │ getLevelDash()      │
│ getUserIncomeCount()│ getLevelDash()      │
│ getUserReferrals()  │ getGeneome()        │
│ regUser(referralId) │ registerUser()      │
└─────────────────────┴─────────────────────┘

📊 Data Processing Flow
Contract Data ──► Transform ──► UI Display
     │              │              │
     ▼              ▼              ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│Raw Data │    │Clean &  │    │Formatted│
│Big Nums │ ─► │Convert  │ ─► │UI Data  │
│Unix Time│    │BN.js    │    │Dates    │
└─────────┘    └─────────┘    └─────────┘
```

---

## 📊 Dashboard Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      📊 DASHBOARD DATA LOADING                         │
└─────────────────────────────────────────────────────────────────────────┘

useMLMData() Hook
        │
        ▼
┌─────────────────┐
│  fetchAllData   │ ◄── Triggered on wallet connect
└─────────────────┘
        │
        ▼ Promise.allSettled()
┌─────────────────────────────────────┐
│         Parallel Contract Calls     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ getPersonalDash()               │ │ ◄── User ID, Referrer ID, Join Date
│ │ getTeamDevDash()                │ │ ◄── Direct/Indirect referrals
│ │ getLevelDash()                  │ │ ◄── 9 levels, active/inactive
│ │ getIncomeDash()                 │ │ ◄── All income streams
│ │ getGeneome()                    │ │ ◄── 2-level referral tree
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
        │
        ▼
┌─────────────────┐
│ Data Aggregation│ ◄── Combine all results
│ Error Resilience│     Handle partial failures
└─────────────────┘
        │
        ▼
┌─────────────────┐
│ Component State │ ◄── setData({ personal, team,
│    Update       │              levels, income,
└─────────────────┘              genealogy })

📱 Dashboard Pages Rendering
┌──────────────┬──────────────┬──────────────┬──────────────┐
│   Personal   │    Income    │ Level Status │ Genealogy    │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐ │
│ │User Info │ │ │Earnings  │ │ │9 Levels  │ │ │Ref Tree  │ │
│ │Team Stats│ │ │Breakdown │ │ │Status    │ │ │2 Levels  │ │
│ │Quick     │ │ │BNB + USD │ │ │Income    │ │ │Visual    │ │
│ │Overview  │ │ │Detailed  │ │ │Per Level │ │ │Network   │ │
│ └──────────┘ │ └──────────┘ │ └──────────┘ │ └──────────┘ │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 💰 Price Integration Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     💰 BNB PRICE INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────────┘

PriceProvider Context
        │
        ▼
┌─────────────────┐
│  fetchBNBPrice  │ ◄── Multiple API calls
└─────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│       API Fallback Chain        │
├─────────────────────────────────┤
│ 1. CoinGecko API (Primary)      │ ◄── binancecoin price
│ 2. Binance API (Secondary)      │ ◄── BNBUSDT ticker
│ 3. Fallback Price: $600         │ ◄── If APIs fail
└─────────────────────────────────┘
        │
        ▼
┌─────────────────┐
│ Auto-refresh    │ ◄── Every 5 minutes
│ Price Update    │
└─────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│      BNBValue Components        │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ BNB Amount Display          │ │ ◄── X.XXXXXX BNB
│ │ USD Conversion              │ │ ◄── ≈ $XX.XX
│ │ Configurable Decimals       │ │
│ │ Custom Styling              │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## ⚠️ Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ⚠️ ERROR HANDLING SYSTEM                        │
└─────────────────────────────────────────────────────────────────────────┘

Error Types & Responses
┌─────────────────┬─────────────────┬─────────────────┐
│ Connection      │ Network         │ Contract        │
├─────────────────┼─────────────────┼─────────────────┤
│User Rejects     │Wrong Network    │Method Fails     │
│Code: 4001       │Switch to opBNB  │Try-Catch        │
│                 │                 │                 │
│Processing       │Network Missing  │Partial Data     │
│Code: -32002     │Code: 4902       │allSettled()     │
│                 │                 │                 │
│Generic Fail     │Switch Declined  │Complete Fail    │
│Toast Error      │Force Logout     │Error State      │
└─────────────────┴─────────────────┴─────────────────┘

UI Error States
┌─────────────────────────────────────┐
│            Error Display            │
├─────────────────────────────────────┤
│ Loading → 🔄 Spinner                │
│ Error   → 🔴 Alert + Message        │
│ Empty   → 🟡 Warning + Help Text    │
│ Retry   → 🔄 Refetch Button         │
└─────────────────────────────────────┘
```

---

## 🔄 Complete End-to-End Flow Summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    🔄 COMPLETE APPLICATION FLOW                         │
└─────────────────────────────────────────────────────────────────────────┘

1️⃣ APP INITIALIZATION
   main.tsx → Providers → Router → MultiWallet

2️⃣ WALLET CONNECTION
   EIP-6963 Discovery → User Selection → eth_requestAccounts → Network Check

3️⃣ SESSION MANAGEMENT
   Registration Check → Dashboard Access → Data Loading

4️⃣ DATA DISPLAY
   Contract Calls → Data Transform → UI Rendering → Price Integration

5️⃣ SESSION PERSISTENCE
   localStorage → Auto-restore → Event Listeners → Seamless Experience

┌─────────────────────────────────────────────────────────────────────────┐
│                         📊 DATA FLOW CYCLE                             │
└─────────────────────────────────────────────────────────────────────────┘

User Input → Wallet Connect → Contract Init → Data Fetch → UI Update
     ▲                                                          │
     │                                                          ▼
Session Restore ← localStorage ← State Update ← Data Transform ←─┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        🎯 KEY SUCCESS METRICS                          │
└─────────────────────────────────────────────────────────────────────────┘

✅ Seamless wallet connection & restoration
✅ Real-time blockchain data display
✅ Error-resilient contract interaction
✅ Responsive UI with loading states
✅ Live BNB price integration
✅ Session persistence across visits
✅ MLM hierarchy visualization (9 levels + genealogy)
```

---

## 📱 User Interface Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         📱 UI/UX FLOW DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────────┘

Landing Page
     │
     ▼
┌─────────────┐    No Wallet    ┌─────────────┐
│Multi-Wallet │ ───────────────► │Instructions │
│  Selection  │                  │   & Help    │
└─────────────┘                  └─────────────┘
     │ Wallet Selected
     ▼
┌─────────────┐    Connection    ┌─────────────┐
│   Wallet    │ ───────────────► │   Loading   │
│   Popup     │                  │   Spinner   │
└─────────────┘                  └─────────────┘
     │ User Approves
     ▼
┌─────────────┐    Registration  ┌─────────────┐
│  Session    │ ───────────────► │  Register   │
│   Check     │                  │    Form     │
└─────────────┘                  └─────────────┘
     │ Already Registered             │
     ▼                                ▼
┌─────────────────────────────────────────────┐
│              📊 DASHBOARD                   │
├─────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────┐ │
│ │Personal │ │ Income  │ │ Levels  │ │Tree │ │
│ └─────────┘ └─────────┘ └─────────┘ └─────┘ │
│                                             │
│ Content based on selected page             │
└─────────────────────────────────────────────┘
```

---

✅ **This visual documentation provides clear diagrams showing the complete flow of your MLM React application from user entry to dashboard data display.**
