import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
}

const COLLECTION_PATH = "wallets";

/**
 * Initializes a wallet for a user if it doesn't exist.
 */
export async function initializeWallet(userId: string) {
  const walletRef = doc(db, COLLECTION_PATH, userId);
  try {
    const snap = await getDoc(walletRef);
    if (!snap.exists()) {
      await setDoc(walletRef, {
        userId,
        balance: 0,
        currency: "USD"
      });
    }
  } catch (error: any) {
    const isOffline = error?.message?.includes('offline') || error?.code === 'unavailable';
    if (isOffline) {
      console.warn(`Wallet initialization: client is offline for ${userId}. Skipping remote sync and using offline defaults.`);
    } else {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_PATH}/${userId}`);
    }
  }
}

/**
 * Listens to wallet updates for a user.
 */
export function subscribeToWallet(userId: string, callback: (wallet: Wallet) => void) {
  const walletRef = doc(db, COLLECTION_PATH, userId);
  return onSnapshot(walletRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as Wallet);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, `${COLLECTION_PATH}/${userId}`);
  });
}

/**
 * Adds funds to a user's wallet via server-side API for security.
 */
export async function updateBalance(userId: string, amount: number) {
  try {
    const response = await fetch('/api/wallet/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, amount })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to update balance');
    }

    return await response.json();
  } catch (error) {
    console.error("Wallet Update Error:", error);
    throw error;
  }
}
