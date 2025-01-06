import { useEffect } from "react";
import zustandStore from "../../store/store";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getIsAdmin } from "./auth";

export default function useAuth() {
  const setUser = zustandStore((state) => state.setUser);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await getIsAdmin(user.uid);
        setUser({
          img: user.photoURL,
          email: user.email,
          uid: user.uid,
          isAdmin,
        });
      } else {
        setUser(null);
      }
    });
  }, [setUser]);
}
