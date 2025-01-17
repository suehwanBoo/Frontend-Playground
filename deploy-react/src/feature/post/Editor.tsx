import { EditorContent } from "@tiptap/react";
import styles from "./editor.module.css";
import {
  ButtonHTMLAttributes,
  FormEvent,
  ReactNode,
  useContext,
  useRef,
} from "react";
import {
  BsBlockquoteRight,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeH4,
  BsTypeH5,
  BsTypeH6,
  BsTypeUnderline,
} from "react-icons/bs";
import {
  PiListBullets,
  PiTextItalic,
  PiTextStrikethrough,
} from "react-icons/pi";
import { FiBold, FiLink } from "react-icons/fi";
import { LuHighlighter } from "react-icons/lu";
import { BiSolidColorFill } from "react-icons/bi";
import { FaCode } from "react-icons/fa";
import { PostContext } from "./context";

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
        <BsTypeUnderline />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setBold}>
        <FiBold />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setStrike}>
        <PiTextStrikethrough />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setHighlight}>
        <LuHighlighter />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setItalic}>
        <PiTextItalic />
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
        <BsBlockquoteRight />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={setBulletList}>
        <PiListBullets />
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
        <BiSolidColorFill
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
        <BsTypeH1 />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={() => setHead(2)}>
        <BsTypeH2 />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={() => setHead(3)}>
        <BsTypeH3 />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={() => setHead(4)}>
        <BsTypeH4 />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={() => setHead(5)}>
        <BsTypeH5 />
      </PostEditor.Menu>
      <PostEditor.Menu onClick={() => setHead(6)}>
        <BsTypeH6 />
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
      <FaCode />
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
      <FiLink />
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
