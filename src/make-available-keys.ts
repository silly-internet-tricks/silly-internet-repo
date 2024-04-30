import insertCSS from './insert-css';
import pick from './pick';

export default function makeAvailableKeys() {
 let div: HTMLElement;
 // @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
 if (!window.getEffectKey) {
  // @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
  window.getEffectKey = ((requestedKeys: string[]) => {
   const availableKeys: Set<string> = new Set<string>('abcdefghijklmnopqrstuvwxyz1234567890');
   return () => {
    const availableKey: string = requestedKeys.find((key) => availableKeys.has(key)) || pick(availableKeys);
    availableKeys.delete(availableKey);
    return availableKey;
   };
  })();

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
  div.appendChild(new Text('effect keys'));
  div.id = 'effect-keys-menu';

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
