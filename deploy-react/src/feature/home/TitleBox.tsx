import GitBtn from "./GitBtn";
import styles from "./home.module.css";

export default function TitleBox() {
  return (
    <>
      <h1>Welcome to</h1>
      <h1>My Frontend</h1>
      <h1>Playground !</h1>
      <GitBtn gitLink="https://github.com/suehwanBoo" />
      <div className={styles.description}>
        <h3>
          This is where I showcase the power of React and TypeScript by building
        </h3>
        <h3>
          reusable components. Explore my journey as a frontend developer!
        </h3>
      </div>
    </>
  );
}
