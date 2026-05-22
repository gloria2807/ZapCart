# ZapCart

ZapCart is a Lightning-powered merchant POS system designed for small businesses and everyday traders in Nigeria.

It enables instant Bitcoin payments, simple checkout flows, and lightweight business tracking in a way that fits naturally into how informal traders already operate.

Built from a real problem we experienced firsthand through our mother’s local store, ZapCart exists to help traders move away from stressful manual bookkeeping and gain better visibility into their daily business operations.

---

## The Problem

Across many informal markets, small business owners still rely on manual methods to run their operations:

* Paper notebooks for sales tracking
* Mental calculations during checkout
* Disconnected or inconsistent records
* Limited visibility into profit or loss

This often leads to:

* Frequent calculation errors
* Difficulty tracking daily business performance
* Lost or unrecorded transactions
* Stressful end-of-day reconciliation
* Limited financial insight for growth decisions

Most existing tools are either too complex or built for formal accounting systems rather than everyday traders.

ZapCart exists to close that gap.

---

## What ZapCart Does

ZapCart combines:

* Instant Bitcoin Lightning payments
* Simple point-of-sale checkout flows
* Lightweight sales tracking
* Mobile-first merchant experience
* Offline support
* Embedded wallet functionality
* Inventory management

All in one system designed to remain fast, minimal, and easy to use.

---

## Features

### Lightning Payments (Breez SDK)

ZapCart uses Breez SDK to power seamless Lightning transactions.

#### Features

* Instant Bitcoin Lightning checkout
* QR-based payment flow
* Invoice generation and settlement
* Real-time payment confirmations
* Passkey authentication
* Contacts management
* Easy transfer of funds
* Fiat conversion support
* Transaction history tracking
* Non-custodial Lightning infrastructure

---

### Merchant POS System

Designed for speed and simplicity during checkout.

#### Features

* Quick item addition to cart
* Barcode and QR scanning support
* Cart-based checkout flow
* Fast transaction completion
* Optimized for low-friction retail environments

---

### Sales Tracking & Records

Simple tools for tracking business performance.

#### Features

* Daily sales logging
* Lightweight transaction history
* Revenue visibility
* End-of-day sales summaries

---

### Inventory Management

Inventory tracking built for merchants.

#### Features

* Easy stock uploads
* Product inventory management
* Product grid display
* Convenient stock tracking

---

### Mobile-First Design

Built primarily for smartphones and low-tech adoption environments.

#### Features

* Large touch-friendly UI
* Minimal checkout steps
* Light mode for outdoor visibility
* Responsive mobile experience

---

### Secure Wallet Integration

Security built directly into the experience.

#### Features

* Passkey login
* Secure key handling
* Safe Lightning transaction lifecycle management

---

## Tech Stack

| Technology            | Purpose                      |
| --------------------- | ---------------------------- |
| TypeScript            | Type-safe development        |
| React + Vite          | Frontend framework           |
| Tailwind CSS          | Styling                      |
| Breez SDK             | Lightning payments           |
| Zustand               | State management             |
| React Hook Form + Zod | Form handling and validation |
| Node.js               | Backend/API routes           |

---

## Architecture

### Frontend

* TypeScript-based architecture
* Mobile-first UI system
* Component-driven structure
* Optimized checkout experience

### Payments Layer

* Breez SDK integration
* Lightning invoice generation
* Settlement tracking
* Real-time payment updates

### State Management

* Zustand-powered stores
* Persistent-friendly architecture
* Cart and merchant state management

### Backend

* Node.js API routes
* Transaction validation
* Payment session handling
* Sales logging

---

## Structure Overview
<img width="1536" height="1024" alt="ChatGPT Image May 22, 2026, 04_12_20 PM" src="https://github.com/user-attachments/assets/ec8cae68-fa24-4fb3-8021-4fc979612ce8" />

---

## Project Structure

