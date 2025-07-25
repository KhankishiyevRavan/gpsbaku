import axios from "axios";
import api from "../api/axios";

// Типы для логина
interface LoginCredentials {
  email: string;
  password: string;
  recaptchaToken?: string; // əlavə elə buraya
}

// Типы для регистрации
export interface RegisterData {
  fname: string;
  lname: string;
  email: string;
  password: string;
}

// Ответ от сервера (можно расширить по необходимости)
export interface AuthResponse {
  token: string;
  user: {
    [x: string]: any;
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

// Логин пользователя
export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  localStorage.setItem("token", response.data.token); // tokeni yaddaşa yaz
  return response.data;
};
// Регистрация пользователя
export const registerUser = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/auth/register`,
    userData
  );
  return response.data;
};

// Отправка email для сброса пароля
export const sendResetEmail = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/reset-password`,
      { email }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error sending reset email:",
      error?.response?.data || error?.message || error
    );
    throw new Error(
      error?.response?.data?.message || "Failed to send reset email"
    );
  }
};

// Сброс пароля с использованием токена
export const resetPasswordWithToken = async (
  token: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
      {
        password: newPassword,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error during password reset:",
      error?.response?.data || error?.message || error
    );
    throw new Error(
      error?.response?.data?.message || "Failed to reset password"
    );
  }
};
// // Logout funksiyası – refreshToken cookie-sini silir
// exports.logout = (
//   req: any,
//   res: {
//     clearCookie: (
//       arg0: string,
//       arg1: { httpOnly: boolean; secure: boolean; sameSite: string }
//     ) => void;
//     status: (arg0: number) => {
//       (): any;
//       new (): any;
//       json: { (arg0: { message: string }): any; new (): any };
//     };
//   }
// ) => {
//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     secure: true,
//     sameSite: "Strict",
//   });

//   return res.status(200).json({ message: "Çıxış edildi" });
// };
