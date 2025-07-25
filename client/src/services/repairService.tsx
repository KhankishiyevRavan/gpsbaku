import axios from "axios";
import api from "../api/axios";
export interface Repair {
  _id?: string;
  contractId?: string;
  repairDate: string;
  repairPrice:string;
  repairTime: string;
  technician: string;
  status: "ugurlu" | "ugursuz";
  partsAdded: boolean;
  notes?: string;
  callId: string;
  technicianFullName?: string;
  customerName?: string;
}

const API = `${import.meta.env.VITE_API_URL}/repairs`;

export const createRepair = async (data: Repair) => {
  // const token = localStorage.getItem("token");
  const res = await axios.post(API, data);
  return res.data;
};

export const getRepairsByContract = async (contractId: string) => {
  const token = localStorage.getItem("token");
  const res = await api.get(`${API}/${contractId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getAllRepairs = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get(
    `${import.meta.env.VITE_API_URL}/repairs/all/list`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
