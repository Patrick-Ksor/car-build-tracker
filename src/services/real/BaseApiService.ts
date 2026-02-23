import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

export abstract class BaseApiService {
  protected readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_API_URL as string,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Decouple from the store — dispatch a DOM event the auth store listens to
          window.dispatchEvent(new CustomEvent("auth:expired"));
        }
        return Promise.reject(
          error instanceof Error ? error : new Error(String(error)),
        );
      },
    );
  }

  protected async get<T>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.http.get<{ data: T }>(path, config);
    return response.data.data;
  }

  protected async post<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.http.post<{ data: T }>(path, body, config);
    return response.data.data;
  }

  protected async put<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.http.put<{ data: T }>(path, body, config);
    return response.data.data;
  }

  protected async patch<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.http.patch<{ data: T }>(path, body, config);
    return response.data.data;
  }

  protected async delete<T = void>(
    path: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response = await this.http.delete<{ data: T }>(path, config);
    return response.data.data;
  }
}
