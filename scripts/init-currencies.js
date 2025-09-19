// Script to initialize default currencies in Firebase
// Run this script to add default currencies to your Firebase database

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const defaultCurrencies = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimals: 2,
    enabled: true,
    exchangeRate: 1.0,
    description: "United States Dollar - Base currency",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    decimals: 2,
    enabled: true,
    exchangeRate: 0.85,
    description: "European Union Euro",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    decimals: 2,
    enabled: true,
    exchangeRate: 0.73,
    description: "British Pound Sterling",
  },
  {
    code: "EGP",
    name: "Egyptian Pound",
    symbol: "ج.م",
    decimals: 2,
    enabled: true,
    exchangeRate: 30.85,
    description: "Egyptian Pound",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "ر.س",
    decimals: 2,
    enabled: true,
    exchangeRate: 3.75,
    description: "Saudi Arabian Riyal",
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
    decimals: 2,
    enabled: true,
    exchangeRate: 3.67,
    description: "United Arab Emirates Dirham",
  },
  {
    code: "BTC",
    name: "Bitcoin",
    symbol: "₿",
    decimals: 8,
    enabled: true,
    exchangeRate: 0.000023,
    description: "Bitcoin - Digital Currency",
  },
  {
    code: "ETH",
    name: "Ethereum",
    symbol: "Ξ",
    decimals: 6,
    enabled: true,
    exchangeRate: 0.00041,
    description: "Ethereum - Digital Currency",
  },
  {
    code: "USDT",
    name: "Tether",
    symbol: "₮",
    decimals: 2,
    enabled: true,
    exchangeRate: 1.0,
    description: "Tether - Stablecoin",
  },
  {
    code: "BNB",
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 4,
    enabled: true,
    exchangeRate: 0.0017,
    description: "Binance Coin - Exchange Token",
  },
]

async function initializeCurrencies() {
  console.log("🚀 Initializing default currencies...")

  try {
    for (const currency of defaultCurrencies) {
      const docRef = await addDoc(collection(db, "currencies"), {
        ...currency,
        lastUpdated: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
      console.log(`✅ Added ${currency.name} (${currency.code}) with ID: ${docRef.id}`)
    }

    console.log("🎉 All currencies initialized successfully!")
    console.log(`📊 Total currencies added: ${defaultCurrencies.length}`)
  } catch (error) {
    console.error("❌ Error initializing currencies:", error)
  }
}

// Run the initialization
initializeCurrencies()
