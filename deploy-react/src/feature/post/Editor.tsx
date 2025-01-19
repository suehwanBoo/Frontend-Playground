import { EditorContent } from "@tiptap/react";
import styles from "./editor.module.css";
import {
  ButtonHTMLAttributes,
  FormEvent,
  ReactNode,
  useContext,
  useRef,
} from "react";

import { PostContext } from "./context";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function PostEditor() {
  const post = useContext(PostContext);
  if (post)
    return (
      <>
        <PostEditor.Menus>
          <PostEditor.TextFormat />
          <PostEditor.Division />
          <PostEditor.ContentStructure />
          <PostEditor.Division />
          <PostEditor.TextStyle />
          <PostEditor.Division />
          <PostEditor.Heading />
          <PostEditor.Division />
          <PostEditor.CodeBlock />
          <PostEditor.LinkLine />
        </PostEditor.Menus>
        <EditorContent
          editor={post.Editor}
          className={styles.editor}
        ></EditorContent>
      </>
    );
}

PostEditor.Menus = ({ children }: { children: ReactNode }) => {
  return <div className={styles.menus}>{children}</div>;
};

type MenuProps = { children: ReactNode } & Partial<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

PostEditor.TextFormat = function TextFormat() {
  const post = useContext(PostContext);
  const editor = post?.Editor;
  const setUnderLine = () => editor?.chain().focus().toggleUnderline().run();
  const setBold = () => editor?.chain().focus().toggleBold().run();
  const setStrike = () => editor?.chain().focus().toggleStrike().run();
  const setItalic = () => editor?.chain().focus().toggleItalic().run();
  const setHighlight = () => editor?.chain().focus().toggleHighlight().run();
  return (
    <>
      <PostEditor.Menu onClick={setUnderLine}>
        <Icon icon="tabler:text-color" />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setBold}>
        <Icon icon="tabler:bold" />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setStrike}>
        <Icon icon="gg:format-strike" />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setHighlight}>
        <Icon icon="ph:highlighter-fill" />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setItalic}>
        <Icon icon="uil:italic" />
      </PostEditor.Menu>
    </>
  );
};

PostEditor.ContentStructure = function ContentStructure() {
  const post = useContext(PostContext);
  const editor = post?.Editor;
  const setBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const setBulletList = () => editor?.chain().focus().toggleBulletList().run();
  return (
    <>
      <PostEditor.Menu onClick={setBlockquote}>
        <Icon icon="octicon:quote-24" />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setBulletList}>
        <Icon icon="ic:round-list" />
      </PostEditor.Menu>
    </>
  );
};

PostEditor.TextStyle = function TextStyle() {
  const post = useContext(PostContext);
  const editor = post?.Editor;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setColor = (event: FormEvent<HTMLInputElement>) => {
    editor?.chain().focus().setColor(event.currentTarget.value).run();
  };

  return (
    <>
      <PostEditor.Menu>
        <Icon
          icon="bxs:color-fill"
          onClick={() => {
            inputRef.current?.click();
          }}
          color={editor?.getAttributes("textStyle").color}
        />
        <input
          ref={inputRef}
          className={styles.textColor}
          type="color"
          onInput={setColor}
          value={editor?.getAttributes("textStyle").color || "#000000"}
          data-testid="setColor"
        />
      </PostEditor.Menu>
    </>
  );
};

type Level = 1 | 2 | 3 | 4 | 5 | 6;

PostEditor.Heading = function Heading() {
  const post = useContext(PostContext);
  const editor = post?.Editor;
  const setHead = (level: Level) =>
    editor?.chain().focus().toggleHeading({ level }).run();
  return (
    <>
      <PostEditor.Menu onClick={() => setHead(1)}>
        <Icon icon="gridicons:heading-h1" />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={() => setHead(2)}>
        <Icon icon="gridicons:heading-h2" />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={() => setHead(3)}>
        <Icon icon="gridicons:heading-h3" />
      </PostEditor.Menu>
    </>
  );
};

PostEditor.CodeBlock = function CodeBlock() {
  const post = useContext(PostContext);
  const editor = post?.Editor;
  const setCode = () => editor?.chain().focus().toggleCodeBlock().run();
  return (
    <PostEditor.Menu onClick={setCode}>
      <Icon icon="tabler:code" />
    </PostEditor.Menu>
  );
};

PostEditor.LinkLine = function LinkLine() {
  const post = useContext(PostContext);
  const editor = post?.Editor;
  const setLink = () => {
    if (!editor) return null;
    const prevUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", prevUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch {
      alert("wrong access");
    }
  };
  return (
    <PostEditor.Menu onClick={setLink}>
      <Icon icon="material-symbols:link-rounded" />
    </PostEditor.Menu>
  );
};

PostEditor.Menu = (props: MenuProps) => {
  const { children, ...attriutes } = props;
  return (
    <button {...attriutes} className={styles.menu}>
      {children}
    </button>
  );
};

PostEditor.Division = () => {
  return <div className={styles.division} />;
};
