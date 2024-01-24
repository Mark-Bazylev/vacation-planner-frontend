import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";
import { enqueueSnackbar } from "notistack";

class HttpService {
  private service: AxiosInstance;

  constructor() {
    this.service = axios.create({
      baseURL: process.env.REACT_APP_BASE_URL,
    });
    this.service.interceptors.response.use(undefined, this.errorInterceptor);
  }
  errorInterceptor(error: any) {
    const errorMessage = error.response.data.message;
    console.error(`Interceptor error `, errorMessage);
    enqueueSnackbar(errorMessage, {
      variant: "error",
      autoHideDuration: 6000,
      anchorOrigin: { horizontal: "center", vertical: "bottom" },
    });
  }

  setAuthToken(token: string | null) {
    const common = this.service.defaults.headers.common;
    common.Authorization = token ? `Bearer ${token}` : "";
  }

  get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig) {
    return this.service.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.service.post<T, R, D>(url, data, config);
  }
  put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.service.put<T, R, D>(url, data, config);
  }
  patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.service.patch<T, R, D>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.service.delete<T, R, D>(url, config);
  }
}

export const httpService = new HttpService();
