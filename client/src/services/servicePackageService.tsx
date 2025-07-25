import axios from "axios";
import api from "../api/axios";

// Paket sahələri üçün interfeys
export interface ServicePackageInterface {
  // id(id: any): unknown;
  // price: number;
  _id?: string;
  name: string;
  description?: string;
  identityNumber: string;
  // validity: string;
  status?: string;
  manualPrice: string;
  discount?: string;
  technicalInspection: string;
  // selectedServices: string[];
  // autoprice: number;
  totalPrice: number;
}

// Token başlığı
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Yeni service package yarat
export const createServicePackage = async (data: ServicePackageInterface) => {
  return api
    .post(
      `${import.meta.env.VITE_API_URL}/servicepackage`,
      data,
      getAuthHeader()
    )
    .then((res) => res.data);
};

// Bütün paketləri gətir
export const getAllServicePackages = async (): Promise<
  ServicePackageInterface[]
> => {
  return api
    .get(`${import.meta.env.VITE_API_URL}/servicepackage`, getAuthHeader())
    .then((res) => res.data);
};

// Paketi ID ilə gətir
export const getServicePackageById = async (
  id: string
): Promise<ServicePackageInterface> => {
  return api
    .get(
      `${import.meta.env.VITE_API_URL}/servicepackage/${id}`,
      getAuthHeader()
    )
    .then((res) => res.data);
};

// Paketi yenilə
export const updateServicePackage = async (
  id: string,
  data: Partial<ServicePackageInterface>
) => {
  return api
    .put(
      `${import.meta.env.VITE_API_URL}/servicepackage/${id}`,
      data,
      getAuthHeader()
    )
    .then((res) => res.data);
};

// Paketi sil
export const deleteServicePackage = async (id: string) => {
  return api
    .delete(
      `${import.meta.env.VITE_API_URL}/servicepackage/${id}`,
      getAuthHeader()
    )
    .then((res) => res.data);
};
