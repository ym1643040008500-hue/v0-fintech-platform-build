import { db } from "./firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import type { Currency } from "./types"

export class CurrencyService {
  private static instance: CurrencyService
  private currencies: Currency[] = []
  private lastFetch: Date | null = null

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService()
    }
    return CurrencyService.instance
  }

  async getCurrencies(forceRefresh = false): Promise<Currency[]> {
    if (
      !forceRefresh &&
      this.currencies.length > 0 &&
      this.lastFetch &&
      Date.now() - this.lastFetch.getTime() < 5 * 60 * 1000
    ) {
      // 5 minutes cache
      return this.currencies
    }

    const q = query(collection(db, "currencies"), where("enabled", "==", true))
    const querySnapshot = await getDocs(q)

    this.currencies = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Currency)
    this.lastFetch = new Date()

    return this.currencies
  }

  async getCurrency(currencyId: string): Promise<Currency | null> {
    const currencies = await this.getCurrencies()
    return currencies.find((c) => c.id === currencyId) || null
  }

  async convertAmount(amount: number, fromCurrencyId: string, toCurrencyId: string): Promise<number> {
    if (fromCurrencyId === toCurrencyId) return amount

    const fromCurrency = await this.getCurrency(fromCurrencyId)
    const toCurrency = await this.getCurrency(toCurrencyId)

    if (!fromCurrency || !toCurrency) {
      throw new Error("Currency not found")
    }

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromCurrency.exchangeRate
    return usdAmount * toCurrency.exchangeRate
  }

  async getExchangeRate(fromCurrencyId: string, toCurrencyId: string): Promise<number> {
    if (fromCurrencyId === toCurrencyId) return 1

    const fromCurrency = await this.getCurrency(fromCurrencyId)
    const toCurrency = await this.getCurrency(toCurrencyId)

    if (!fromCurrency || !toCurrency) {
      throw new Error("Currency not found")
    }

    return toCurrency.exchangeRate / fromCurrency.exchangeRate
  }

  formatAmount(amount: number, currencyId: string): string {
    const currency = this.currencies.find((c) => c.id === currencyId)
    if (!currency) return amount.toString()

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    }).format(amount)
  }
}
