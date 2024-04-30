import highlightElement from './highlight-element';
import makeAvailableKeys from './make-available-keys';

export default function holdKeyAndClick(
 requestedKeys: string[],
 clickCallback: (e: Event) => void,
 scriptName: string,
) {
 type ClickEventListener = (stopHighlighting: () => void) => (e: Event) => void;
 const clickEventListener: ClickEventListener = function clickEventListener(stopHighlighting) {
  return async (event) => {
   stopHighlighting();
   clickCallback(event);
  };
 };

 const getAvailableKey: (r: string[], label: string) => string = makeAvailableKeys();
 const insertKey: string = `Key${getAvailableKey(requestedKeys, `insert ${scriptName}`).toLocaleUpperCase()}`;

 const { startHighlighting, stopHighlighting } = highlightElement();
 const eventListener: (e: Event) => void = clickEventListener(stopHighlighting);

 document.addEventListener('keydown', ({ code }) => {
  if (code === insertKey) {
   startHighlighting();
   document.addEventListener('click', eventListener);
  }
 });

 document.addEventListener('keyup', ({ code }) => {
  if (code === insertKey) {
   stopHighlighting();
   document.removeEventListener('click', eventListener);
  }
 });
}
