import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import styles from "./base.module.css";

export default function BaseScreen() {
  return (
    <main className={styles.container}>
      <NavigationBar />
      <Outlet />
    </main>
  );
}
