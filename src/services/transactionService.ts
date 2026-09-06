import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { updateBalance } from './walletService';

export type TransactionType = 'property_purchase' | 'rent' | 'payment' | 'other';

export interface Transaction {
  id?: string;
  userId: string;
  amount: number;
  commission: number;
  net: number;
  type: TransactionType;
  createdAt: any;
}

/**
 * Processes a financial transaction and records it in Firestore.
 * Implements the commission logic:
 * - property_purchase: 5%
 * - rent: 2%
 * - payment: 1%
 * - oher: 3%
 */
export async function processTransaction(userId: string, amount: number, type: TransactionType) {
  let rate = 0.03;
  if (type === "property_purchase") rate = 0.05;
  if (type === "rent") rate = 0.02;
  if (type === "payment") rate = 0.01;

  const commission = amount * rate;
  const net = amount - commission;

  const path = "transactions";
  try {
    const docRef = await addDoc(collection(db, path), {
      userId,
      amount,
      commission,
      net,
      type,
      createdAt: serverTimestamp()
    });
    
    // Update the user's wallet balance
    await updateBalance(userId, net);
    
    return { id: docRef.id, commission, net };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
