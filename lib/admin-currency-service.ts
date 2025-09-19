import { db } from "./firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import type { Currency } from "./types"

export interface CurrencyInput {
  code: string
  name: string
  symbol: string
  decimals: number
  enabled: boolean
  exchangeRate: number
  icon?: string
  description?: string
}

export class AdminCurrencyService {
  private static instance: AdminCurrencyService

  static getInstance(): AdminCurrencyService {
    if (!AdminCurrencyService.instance) {
      AdminCurrencyService.instance = new AdminCurrencyService()
    }
    return AdminCurrencyService.instance
  }

  async getAllCurrencies(): Promise<Currency[]> {
    const q = query(collection(db, "currencies"), orderBy("name"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
        }) as Currency,
    )
  }

  async addCurrency(currencyData: CurrencyInput): Promise<string> {
    const docRef = await addDoc(collection(db, "currencies"), {
      ...currencyData,
      lastUpdated: serverTimestamp(),
      createdAt: serverTimestamp(),
    })
    return docRef.id
  }

  async updateCurrency(currencyId: string, updates: Partial<CurrencyInput>): Promise<void> {
    const currencyRef = doc(db, "currencies", currencyId)
    await updateDoc(currencyRef, {
      ...updates,
      lastUpdated: serverTimestamp(),
    })
  }

  async deleteCurrency(currencyId: string): Promise<void> {
    const currencyRef = doc(db, "currencies", currencyId)
    await deleteDoc(currencyRef)
  }

  async toggleCurrencyStatus(currencyId: string, enabled: boolean): Promise<void> {
    const currencyRef = doc(db, "currencies", currencyId)
    await updateDoc(currencyRef, {
      enabled,
      lastUpdated: serverTimestamp(),
    })
  }

  async updateExchangeRate(currencyId: string, exchangeRate: number): Promise<void> {
    const currencyRef = doc(db, "currencies", currencyId)
    await updateDoc(currencyRef, {
      exchangeRate,
      lastUpdated: serverTimestamp(),
    })
  }

  async bulkUpdateExchangeRates(rates: { currencyId: string; exchangeRate: number }[]): Promise<void> {
    const batch = rates.map(async ({ currencyId, exchangeRate }) => {
      const currencyRef = doc(db, "currencies", currencyId)
      return updateDoc(currencyRef, {
        exchangeRate,
        lastUpdated: serverTimestamp(),
      })
    })

    await Promise.all(batch)
  }
}
