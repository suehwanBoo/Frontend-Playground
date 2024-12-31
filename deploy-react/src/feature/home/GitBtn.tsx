import directIcon from "./assets/direct.svg";
import styles from "./gitbtn.module.css";

export default function GitBtn({ gitLink }: { gitLink: string }) {
  return (
    <div className={styles.gitBtn}>
      <p>Application Repository</p>
      <a href={gitLink}>
        <span>Go</span>
        <img src={directIcon} alt="white-direct-icon" />
      </a>
    </div>
  );
}
