import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLineInfo } from "../utils";

export default function useLineControll() {
  const location = useLocation();
  const [lineState, setLineState] = useState({ left: 0, width: 0 });
  const parent = useRef<null | HTMLDivElement>(null);

  const lineControll = (e: MouseEvent<HTMLElement>) => {
    const { width, left } = getLineInfo(e.currentTarget, parent.current);
    setLineState({ width, left });
  };

  const initLine = useCallback(() => {
    const matchingLink = parent.current?.querySelector(
      `a[href="${location.pathname}"]`
    ) as HTMLElement;
    if (matchingLink) {
      const { width, left } = getLineInfo(matchingLink, parent.current);
      setLineState({ width, left });
    }
  }, [location]);

  useEffect(() => {
    initLine();
  }, [initLine]);

  return { parent, lineControll, initLine, lineState };
}
