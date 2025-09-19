import { db } from "./firebase"
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore"
import type { Wallet, WalletBalance, Transaction, PaymentRequest } from "./types"

export class WalletService {
  private static instance: WalletService

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService()
    }
    return WalletService.instance
  }

  async createWallet(userId: string): Promise<Wallet> {
    const walletRef = doc(collection(db, "wallets"))
    const wallet: Omit<Wallet, "id"> = {
      userId,
      balances: [],
      totalValueUSD: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await updateDoc(walletRef, {
      ...wallet,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { id: walletRef.id, ...wallet }
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    const q = query(collection(db, "wallets"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as Wallet
  }

  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.getWallet(userId)
    if (!wallet) {
      wallet = await this.createWallet(userId)
    }
    return wallet
  }

  async getBalance(userId: string, currencyId: string): Promise<WalletBalance | null> {
    const wallet = await this.getWallet(userId)
    if (!wallet) return null

    return wallet.balances.find((b) => b.currencyId === currencyId) || null
  }

  async updateBalance(userId: string, currencyId: string, amount: number): Promise<void> {
    const wallet = await this.getOrCreateWallet(userId)
    const walletRef = doc(db, "wallets", wallet.id)

    await runTransaction(db, async (transaction) => {
      const walletDoc = await transaction.get(walletRef)
      if (!walletDoc.exists()) {
        throw new Error("Wallet not found")
      }

      const currentWallet = walletDoc.data() as Wallet
      const balanceIndex = currentWallet.balances.findIndex((b) => b.currencyId === currencyId)

      if (balanceIndex >= 0) {
        currentWallet.balances[balanceIndex].balance += amount
        currentWallet.balances[balanceIndex].availableBalance =
          currentWallet.balances[balanceIndex].balance - currentWallet.balances[balanceIndex].lockedBalance
      } else {
        currentWallet.balances.push({
          currencyId,
          balance: amount,
          lockedBalance: 0,
          availableBalance: amount,
        })
      }

      transaction.update(walletRef, {
        balances: currentWallet.balances,
        updatedAt: serverTimestamp(),
      })
    })
  }

  async createTransaction(
    userId: string,
    transactionData: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Transaction> {
    const transactionRef = doc(collection(db, "transactions"))
    const transaction: Omit<Transaction, "id"> = {
      userId,
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await updateDoc(transactionRef, {
      ...transaction,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return { id: transactionRef.id, ...transaction }
  }

  async getTransactions(userId: string, limitCount = 50): Promise<Transaction[]> {
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Transaction)
  }

  async processPayment(userId: string, paymentRequest: PaymentRequest): Promise<Transaction> {
    // Create pending transaction
    const transaction = await this.createTransaction(userId, {
      type: "deposit",
      status: "pending",
      amount: paymentRequest.amount,
      currencyId: paymentRequest.currencyId,
      fee: 0, // Calculate based on payment method
      description: paymentRequest.description || "Deposit",
      paymentMethod: paymentRequest.paymentMethodId,
      metadata: paymentRequest.metadata,
    })

    // In a real implementation, this would integrate with payment processors
    // For now, we'll simulate processing
    setTimeout(async () => {
      await this.updateTransactionStatus(transaction.id, "completed")
      await this.updateBalance(userId, paymentRequest.currencyId, paymentRequest.amount)
    }, 2000)

    return transaction
  }

  async updateTransactionStatus(transactionId: string, status: Transaction["status"]): Promise<void> {
    const transactionRef = doc(db, "transactions", transactionId)
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    }

    if (status === "completed") {
      updateData.completedAt = serverTimestamp()
    }

    await updateDoc(transactionRef, updateData)
  }

  async transferFunds(
    fromUserId: string,
    toUserId: string,
    amount: number,
    currencyId: string,
    description?: string,
  ): Promise<Transaction[]> {
    const fromWallet = await this.getOrCreateWallet(fromUserId)
    const toWallet = await this.getOrCreateWallet(toUserId)

    // Check balance
    const balance = await this.getBalance(fromUserId, currencyId)
    if (!balance || balance.availableBalance < amount) {
      throw new Error("Insufficient balance")
    }

    // Create withdrawal transaction for sender
    const withdrawalTransaction = await this.createTransaction(fromUserId, {
      type: "transfer",
      status: "completed",
      amount: -amount,
      currencyId,
      fee: 0,
      description: description || `Transfer to user ${toUserId}`,
      toAddress: toUserId,
    })

    // Create deposit transaction for receiver
    const depositTransaction = await this.createTransaction(toUserId, {
      type: "transfer",
      status: "completed",
      amount: amount,
      currencyId,
      fee: 0,
      description: description || `Transfer from user ${fromUserId}`,
      fromAddress: fromUserId,
    })

    // Update balances
    await this.updateBalance(fromUserId, currencyId, -amount)
    await this.updateBalance(toUserId, currencyId, amount)

    return [withdrawalTransaction, depositTransaction]
  }
}
