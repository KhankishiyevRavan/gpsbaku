import axios from "axios";

// Call type-lar üçün interface
export interface CallPayload {
  type: "abuneci" | "qeyriabuneci";
  phoneNumber: string;
  fullName?: string;
  address?: string;
}

// Response üçün interface (optional, sənin backend-inə uyğunlaşdırıla bilər)
export interface CallResponse {
  _id: string;
  type: "abuneci" | "qeyriabuneci";
  phoneNumber: string;
  fullName: string;
  address: string;
  status: string;
  assignedTechnician: string | null;
  createdAt: string;
}

// Call yaratmaq üçün function
export async function createCall(payload: CallPayload): Promise<CallResponse> {
  try {
    const { type, phoneNumber, fullName, address } = payload;

    const body: any = {
      type,
      phoneNumber,
      fullName,
      address,
    };

    const response = await axios.post<CallResponse>(
      `${import.meta.env.VITE_API_URL}/call/create`,
      body
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Call creation error:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Call creation failed" };
  }
}

export async function acceptCall(callId: string, techId: string) {
  const url = `${import.meta.env.VITE_API_URL}/call/accept/${callId}/${techId}`;
  const response = await axios.post(url);
  return response.data;
}

export async function getAllCalls() {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/call/calls`);
  return response.data;
}


export const getCallById = async (callId: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/call/${callId}`);
    return response.data;
  } catch (error) {
    console.error("Get call by ID error:", error);
    throw error;
  }
};