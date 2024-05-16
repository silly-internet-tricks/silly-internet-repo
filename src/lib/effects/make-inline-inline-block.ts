import getCssKeywordValue from '../util/get-css-keyword-value';

type MakeInlineInlineBlock = (htmlElement: HTMLElement) => void;
const makeInlineInlineBlock: MakeInlineInlineBlock = function makeInlineInlineBlock(htmlElement) {
 if (getCssKeywordValue(htmlElement, 'display') === 'inline') {
  const displayValue: string = htmlElement.style.getPropertyValue('display');
  htmlElement.setAttribute(
   'original-display',
   displayValue === 'inline' ? 'element-style-inline' : 'inline',
  );
  htmlElement.style.setProperty('display', 'inline-block');
 }
};

type UndoInlineInlineBlock = (htmlElement: HTMLElement, originalDisplay: string) => void;
const undoInlineInlineBlock: UndoInlineInlineBlock = function undoInlineInlineBlock(
 htmlElement,
 originalDisplay,
) {
 htmlElement.removeAttribute('original-display');
 if (!htmlElement.style) {
  throw new Error(`expected the target (${htmlElement}) to be an html element `);
 }

 htmlElement.style.removeProperty('display');
 if (originalDisplay === 'element-style-inline') {
  htmlElement.style.setProperty('display', 'inline');
 }
};

export { makeInlineInlineBlock, undoInlineInlineBlock };
