export default function highlightElement() {
 let hoverTarget: HTMLElement = null;

 const findHoverTarget: (event: Event) => void = ({ target }) => {
  hoverTarget = target as HTMLElement;
 };

 document.addEventListener('mouseover', findHoverTarget);

 const { resetBorder, setLast } = (() => {
  let last: { htmlElement: HTMLElement; boxShadow: string } = null;
  return {
   resetBorder: () => {
    if (last) {
     const { htmlElement, boxShadow } = last;
     htmlElement?.style.removeProperty('box-shadow');
     if (boxShadow) {
      htmlElement?.style.setProperty('box-shadow', boxShadow);
     }

     last = null;
    }
   },
   setLast: (e: { htmlElement: HTMLElement; boxShadow: string }) => {
    last = e;
   },
  };
 })();

 const addBorder: () => void = () => {
  resetBorder();
  const boxShadow: string = hoverTarget?.style.getPropertyValue('box-shadow');
  hoverTarget?.style.setProperty('box-shadow', '0 0 4px chartreuse');
  setLast({ htmlElement: hoverTarget, boxShadow });
 };

 const startHighlighting: () => void = () => {
  addBorder();
  document.addEventListener('mouseover', addBorder);
 };

 const stopHighlighting: () => void = () => {
  resetBorder();
  document.removeEventListener('mouseover', addBorder);
 };

 return { startHighlighting, stopHighlighting };
}
