import { createAppSlice } from "../createAppSlice";
import { jwtDecode } from "jwt-decode";

import {
  authService,
  LoginParams,
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

const initialState: AuthSliceState = {
  token: "",
  user: getUserFromToken(authService.getAuthToken()),
};
function getUserFromToken(token: string | null) {
  if (token) {
    try {
      const tokenData = jwtDecode<{ user: User; iat: number; exp: number }>(
        token,
      );
      if (tokenData.exp * 1000 < Date.now()) {
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
        // settled(state, action) {
        //   console.log("settled");
        // },
        // pending(state) {
        //   console.log("pending");
        // },
        // rejected(state, action) {
        //   console.log("rejected");
        // },
      },
    ),
  }),
});
export const { login } = authSlice.actions;

export default authSlice.reducer;
