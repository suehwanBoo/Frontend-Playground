import { Link } from "react-router-dom";
import styles from "./line.module.css";
import useLineControll from "./hooks/useLineControll";
import { forwardRef, MouseEvent, ReactNode } from "react";

export default function LineNav() {
  const { initLine, lineControll, lineState, parent } = useLineControll();

  return (
    <LineNav.Container>
      <LineNav.Title to="/">PRACTICE.DEV</LineNav.Title>
      <LineNav.Menu ref={parent} onMouseLeave={initLine}>
        <LineNav.Item to="/" onMouseOver={lineControll}>
          HOME
        </LineNav.Item>
        <LineNav.Item to="/func" onMouseOver={lineControll}>
          FUNCTION
        </LineNav.Item>
        <LineNav.Item to="/toolkit" onMouseOver={lineControll}>
          TOOLKIT
        </LineNav.Item>
        <LineNav.Item to="/about" onMouseOver={lineControll}>
          ABOUT
        </LineNav.Item>
        <LineNav.Line width={lineState.width} left={lineState.left} />
      </LineNav.Menu>
    </LineNav.Container>
  );
}

LineNav.Container = ({ children }: { children: ReactNode }) => {
  return <nav className={styles.navbar}>{children}</nav>;
};

interface TitleProps {
  to: string;
  children: ReactNode;
}

LineNav.Title = ({ to, children }: TitleProps) => {
  return (
    <Link to={to}>
      <h1>{children}</h1>
    </Link>
  );
};

interface MenuProps {
  children: ReactNode;
  onMouseLeave: () => void;
}

LineNav.Menu = forwardRef<HTMLDivElement, MenuProps>(
  ({ children, onMouseLeave }, ref) => {
    return (
      <div className={styles.menu} ref={ref} onMouseLeave={onMouseLeave}>
        {children}
      </div>
    );
  }
);

interface ItemProps {
  to: string;
  children: ReactNode;
  onMouseOver: (e: MouseEvent<HTMLElement>) => void;
}

LineNav.Item = ({ to, children, onMouseOver }: ItemProps) => {
  return (
    <Link to={to} onMouseOver={onMouseOver}>
      {children}
    </Link>
  );
};

interface LineProps {
  width: number;
  left: number;
}

LineNav.Line = ({ width, left }: LineProps) => {
  return (
    <div
      className={styles.line}
      style={{
        width: `${width}%`,
        left: `${left}px`,
      }}
    />
  );
};
