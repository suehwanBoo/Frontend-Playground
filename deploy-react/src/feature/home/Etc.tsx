import styles from "./etc.module.css";
import EtcBox from "./EtcBox";

export default function Etc() {
  return (
    <aside className={styles.container}>
      <EtcBox
        title="React.JS"
        content="React allows developers to build encapsulated components that manage their own state, making the code reusable, maintainable, and easier to debug."
      />
      <EtcBox
        title="TypeScript"
        content="TypeScript provides static typing, which helps catch errors during development rather than at runtime, making the codebase more reliable."
      />
      <EtcBox
        title="HTML5 / CSS3"
        content="HTML and CSS are the core technologies for building the structure and styling of web pages, making them indispensable for web development."
      />
    </aside>
  );
}
