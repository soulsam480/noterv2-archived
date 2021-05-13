export const setCaretToEnd = (element: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
  element.focus();
};
export const getCaretCoordinates = () => {
  let x, y;
  const selection = window.getSelection();
  if (selection?.rangeCount !== 0) {
    const range = selection?.getRangeAt(0).cloneRange();
    range?.collapse(false);
    const rect = range?.getClientRects()[0];
    if (rect) {
      x = rect.left;
      y = rect.top;
    } else {
      window.document.execCommand('insertText', false, ' ');
      const range = selection?.getRangeAt(0).cloneRange();
      range?.collapse(false);
      const rect = range?.getClientRects()[0];
      x = rect?.left;
      y = rect?.top;
    }
  }
  return x === undefined || y === undefined ? { x: 20, y: 20 } : { x, y };
};

export function matchSorter<T extends Record<string, string>>(
  data: T[],
  val: string,
  key: string,
): T[] {
  return data.slice().filter((el) => el[key].toString().includes(val));
}
