import insertCSS from './insert-css';

let div: HTMLElement;

// @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
if (!window.getEffectKey) {
 // @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
 window.getEffectKey = (() => {
  const orderedKeys: string[] = [...'abcdefghijklmnopqrstuvwxyz1234567890'];
  const availableKeys: Set<string> = new Set<string>(orderedKeys);
  return () => {
   const availableKey: string = orderedKeys.find((key) => availableKeys.has(key));
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

const { body } = document;

const resetBorder: (e?: Event) => void = (() => {
 let last: Event = null;
 return (e) => {
  if (e) {
   last = e;
  } else if (last) {
   // @ts-expect-error I put the box shadow attribute on the element so that I can undo changing the box shadow
   const { target, boxShadow } = last;
   const htmlElement: HTMLElement = target as HTMLElement;
   htmlElement.style.removeProperty('box-shadow');
   if (boxShadow) {
    htmlElement.style.setProperty('box-shadow', boxShadow);
   }

   last = null;
  }
 };
})();

const addBorder: (event: { target: EventTarget }) => void = ({ target }) => {
 resetBorder();

 const htmlElement: HTMLElement = target as HTMLElement;
 const boxShadow: string = htmlElement.style.getPropertyValue('box-shadow');
 htmlElement.style.setProperty('box-shadow', '0 0 4px chartreuse');
 // @ts-expect-error I put the box shadow attribute on the element so that I can undo changing the box shadow
 resetBorder({ target: htmlElement, boxShadow });
};

let hoverTarget: EventTarget = null;
let holding: boolean = false;

const findHoverTarget: (event: Event) => void = ({ target }) => {
 hoverTarget = target;
};

body.addEventListener('mouseover', findHoverTarget);

const preventDefaultHandler: (event: Event) => void = (event) => {
 event.preventDefault();
};

interface Handlers {
 do: (event: Event) => void;
 undo: (event: Event) => void;
}
export default function holdKeyAndClick(handlers: Handlers, scriptName: string) {
 // @ts-expect-error I add the getEffectKey function to the window because it's meant to be accessible to any script that uses the hold key and click function
 const keys: string[] = [window.getEffectKey(), window.getEffectKey()];
 const p: Element = document.createElement('p');
 p.appendChild(new Text(`${scriptName} do key: ${keys[0]} undo key: ${keys[1]}`));
 div.appendChild(p);
 document.addEventListener('keydown', ({ code }) => {
  Object.values(handlers).forEach((handler, i) => {
   if (code === `Key${keys[i].toLocaleUpperCase()}`) {
    document.addEventListener('click', handler);
    document.addEventListener('click', preventDefaultHandler);

    if (!holding) {
     addBorder({ target: hoverTarget });
    }
   }
  });
 });

 document.addEventListener('keyup', ({ code }) => {
  Object.values(handlers).forEach((handler, i) => {
   if (code === `Key${keys[i].toLocaleUpperCase()}`) {
    document.removeEventListener('click', handler);
    document.removeEventListener('click', preventDefaultHandler);
    holding = false;
    body.removeEventListener('mouseover', addBorder);
    resetBorder();
   }
  });
 });
}
