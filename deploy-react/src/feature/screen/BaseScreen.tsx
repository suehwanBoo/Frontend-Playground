import { Outlet } from "react-router-dom";
import LineNav from "../navbar/line/LineNav";
import styles from "./base.module.css";
import Auth from "../auth/AuthComponent";

export default function BaseScreen() {
  return (
    <main className={styles.container}>
      <LineNav />
      <Auth />
      <Outlet />
    </main>
  );
}
