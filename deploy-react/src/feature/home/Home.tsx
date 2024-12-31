import styles from "./home.module.css";
import TitleBox from "./TitleBox";
import Illustration from "./assets/home_illust.svg";
import Etc from "./Etc";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.homeBox}>
        <header>
          <TitleBox />
        </header>
        <img src={Illustration} alt="home-illust" className={styles.illust} />
      </main>
      <Etc />
    </div>
  );
}