```bash
src/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── AlertCard.tsx
│   ├── BreezLogo.tsx
│   ├── CollapsingWalletHeader.tsx
│   ├── EmbeddedCart.tsx
│   ├── FeeBreakdownCard.tsx
│   ├── Icons.tsx
│   ├── InstallPrompt.tsx
│   ├── LoadingSpinner.tsx
│   ├── OnboardingStepper.tsx
│   ├── PaymentDetailsDialog.tsx
│   ├── PaymentReceivedCelebration.tsx
│   ├── ProductGridModal.tsx
│   ├── QrScannerDialog.tsx
│   ├── Scanner.tsx
│   ├── SideMenu.tsx
│   ├── StagingGate.tsx
│   ├── ToastNotification.tsx
│   └── TransactionList.tsx
├── constants/
│   └── faucet.ts
├── contexts/
│   ├── ContactsContext.tsx
│   ├── ToastContext.tsx
│   └── WalletContext.tsx
├── features/
│   ├── receive/
│   └── send/
├── hooks/
│   ├── buildConnectConfig.ts
│   ├── index.ts
│   ├── useAnimatedNumber.ts
│   ├── useBreezSdk.ts
│   ├── useContacts.ts
│   ├── useIOSViewportFix.ts
│   ├── useLatest.ts
│   ├── usePlatform.ts
│   ├── useQrScanner.ts
│   └── useSecretTap.ts
├── pages/
│   ├── BackupPage.tsx
│   ├── FiatCurrenciesPage.tsx
│   ├── GeneratePage.tsx
│   ├── GetRefundPage.tsx
│   ├── HomePage.tsx
│   ├── InventoryPage.tsx
│   ├── PasskeyPage.tsx
│   ├── POSPage.tsx
│   ├── RestorePage.tsx
│   ├── SalesPage.tsx
│   ├── SettingsPage.tsx
│   ├── UnclaimedDepositDetailsPage.tsx
│   └── WalletPage.tsx
├── services/
│   ├── depositState.ts
│   ├── logExport.ts
│   ├── logger.test.ts
│   ├── logger.ts
│   ├── logStorage.ts
│   ├── passkeyPrfProvider.ts
│   ├── passkeyService.ts
│   └── settings.ts
├── store/
│   ├── useCartStore.ts
│   ├── useProductStore.ts
│   └── useSalesStore.ts
├── test/
│   ├── mocks/
│   ├── utils/
│   ├── payment-scenario.spec.ts
│   └── setup.ts
├── types/
│   └── domain.ts
├── utils/
│   ├── depositHelpers.test.ts
│   ├── depositHelpers.ts
│   ├── formatCurrency.ts
│   ├── formatError.ts
│   ├── formatNumber.ts
│   ├── paymentDescription.ts
│   └── randomName.ts
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

---

## Lightning Payments Flow

ZapCart uses Breez SDK to handle Lightning transactions.

### Flow Overview

1. Merchant creates a checkout session
2. Invoice is generated through Breez SDK
3. Customer scans QR code or pays through wallet/contact
4. Payment is broadcast over the Lightning Network
5. Settlement is confirmed
6. Transaction is recorded automatically

### Benefits

* Instant settlement
* Low transaction fees
* No traditional banking delays
* Real-time confirmations

---

## Installation

### Prerequisites

* Node.js 18+
* npm or pnpm
* Breez SDK access

---

### Setup

```bash
git clone https://github.com/your-org/zapcart.git

cd zapcart

npm install
```

---

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Breez SDK
BREEZ_API_KEY=your_breez_api_key
```

---

### Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Usage

### For Merchants

* Add products to cart
* Generate Lightning invoice
* Customer pays via QR scan or wallet
* Receive instant confirmation
* Transaction automatically saved

---

### For Customers

* Scan checkout QR code
* Pay with Lightning wallet
* Receive instant payment confirmation

---

## Development Scripts

```bash
npm run dev       # Start development server
npm run build     # Build production app
npm run start     # Start production server
npm run lint      # Run lint checks
```

---

## Future Improvements

ZapCart is actively evolving toward:

* Offline-first POS support
* Advanced inventory management
* Merchant analytics dashboard
* Receipt generation
* AI-powered sales insights
* Expanded payment options

---

## Contributing

We welcome contributions from developers, designers, and researchers interested in improving financial tools for small businesses.

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT License

---

## Support

For feedback, collaboration, or questions, feel free to open an issue or discussion in the repository.

---

## ZapCart

Helping small businesses move from manual stress to simple, instant, and reliable commerce.
