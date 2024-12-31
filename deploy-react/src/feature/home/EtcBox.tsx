import styles from "./etc.module.css";
import check_icon from "./assets/white-check.svg";

export default function EtcBox({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className={styles.box}>
      <div className={styles.checkLine}>
        <img src={check_icon} alt="check-icon" />
        <div className={styles.line} />
      </div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}
