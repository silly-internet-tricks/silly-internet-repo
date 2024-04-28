import insertCSS from './insert-css';
import holdKeyAndClick from './hold-key-and-click';

export default function generalAnimationifier(
 animationClassName: string,
 CSS: string,
 scriptName: string,
) {
 insertCSS(CSS);

 const undoHandler: (target: Node) => void = (target: Node) => {
  if (target) {
   const elementTarget: Element = target as Element;
   if (!elementTarget.classList) throw new Error(`expected the target (${elementTarget}) to be an element with a class list`);
   if (elementTarget.classList.contains(animationClassName)) {
    elementTarget.classList.remove(animationClassName);

    // @ts-expect-error original display is an attribute that I add to the element specifically to use when I undo the animation
    const originalDisplay: string = target['original-display'];
    if (originalDisplay) {
     // @ts-expect-error original display is an attribute that I add to the element specifically to use when I undo the animation
     delete target['original-display'];

     const htmlTarget: HTMLElement = target as HTMLElement;
     if (!htmlTarget.style) throw new Error(`expected the target (${htmlTarget}) to be an html element `);
     htmlTarget.style.removeProperty('display');
     if (originalDisplay === 'element-style-inline') {
      htmlTarget.style.setProperty('display', 'inline');
     }
    }
   } else {
    undoHandler(target.parentNode);
   }
  }
 };

 const undoEventHandler: (event: Event) => void = ({ target }) => undoHandler(target as Node);

 holdKeyAndClick({
  do: ({ target }) => {
   const htmlElement: HTMLElement = target as HTMLElement;
   if (!htmlElement.classList) throw new Error(`expected the event target ${htmlElement} to be an HTMLElement with a classList`);
   if (!htmlElement.style) throw new Error(`expected the event target ${htmlElement} to be an HTMLElement with a style`);
   htmlElement.classList.add(animationClassName);
   const cssKeywordValue: CSSKeywordValue = htmlElement.computedStyleMap().get('display') as CSSKeywordValue;
   if (!cssKeywordValue.value) throw new Error(`expected the css style value ${cssKeywordValue} to be a CSSKeywordValue with a value`);
   if (cssKeywordValue.value === 'inline') {
    // @ts-expect-error original display is an attribute that I add to the element specifically to use when I undo the animation
    htmlElement['original-display'] = htmlElement.style.getPropertyValue('display') === 'inline' ? 'element-style-inline' : 'inline';
    htmlElement.style.setProperty('display', 'inline-block');
   }
  },
  undo: undoEventHandler,
 }, scriptName);
}
