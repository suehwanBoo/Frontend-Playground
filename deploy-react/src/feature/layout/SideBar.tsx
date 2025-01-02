import { ReactNode } from "react";
import styles from "./sidebar.module.css";
import { BiHomeAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

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
        <BiHomeAlt />
        Introduction
      </Link>
      {children}
    </aside>
  );
}
