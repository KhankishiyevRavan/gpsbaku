import axios from "axios";
import api from "../api/axios";

// Contract-un sahələri (interface)
export interface ContractInterface {
  [x: string]: any;
  _id?: string;
  combiModel?: string;
  contractDuration?: string;
  contractNumber?: string; // server tərəfindən yaradılır, optional
  contractValue?: string;
  endDate?: string;
  initialPayment?: string;
  servicePackage?: string;
  servicePackageName?: string;
  startDate?: string;
  status?: string;
  subscriberId?: string;
  subscriptionType:string;
  // terms?: string;
}

// Yeni müqavilə yaratmaq
export const createContract = async (contractData: ContractInterface) => {
  return axios
    .post(`${import.meta.env.VITE_API_URL}/contracts`, contractData)
    .then((res) => res.data);
};

export const getAllContracts = async (): Promise<ContractInterface[]> => {
  const token = localStorage.getItem("token"); // və ya context, cookie, storage hardadırsa

  return api
    .get(`${import.meta.env.VITE_API_URL}/contracts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
// Müqaviləni id ilə gətirmək
export const getContractById = async (
  id: string
): Promise<ContractInterface> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/contracts/${id}`)
    .then((res) => res.data);
};

// Müqaviləni contractNumber ilə gətirmək (əgər varsa backenddə route)
export const getContractByNumber = async (
  contractNumber: string
): Promise<ContractInterface> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/contracts/number/${contractNumber}`)
    .then((res) => res.data);
};

// Müqaviləni yeniləmək (update)
export const updateContract = async (
  id: string,
  contractData: Partial<ContractInterface>
) => {
  return axios
    .put(`${import.meta.env.VITE_API_URL}/contracts/${id}`, contractData)
    .then((res) => res.data);
};

// Müqaviləni silmək
export const deleteContract = async (id: string) => {
  return axios
    .delete(`${import.meta.env.VITE_API_URL}/contracts/${id}`)
    .then((res) => res.data);
};
export const getContractsBySubscriberId = async (
  subscriberId: string
): Promise<ContractInterface[]> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/contracts/subscriber/${subscriberId}`)
    .then((res) => res.data);
};
