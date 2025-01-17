import { redirect } from "react-router-dom";
import zustandStore from "../store/store";

export function protectRouter() {
  const isAdmin = zustandStore.getState().user?.isAdmin;
  if (!isAdmin) return redirect("/");
  return null;
}
