import api from "../api/axios";

const API = `${import.meta.env.VITE_API_URL}/payments`;
export interface PaymentInterface {
  _id: string;
  contractId: string;
  months: string[]; // ["2025-07", "2025-08"]
  amount: number;
  contractNumber: number;
  method: "cash" | "online" | "card" | "balance"; // dəqiq dəyərləri schema-nıza əsasən genişləndir
  receivedBy: string; // Admin userId (əgər varsa)
  receivedByName: string; // Admin userId (əgər varsa)
  status: "paid" | "unpaid";
  paymentType: "monthly" | "annual" | "balanceTopUp";
  createdAt: string;
  updatedAt: string;
}

export const markMonthAsPaid = async (
  contractId: string,
  month: string,
  amount?: any,
  method?: string
) => {
  const token = localStorage.getItem("token"); // və ya sessionStorage

  const res = await api.post(
    `${API}/pay-month`,
    { contractId, month, amount, method },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const getAllPayments = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get(`${API}/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export interface PaymentDetails {
  paymentId: string;
  amount: number;
  method: string;
  type: string;
  months: string[];
  createdAt: string;
  contractNumber: string;
  subscriber: {
    id: string;
    fname: string;
    lname: string;
    packageName: string;
  };
  receivedBy: {
    id: string;
    fname: string;
    lname: string;
  };
}

export const getPaymentById = async (id: string): Promise<PaymentDetails> => {
  const token = localStorage.getItem("token");

  const response = await api.get(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const addBalancePayment = async (
  userId: string,
  amount: number,
  method: string = "cash"
) => {
  const token = localStorage.getItem("token");
  const res = await api.post(
    `${API}/balance-topup`,
    { userId, amount, method },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
