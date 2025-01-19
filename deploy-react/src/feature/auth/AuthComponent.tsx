import {
  createContext,
  MouseEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
import styles from "./auth.module.css";
import signIn, { providerType, sighOut } from "./auth";
import zustandStore from "../../store/store";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

type clickState = {
  isClick: boolean;
  clickHandler: (e: MouseEvent) => void;
};

const ClickContext = createContext<clickState | null>(null);

export default function Auth() {
  const user = zustandStore((state) => state.user);
  return (
    <Auth.Provider>
      <Auth.ListIcon />
      <Auth.Menu>
        {user ? (
          <>
            <Auth.Post />
            <Auth.Logout />
          </>
        ) : (
          <>
            <Auth.Button provider="google" />
            <Auth.Button provider="github" />
          </>
        )}
      </Auth.Menu>
    </Auth.Provider>
  );
}

function AuthIcon() {
  const user = zustandStore((state) => state.user);
  return (
    <>
      {user ? (
        <img
          src={user.img || "/user.svg"}
          alt="user-img"
          onError={(e) => {
            e.currentTarget.src = "/user.svg";
          }}
        />
      ) : (
        <Icon icon="qlementine-icons:user-16" />
      )}
    </>
  );
}

Auth.ListIcon = AuthIcon;

function AuthProvider({ children }: { children: ReactNode }) {
  const [isClick, setIsClick] = useState(false);
  const clickHandler = (e: MouseEvent) => {
    e.stopPropagation();
    setIsClick(!isClick);
  };
  return (
    <ClickContext.Provider value={{ isClick, clickHandler }}>
      <div
        className={styles.loginBox}
        onClick={() => setIsClick((prev) => !prev)}
      >
        {children}
      </div>
    </ClickContext.Provider>
  );
}

Auth.Provider = AuthProvider;

function AuthMenu({ children }: { children: ReactNode }) {
  const clickState = useContext(ClickContext);
  if (!clickState)
    throw new Error("Please set correct (context value or provider)");
  const { isClick } = clickState;
  return <>{isClick && <div className={styles.menu}>{children}</div>}</>;
}

Auth.Menu = AuthMenu;

function AuthButton({ provider }: { provider: providerType }) {
  const clickState = useContext(ClickContext);
  if (!clickState)
    throw new Error("Please set correct (context value or provider)");
  const { clickHandler } = clickState;
  let icon;
  switch (provider) {
    case "google":
      icon = <Icon icon="flat-color-icons:google" />;
      break;
    case "github":
      icon = <Icon icon="bytesize:github" />;
      break;
  }
  return (
    <div
      className={styles.logBtn}
      onClick={(e) => {
        signIn(provider);
        clickHandler(e);
      }}
    >
      {icon}
    </div>
  );
}

Auth.Button = AuthButton;

function AuthLogout() {
  return (
    <div className={styles.logBtn} onClick={sighOut}>
      <Icon icon="mdi:logout" />
    </div>
  );
}

Auth.Logout = AuthLogout;

function AuthPost() {
  const user = zustandStore((state) => state.user);
  return (
    <>
      {user?.isAdmin && (
        <Link className={styles.logBtn} to={"/post"}>
          <Icon icon="material-symbols:post-add-sharp" />
        </Link>
      )}
    </>
  );
}

Auth.Post = AuthPost;
