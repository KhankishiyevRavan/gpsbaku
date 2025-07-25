import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/sale`;

// Ödəniş metodları və statusları üçün type-lar
export type PaymentMethod = "cash" | "online";
export type PaymentStatus = "pending" | "paid";

// Satış interfeysi (DB obyekt)
export interface Sale {
  _id?: string;
  subscriberId: string;
  executorId: string; 
  packages: string[];
  basePrice: number;
  discount: number;
  discountType: "percent" | "amount";
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  finalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}


// 🔹 1. Yeni satış yarat
export const createSale = async (
  saleData: Omit<Sale, "_id" | "finalPrice" | "createdAt" | "updatedAt">
): Promise<Sale> => {
  const response = await axios.post<Sale>(`${API_URL}/create`, saleData);
  return response.data;
};
