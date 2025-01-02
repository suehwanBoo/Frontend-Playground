import { Link } from "react-router-dom";
import styles from "./line.module.css";
import useLineControll from "./hooks/useLineControll";

export default function LineNav() {
  const { initLine, lineControll, lineState, parent } = useLineControll();
  return (
    <nav className={styles.navbar}>
      <Link to={"/"}>
        <h1>PRACTICE.DEV</h1>
      </Link>
      <div className={styles.menu} ref={parent} onMouseLeave={initLine}>
        <Link to={"/"} onMouseOver={lineControll}>
          HOME
        </Link>
        <Link to={"/func"} onMouseOver={lineControll}>
          FUNCTION
        </Link>
        <Link to={"/toolkit"} onMouseOver={lineControll}>
          TOOLKIT
        </Link>
        <Link to={"/about"} onMouseOver={lineControll}>
          ABOUT
        </Link>
        <div
          className={styles.line}
          style={{ width: `${lineState.width}%`, left: `${lineState.left}px` }}
        />
      </div>
    </nav>
  );
}
