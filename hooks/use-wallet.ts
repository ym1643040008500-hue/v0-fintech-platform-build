"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useWallet(walletId: string) {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "wallets", walletId), (docSnap) => {
      setBalance(docSnap.data()?.balance || 0);
    });

    return () => unsub();
  }, [walletId]);

  return { balance };
}
