export function getLineInfo(
  targetElem: HTMLElement | null,
  parentElem: HTMLElement | null
) {
  const targetWidth = targetElem?.offsetWidth || 0;
  const parentWidth = parentElem?.offsetWidth || 0;
  const targetLeft = targetElem?.getBoundingClientRect().left || 0;
  const parentLeft = parentElem?.getBoundingClientRect().left || 0;
  const width = (targetWidth / parentWidth) * 100;
  const left = targetLeft - parentLeft;
  return { width, left };
}
