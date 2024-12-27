import { Link } from "react-router-dom";
import styles from "./navigation.module.css";
import useLineControll from "./hooks/useLineControll";

export default function NavigationBar() {
  const { initLine, lineControll, lineLeft, lineWidth, parent } =
    useLineControll();
  return (
    <aside className={styles.navbar}>
      <Link to={"/"}>
        <h1>PRACTICE.DEV</h1>
      </Link>
      <div className={styles.menu} ref={parent} onMouseLeave={initLine}>
        <Link to={"/"} onMouseOver={lineControll}>
          Home
        </Link>
        <Link to={"/func"} onMouseOver={lineControll}>
          Function
        </Link>
        <Link to={"/uiux"} onMouseOver={lineControll}>
          Toolkit
        </Link>
        <Link to={"/about"} onMouseOver={lineControll}>
          About
        </Link>
        <div
          className={styles.line}
          style={{ width: `${lineWidth}%`, left: `${lineLeft}px` }}
        />
      </div>
    </aside>
  );
}
