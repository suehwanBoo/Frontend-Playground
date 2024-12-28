import { MouseEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useLineControll() {
  const location = useLocation();
  const [lineWidth, setLineWidth] = useState(0);
  const [lineLeft, setLineLeft] = useState(0);
  const parent = useRef<null | HTMLDivElement>(null);
  const lineControll = (e: MouseEvent<HTMLAnchorElement>) => {
    const targetWidth = e.currentTarget.offsetWidth || 0;
    const parentWidth = parent.current?.offsetWidth || 0;
    const targetLeft = e.currentTarget.getBoundingClientRect().left || 0;
    const parentLeft = parent.current?.getBoundingClientRect().left || 0;
    const widthPer = (targetWidth / parentWidth) * 100;
    const positionLeft = targetLeft - parentLeft;
    setLineLeft(positionLeft);
    setLineWidth(widthPer);
  };
  const initLine = () => {
    const matchingLink = parent.current?.querySelector(
      `a[href="${location.pathname}"]`
    ) as HTMLAnchorElement;
    if (matchingLink) {
      const targetWidth = matchingLink?.offsetWidth || 0;
      const parentWidth = parent.current?.offsetWidth || 0;
      const targetLeft = matchingLink.getBoundingClientRect().left || 0;
      const parentLeft = parent.current?.getBoundingClientRect().left || 0;
      const widthPer = (targetWidth / parentWidth) * 100;
      const positionLeft = targetLeft - parentLeft;
      setLineLeft(positionLeft);
      setLineWidth(widthPer);
    }
  };

  useEffect(() => {
    initLine();
  }, [location]);

  return { parent, lineControll, initLine, lineWidth, lineLeft };
}
