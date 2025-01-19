import {
  ChangeEvent,
  FormEvent,
  HTMLProps,
  ReactNode,
  Suspense,
  useContext,
} from "react";
import styles from "./post.module.css";
import Editor from "./Editor";
import { PostContext, PostProvider } from "./context";
import parseAndBuildMenu from "./parse";
import DropButton from "../dropdown/dropdown";
import { useGetAllCategory } from "./query";
import FullScreen from "../fallback/FullScreen";

export default function Post() {
  return (
    <PostProvider>
      <Suspense fallback={<FullScreen />}>
        <Post.Form>
          <Post.Section>
            <Post.Category />
            <Post.Title />
            <Post.Editor />
          </Post.Section>
        </Post.Form>
      </Suspense>
    </PostProvider>
  );
}

Post.Form = function Form({ children }: { children: ReactNode }) {
  const postState = useContext(PostContext);
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postState) {
      // make article complete
      const editorHtml = postState.Editor?.getHTML() as string;
      const { menu, parsedContent } = parseAndBuildMenu(editorHtml);
      const post = { ...postState.post };
      post.article.content = parsedContent;
      post.article.navInfo = menu;
      post.article.date = new Date();
      // validate

      // send
    }
  };
  return (
    <form className={styles.form} onSubmit={submitHandler}>
      {children}
    </form>
  );
};

Post.Section = ({ children }: { children: ReactNode }) => {
  return <section className={styles.wrapper}>{children}</section>;
};

Post.Title = function Title(props: Omit<HTMLProps<HTMLInputElement>, "type">) {
  const postState = useContext(PostContext);
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    if (postState) {
      const newPost = structuredClone(postState.post);
      newPost.article.title = text;
      postState.setPost(newPost);
    }
  };
  return (
    <input
      type="text"
      name="title"
      placeholder="Title"
      className={styles.title}
      maxLength={40}
      onChange={changeHandler}
      {...props}
    />
  );
};

Post.Category = function Category() {
  const postState = useContext(PostContext);
  const { data } = useGetAllCategory();
  const setMethodType = (value: string) => {
    if (postState && (value === "toolkit" || value === "func")) {
      const newPost = structuredClone(postState.post);
      newPost.methodName = value;
      newPost.categoryName = "-";
      postState.setPost(newPost);
    }
  };
  const setCategoryType = (value: string) => {
    if (postState) {
      const newPost = structuredClone(postState.post);
      newPost.categoryName = value;
      postState.setPost(newPost);
    }
  };
  const method = postState?.post.methodName || "func";
  const categoryArr =
    method === data[0].value.query.id ? data[0].value.docs : data[1].value.docs;
  const category = postState?.post.categoryName || "-";
  return (
    <div className={styles.category}>
      <DropButton value={method} style={{ color: `rgba(24, 160, 251, 0.5)` }}>
        <DropButton.Select value="func" clickHandler={setMethodType} />
        <DropButton.Select value="toolkit" clickHandler={setMethodType} />
      </DropButton>
      <span style={{ color: "rgba(0,0,0,0.3)" }}>/</span>
      <DropButton value={category} style={{ color: `rgba(0, 0, 0, 0.5)` }}>
        {categoryArr.map((category: { id: string }) => (
          <DropButton.Select
            key={category.id}
            value={category.id}
            clickHandler={setCategoryType}
          />
        ))}
        <DropButton.InputSelect clickHandler={setCategoryType} />
      </DropButton>
    </div>
  );
};

Post.Editor = Editor;
