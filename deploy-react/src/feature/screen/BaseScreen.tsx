import { Outlet } from "react-router-dom";
import LineNav from "../navbar/line/LineNav";
import styles from "./base.module.css";

export default function BaseScreen() {
  return (
    <main className={styles.container}>
      <LineNav />
      <Outlet />
    </main>
  );
}
