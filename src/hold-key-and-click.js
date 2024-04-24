import insertCSS from './insert-css';

let div;

if (!window.getEffectKey) {
 window.getEffectKey = (() => {
  const orderedKeys = [...'abcdefghijklmnopqrstuvwxyz1234567890'];
  const availableKeys = new Set(orderedKeys);
  return () => {
   const availableKey = orderedKeys.find((key) => availableKeys.has(key));
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

const resetBorder = (() => {
 let last = null;
 return (e) => {
  if (e) {
   last = e;
  } else if (last) {
   const { target, border } = last;
   target.style.removeProperty('box-shadow');
   if (border) {
    target.style.setProperty('box-shadow', border);
   }

   last = null;
  }
 };
})();

const addBorder = ({ target }) => {
 resetBorder();

 const border = target.style.getPropertyValue('box-shadow');
 target.style.setProperty('box-shadow', '0 0 4px chartreuse');
 resetBorder({ target, border });
};

let hoverTarget = null;
let holding = false;

const findHoverTarget = ({ target }) => {
 hoverTarget = target;
};

body.addEventListener('mouseover', findHoverTarget);

const preventDefaultHandler = (event) => {
 event.preventDefault();
};

export default function holdKeyAndClick(handlers, scriptName) {
 const keys = [window.getEffectKey(), window.getEffectKey()];
 const p = document.createElement('p');
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
