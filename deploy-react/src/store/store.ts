import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authSlice, AuthState } from "../feature/auth/authSlice";

export type StoreState = AuthState;

const zustandStore = create<StoreState>()(
  devtools((...rest) => ({
    ...authSlice(...rest),
  }))
);

zustandStore.getState().setUser();

export default zustandStore;
