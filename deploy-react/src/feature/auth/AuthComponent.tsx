import {
  createContext,
  MouseEvent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import styles from "./auth.module.css";
import { BsList } from "react-icons/bs";
import signIn, { providerType, sighOut } from "./auth";
import zustandStore from "../../store/store";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { MdOutlinePostAdd } from "react-icons/md";

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
        <BsList></BsList>
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
  let Icon;
  switch (provider) {
    case "google":
      Icon = <FcGoogle />;
      break;
    case "github":
      Icon = <SiGithub />;
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
      {Icon}
    </div>
  );
}

Auth.Button = AuthButton;

function AuthLogout() {
  return (
    <div className={styles.logBtn} onClick={sighOut}>
      <RiLogoutBoxRLine />
    </div>
  );
}

Auth.Logout = AuthLogout;

function AuthPost() {
  const user = zustandStore((state) => state.user);
  return (
    <>
      {user?.isAdmin && (
        <div className={styles.logBtn}>
          <MdOutlinePostAdd />
        </div>
      )}
    </>
  );
}

Auth.Post = AuthPost;
