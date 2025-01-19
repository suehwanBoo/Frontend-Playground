import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  useState,
} from "react";
import styles from "./drop.module.css";
import { IoIosAddCircleOutline } from "react-icons/io";

export default function DropButton({
  value,
  children,
  ...rest
}: {
  value: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const [isClicked, setIsClicked] = useState(false);
  const open = () => {
    setIsClicked(true);
  };
  return (
    <>
      <button
        {...rest}
        onClick={open}
        onBlur={() => setIsClicked(false)}
        className={styles.dropBtn}
        aria-controls="dropdown-menu"
        aria-expanded={isClicked}
      >
        <span>{value}</span>
        {isClicked && (
          <div className={styles.selectLayout} id="dropdown-menu" role="menu">
            {children}
          </div>
        )}
      </button>
    </>
  );
}

interface SelectProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  clickHandler: (value: string) => void;
}

DropButton.Select = function Select({
  value,
  clickHandler,
  ...rest
}: SelectProps) {
  const click = () => {
    clickHandler(value);
  };
  return (
    <div {...rest} onClick={click}>
      {value}
    </div>
  );
};

DropButton.InputSelect = function InputSelect({
  clickHandler,
  ...rest
}: Omit<SelectProps, "value">) {
  const click = () => {
    const res = window.prompt("input brand new category");
    if (res) clickHandler(res);
  };
  return (
    <div {...rest} onClick={click}>
      <IoIosAddCircleOutline /> Add
    </div>
  );
};
