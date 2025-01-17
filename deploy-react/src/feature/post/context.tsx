import { createContext, Dispatch, ReactNode, useState } from "react";
import { PostType } from "./network";
import { createLowlight } from "lowlight";
import typescript from "highlight.js/lib/languages/typescript";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import Strike from "@tiptap/extension-strike";
import Italic from "@tiptap/extension-italic";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { CheckUri } from "./parse";
import Link from "@tiptap/extension-link";
import { Editor, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Highlight from "@tiptap/extension-highlight";

export const PostContext = createContext<null | {
  post: PostType;
  setPost: Dispatch<PostType>;
  Editor: Editor | null;
}>(null);

const lowlight = createLowlight();
lowlight.register({ typescript });

const EditorExtensions = [
  HorizontalRule,
  Paragraph,
  Document,
  Text,
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  BulletList,
  ListItem,
  Blockquote,
  Strike,
  Italic,
  Bold,
  Underline,
  Highlight,
  TextStyle,
  Color,
  CodeBlockLowlight.configure({ lowlight }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    isAllowedUri: CheckUri,
  }),
];

const DEFAULT_POST: PostType = {
  methodName: "func",
  categoryName: "",
  article: {
    title: "",
    content: "",
    navInfo: "",
    date: new Date(),
  },
};

export function PostProvider({ children }: { children: ReactNode }) {
  const editor = useEditor({
    extensions: EditorExtensions,
  });
  const [post, setPost] = useState<PostType>({
    ...DEFAULT_POST,
  });

  return (
    <PostContext.Provider value={{ Editor: editor, post, setPost }}>
      {children}
    </PostContext.Provider>
  );
}
