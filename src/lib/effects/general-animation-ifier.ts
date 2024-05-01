import insertCSS from '../util/insert-css';
import holdKeyAndClickWithUndo from '../util/hold-key-and-click-with-undo';
import { makeInlineInlineBlock, undoInlineInlineBlock } from './make-inline-inline-block';

export default function generalAnimationifier(animationClassName: string, CSS: string, scriptName: string) {
 insertCSS(CSS);

 const undoHandler: (target: Node) => void = (target: Node) => {
  if (target) {
   const elementTarget: Element = target as Element;
   if (!elementTarget.classList) {
    throw new Error(`expected the target (${elementTarget}) to be an element with a class list`);
   }

   if (elementTarget.classList.contains(animationClassName)) {
    elementTarget.classList.remove(animationClassName);

    // @ts-expect-error original display is an attribute that I add to the element specifically to use when I undo the animation
    const originalDisplay: string = elementTarget['original-display'];
    if (originalDisplay) {
     undoInlineInlineBlock(elementTarget as HTMLElement, originalDisplay);
    }
   } else {
    undoHandler(target.parentNode);
   }
  }
 };

 const undoEventHandler: (event: Event) => void = function undoEventHandler({ target }) {
  return undoHandler(target as Node);
 };

 holdKeyAndClickWithUndo(
  {
   do: ({ target }) => {
    const htmlElement: HTMLElement = target as HTMLElement;
    if (!htmlElement.classList) {
     throw new Error(`expected the event target ${htmlElement} to be an HTMLElement with a classList`);
    }

    if (!htmlElement.style) {
     throw new Error(`expected the event target ${htmlElement} to be an HTMLElement with a style`);
    }

    htmlElement.classList.add(animationClassName);
    makeInlineInlineBlock(htmlElement);
   },
   undo: undoEventHandler,
  },
  scriptName,
 );
}
