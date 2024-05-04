import insertCSS from './insert-css';
import pick from './pick';

export default function makeAvailableKeys() {
 let div: HTMLElement;
 // if the window has getEffectKey defined on it, I assume that this function has been called already
 // and thus that the #effect-keys-menu div must already exist as well
 // @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
 if (!window.getEffectKey) {
  const getEffectKey: (requestedKeys: string[]) => string = (() => {
   const availableKeys: Set<string> = new Set<string>('abcdefghijklmnopqrstuvwxyz1234567890');
   return (requestedKeys: string[]) => {
    const availableKey: string = requestedKeys.find((key) => availableKeys.has(key)) || pick(availableKeys);
    availableKeys.delete(availableKey);
    return availableKey;
   };
  })();

  // @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
  window.getEffectKey = getEffectKey;

  insertCSS(`
#effect-keys-menu {
  z-index: 9001;
  position: fixed;
  left: 10px;
  bottom: 10px;
  background-color: rgba(127, 255, 0, 0.5);
  padding: 10px 20px;
}
`);

  div = document.createElement('div');
  const effectKeysHeading = document.createElement('h4');
  effectKeysHeading.appendChild(new Text('effect keys'));
  div.appendChild(effectKeysHeading);
  div.id = 'effect-keys-menu';

  const collapseButton = document.createElement('button');
  collapseButton.appendChild(new Text('X'));

  const uncollapseButton = document.createElement('button');
  uncollapseButton.appendChild(new Text('💗'));
  uncollapseButton.style.setProperty('display', 'none');

  collapseButton.addEventListener('click', () => {
   div.childNodes.forEach((childNode) => {
    if (childNode instanceof HTMLElement) {
     childNode.style.setProperty('display', 'none');
    }
   });

   uncollapseButton.style.removeProperty('display');
  });

  uncollapseButton.addEventListener('click', () => {
   div.childNodes.forEach((childNode) => {
    if (childNode instanceof HTMLElement) {
     childNode.style.removeProperty('display');
    }

    uncollapseButton.style.setProperty('display', 'none');
   });
  });

  // when the button is pressed, set the element style on all the div's children
  // to display none
  // then add an undo button

  div.appendChild(collapseButton);
  div.appendChild(uncollapseButton);

  document.body.appendChild(div);
 } else {
  div = document.querySelector('#effect-keys-menu');
 }

 return function getEffectKey(requestedKeys: string[], label: string) {
  // @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
  const effectKey: string = window.getEffectKey(requestedKeys);
  const p: Element = document.createElement('p');
  p.appendChild(new Text(`${label}: ${effectKey}`));
  div.appendChild(p);
  return effectKey;
 };
}
