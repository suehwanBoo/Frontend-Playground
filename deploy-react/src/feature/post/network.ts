import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

type MethodType = "func" | "toolkit";

type ArticleType = {
  title: string;
  content: string;
  navInfo: string;
  date: Date;
};

export interface PostType {
  methodName: MethodType;
  categoryName: string;
  article: ArticleType;
}

async function addOrUpdateArticle({
  methodName,
  categoryName,
  article,
}: PostType) {
  try {
    const categoryRef = doc(db, methodName, categoryName);
    const categorySnap = await getDoc(categoryRef);
    if (!categorySnap.exists())
      await setDoc(categoryRef, { title: categoryName });
    const articlesRef = collection(
      db,
      `${methodName}/${categoryName}/articles`
    );
    const articleRef = doc(articlesRef, article.title);
    await setDoc(articleRef, article, { merge: true });
  } catch (err) {
    console.log("게시글 저장 또는 업데이트 실패", err);
  }
}

export { addOrUpdateArticle };
