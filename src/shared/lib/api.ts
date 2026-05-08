import axios, { AxiosError } from "axios";
import { pushToast } from "./toastsStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;
    if (status >= 500) {
      pushToast({
        kind: "error",
        title: "Помилка сервера",
        description:
          error.response?.data?.message ??
          error.message ??
          `Запит завершився зі статусом ${status}`,
      });
    } else if (!error.response && error.code !== "ERR_CANCELED") {
      pushToast({
        kind: "error",
        title: "Мережева помилка",
        description: error.message,
      });
    }
    return Promise.reject(error);
  },
);
