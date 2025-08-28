// wialonApi.ts (və ya hansı fayldadırsa)
import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";

export const wialonApi = axios.create({
  baseURL: `${import.meta.env.VITE_WIALON_BASE_URL}/wialon`,
  withCredentials: false,
});

const LS_SID = "wialon_sid";
const getSid = () =>
  localStorage.getItem(LS_SID) ||
  (import.meta.env.VITE_WIALON_SESSION_ID as string) ||
  null;

// REQUEST interceptor — DƏYİŞ
wialonApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // headers hər zaman obyekt olsun
  if (!config.headers) config.headers = new AxiosHeaders();

  // query params
  const qp: Record<string, any> = { ...(config.params || {}) };

  // Wialon-un "params" obyektlidirsə, stringify et
  if (qp.params && typeof qp.params === "object") {
    qp.params = JSON.stringify(qp.params);
  }

  // SID əlavə et
  const sid = getSid();
  if (sid && !qp.sid) qp.sid = sid;

  config.params = qp;

  // Wialon-a Authorization getməsin
  // Axios v1-də headers AxiosHeaders ola bilər — delete istifadə et
  try {
    // @ts-ignore: AxiosHeaders delete mövcuddur
    config.headers.delete?.("Authorization");
    // fallback
    // @ts-ignore
    delete (config.headers as any).Authorization;
  } catch {
    // ignore
  }

  return config; // 👈 InternalAxiosRequestConfig qaytarırıq
});

// RESPONSE interceptor — (tip düzəlt)
wialonApi.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _wRetry?: boolean;
    };
    const code = (error.response?.data as any)?.error;

    const shouldRetry =
      !original?._wRetry &&
      String(original?.url || "").includes("/ajax.html") &&
      (code === 4 || code === 5 || error?.response?.status === 401);

    if (shouldRetry) {
      original._wRetry = true;
      // … burada lazımsa token/login edib SID-i yenilə (qısaltdım)
      // const newSid = await loginWithToken();
      // if (newSid) {
      //   original.params = { ...(original.params || {}), sid: newSid };
      //   return wialonApi(original);
      // }
    }

    return Promise.reject(error);
  }
);
