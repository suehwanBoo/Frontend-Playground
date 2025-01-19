import { ReactNode } from "react";
import styles from "./sidebar.module.css";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function SideBar({
  endPoint,
  children,
}: {
  endPoint: string;
  children: ReactNode;
}) {
  return (
    <aside className={styles.sidebar}>
      <Link to={`/${endPoint}`} className={styles.intro}>
        <Icon icon="bx:home" />
        Introduction
      </Link>
      {children}
    </aside>
  );
}
