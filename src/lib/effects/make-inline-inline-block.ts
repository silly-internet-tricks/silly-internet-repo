import getCssKeywordValue from '../util/get-css-keyword-value';

type MakeInlineInlineBlock = (htmlElement: HTMLElement) => void;
const makeInlineInlineBlock: MakeInlineInlineBlock = function makeInlineInlineBlock(htmlElement) {
 if (getCssKeywordValue(htmlElement, 'display') === 'inline') {
  const displayValue: string = htmlElement.style.getPropertyValue('display');
  // @ts-expect-error original display is an attribute that I add to the element specifically to use when I undo the animation
  htmlElement['original-display'] = displayValue === 'inline' ? 'element-style-inline' : 'inline';
  htmlElement.style.setProperty('display', 'inline-block');
 }
};

type UndoInlineInlineBlock = (htmlElement: HTMLElement, originalDisplay: string) => void;
const undoInlineInlineBlock: UndoInlineInlineBlock = function undoInlineInlineBlock(
 htmlElement,
 originalDisplay,
) {
 // @ts-expect-error original display is an attribute that I add to the element specifically to use when I undo the animation
 delete htmlElement['original-display'];
 if (!htmlElement.style) {
  throw new Error(`expected the target (${htmlElement}) to be an html element `);
 }

 htmlElement.style.removeProperty('display');
 if (originalDisplay === 'element-style-inline') {
  htmlElement.style.setProperty('display', 'inline');
 }
};

export { makeInlineInlineBlock, undoInlineInlineBlock };
