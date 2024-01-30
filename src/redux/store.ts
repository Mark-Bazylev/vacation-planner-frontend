import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authentication/authSlice";
import vacationReducer from "./vacation/vacationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vacations: vacationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
