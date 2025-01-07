import { onAuthStateChanged } from "firebase/auth";
import { StateCreator } from "zustand";
import { auth } from "../../firebaseConfig";
import { getIsAdmin } from "./auth";

type userType = {
  img: string | null;
  email: string | null;
  uid: string;
  isAdmin: boolean;
} | null;

export type AuthState = {
  user: userType;
  setUser: () => void;
};

export const authSlice: StateCreator<AuthState> = (set) => ({
  user: null,
  setUser: () => {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const isAdmin = await getIsAdmin(user.uid);
          set({
            user: {
              img: user.photoURL,
              email: user.email,
              uid: user.uid,
              isAdmin,
            },
          });
        } else set({ user: null });
      } catch {
        throw new Error("network error occured");
      }
    });
  },
});
