import makeAvailableKeys from './make-available-keys';
import highlightElement from './highlight-element';

const preventDefaultHandler: (event: Event) => void = (event) => {
 event.preventDefault();
};

interface Handlers {
 do: (event: Event) => void;
 undo: (event: Event) => void;
}
export default function holdKeyAndClick(handlers: Handlers, scriptName: string) {
 const getEffectKey: (requestedKeys: string[], label: string) => string = makeAvailableKeys();
 const keys: string[] = [
  getEffectKey([], `${scriptName} do key`),
  getEffectKey([], `${scriptName} undo key`),
 ];

 const { startHighlighting, stopHighlighting } = highlightElement();

 document.addEventListener('keydown', ({ code }) => {
  Object.values(handlers).forEach((handler, i) => {
   if (code === `Key${keys[i].toLocaleUpperCase()}`) {
    document.addEventListener('click', handler);
    document.addEventListener('click', preventDefaultHandler);

    startHighlighting();
   }
  });
 });

 document.addEventListener('keyup', ({ code }) => {
  Object.values(handlers).forEach((handler, i) => {
   if (code === `Key${keys[i].toLocaleUpperCase()}`) {
    document.removeEventListener('click', handler);
    document.removeEventListener('click', preventDefaultHandler);
    stopHighlighting();
   }
  });
 });
}
