import { createAppSlice } from "../createAppSlice";
import { jwtDecode } from "jwt-decode";

import {
  authService,
  LoginParams,
  CreateAccountParams,
} from "../../services/authService/auth-service";

enum UserRole {
  user = "user",
  admin = "admin",
}
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}
interface AuthSliceState {
  token: string;
  user: User | null;
}

function getUserFromToken(token: string | null) {
  if (token) {
    try {
      const tokenData = jwtDecode<{ user: User; iat: number; exp: number }>(
        token,
      );
      if (tokenData.exp * 1000 > Date.now()) {
        return tokenData.user;
      } else {
        console.log("token is expired");
      }
    } catch (error) {
      console.error("token is invalid");
    }
  }
  return null;
}
const initialState: AuthSliceState = {
  token: "",
  user: getUserFromToken(authService.getAuthToken()),
};
const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: (create) => ({
    login: create.asyncThunk(
      async ({ email, password }: LoginParams, thunkAPI) => {
        return await authService.login({ email, password });
      },
      {
        fulfilled(state, action) {
          state.user = getUserFromToken(action.payload.token);
        },
      },
    ),
    createAccount: create.asyncThunk(
      async ({ firstName, lastName, email, password }: CreateAccountParams) => {
        return await authService.createAccount({
          firstName,
          lastName,
          email,
          password,
        });
      },
      {
        fulfilled(state, action) {
          state.user = getUserFromToken(action.payload.token);
        },
      },
    ),
  }),
});
export const { login, createAccount } = authSlice.actions;

export default authSlice.reducer;
