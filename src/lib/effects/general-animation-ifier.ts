import insertCSS from '../util/insert-css';
import holdKeyAndClickWithUndo from '../util/hold-key-and-click-with-undo';
import { makeInlineInlineBlock, undoInlineInlineBlock } from './make-inline-inline-block';

/**
 * This function requires "@grant unsafeWindow"
 */
export default function generalAnimationifier(
 animationClassName: string,
 CSS: string,
 scriptName: string,
 eventListeners?: { eventType: string; eventListener: (event: Event) => void }[],
) {
 insertCSS(CSS);

 const undoHandler: (target: Node) => void = (target: Node) => {
  if (target) {
   const elementTarget: Element = target as Element;
   if (!elementTarget.classList) {
    throw new Error(`expected the target (${elementTarget}) to be an element with a class list`);
   }

   if (elementTarget.classList.contains(animationClassName)) {
    elementTarget.classList.remove(animationClassName);

    const originalDisplay: string = elementTarget.getAttribute('original-display');
    if (originalDisplay) {
     undoInlineInlineBlock(elementTarget as HTMLElement, originalDisplay);
    }

    if (eventListeners) {
     eventListeners.forEach((eventListener) => {
      elementTarget.removeEventListener(eventListener.eventType, eventListener.eventListener);
     });
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

    if (eventListeners) {
     eventListeners.forEach((eventListener) => {
      htmlElement.addEventListener(eventListener.eventType, eventListener.eventListener);
     });
    }

    makeInlineInlineBlock(htmlElement);
   },
   undo: undoEventHandler,
  },
  scriptName,
 );
}
