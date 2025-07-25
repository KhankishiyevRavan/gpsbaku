import axios from "axios";
import api from "../api/axios";

// 🔹 Notification tipi
export interface NotificationType {
  [x: string]: any;
  _id?: string;
  contractId: string;
  subscriberId: string;
  subscriberName?: string;
  servicePackageId: string;
  servicePackageName?: string;
  notificationDate: Date;
  // type?: "inspection" | "custom";
  type?: string;
  status?: "pending" | "done" | "sent";
  message: string;
}

// 🔹 Yeni notifikasiya yaratmaq
export const createNotification = async (data: NotificationType) => {
  return axios
    .post(`${import.meta.env.VITE_API_URL}/notifications`, data)
    .then((res) => res.data);
};

// 🔹 Bütün notifikasiyaları gətir
export const getAllNotifications = async (
  query: string = ""
): Promise<NotificationType[]> => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/notifications?${query}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// 🔹 ID ilə notifikasiya gətir
export const getNotificationById = async (
  id: string
): Promise<NotificationType> => {
  return axios
    .get(`${import.meta.env.VITE_API_URL}/notifications/${id}`)
    .then((res) => res.data);
};

// 🔹 Status yeniləmək (pending → done və s.)
export const updateNotificationStatus = async (
  id: string,
  status: "pending" | "done" | "sent"
): Promise<NotificationType> => {
  return axios
    .put(`${import.meta.env.VITE_API_URL}/notifications/${id}/status`, {
      status,
    })
    .then((res) => res.data);
};

// 🔹 Notifikasiya silmək
export const deleteNotification = async (
  id: string
): Promise<{ message: string }> => {
  return axios
    .delete(`${import.meta.env.VITE_API_URL}/notifications/${id}`)
    .then((res) => res.data);
};
