import { Link } from "react-router-dom";
import LineNav from "../navbar/line/LineNav";
import styles from "./error.module.css";

export default function ErrorPage() {
  return (
    <>
      <LineNav />
      <div className={styles.container}>
        <h1>404 Page Not Found</h1>
        <Link to={"/"} className={styles.btn}>
          Go Home
        </Link>
      </div>
    </>
  );
}
