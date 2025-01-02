import { ReactNode } from "react";
import styles from "./doc.module.css";

export default function DocLayout({ children }: { children: ReactNode }) {
  return <div className={styles.wrapper}>{children}</div>;
}
