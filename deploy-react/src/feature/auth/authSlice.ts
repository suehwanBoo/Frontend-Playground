import { StateCreator } from "zustand";

type userType = {
  img: string | null;
  email: string | null;
  uid: string;
  isAdmin: boolean;
} | null;

export type AuthState = {
  user: userType;
  setUser: (user: userType) => void;
};

export const authSlice: StateCreator<AuthState> = (set) => ({
  user: null,
  setUser: (payload) => set(() => ({ user: payload })),
});
