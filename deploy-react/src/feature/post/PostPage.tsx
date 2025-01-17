import {
  ChangeEvent,
  FormEvent,
  HTMLProps,
  ReactNode,
  useContext,
} from "react";
import styles from "./post.module.css";
import Editor from "./Editor";
import { PostContext, PostProvider } from "./context";
import parseAndBuildMenu from "./parse";

export default function Post() {
  return (
    <PostProvider>
      <Post.Form>
        <Post.Section>
          <Post.Title />
          <Post.Editor />
        </Post.Section>
        <Post.Category />
      </Post.Form>
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

Post.Category = () => {
  return <aside className={styles.category}></aside>;
};

Post.Editor = Editor;
