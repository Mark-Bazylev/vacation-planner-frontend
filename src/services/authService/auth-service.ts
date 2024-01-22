import { httpService } from "../http-service";
import { jwtDecode } from "jwt-decode/build/esm";

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  firstName: string;
  lastName: string;
}
export const AUTH_TOKEN_KEY = "authToken";

class AuthService {
  constructor() {
    httpService.setAuthToken(this.getAuthToken());
  }

  getAuthToken() {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  }

  setAuthToken(token: string | null) {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    httpService.setAuthToken(token);
  }

  async login(data: LoginParams) {
    const res = await httpService.post<{ token: string }>("auth/login", data);
    this.setAuthToken(res.data.token);
    return res.data;
  }

  async register(data: RegisterParams) {
    const res = await httpService.post<{ token: string }>(
      "auth/register",
      data,
    );
    this.setAuthToken(res.data.token);
    return res.data;
  }
}

export const authService = new AuthService();
