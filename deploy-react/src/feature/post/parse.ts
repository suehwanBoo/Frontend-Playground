import { LinkProtocolOptions } from "@tiptap/extension-link";

export default function parseAndBuildMenu(htmlContent: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  const headArr = doc.querySelectorAll("h1");
  const menuArr: string[] = [];
  headArr.forEach((head, idx) => {
    const id = `part-${idx}`;
    head.setAttribute("id", id);
    menuArr.push(`<a href="#${id}">${head.textContent}</a>`);
  });
  const menu = `<nav class="post-menu">${menuArr.join("")}</nav>`;
  const parsedContent = doc.body.innerHTML;
  return {
    menu,
    parsedContent,
  };
}

type Ctx = {
  defaultValidate: (url: string) => boolean;
  protocols: Array<LinkProtocolOptions | string>;
  defaultProtocol: string;
};

export function CheckUri(url: string, ctx: Ctx) {
  // if (false) => link set X / (true) => link set O
  try {
    const parseUrl = url.includes("://")
      ? new URL(url)
      : new URL(ctx.defaultProtocol + "://" + url);
    if (!ctx.defaultValidate(parseUrl.href)) return false;
    return true;
  } catch {
    return false;
  }
}
