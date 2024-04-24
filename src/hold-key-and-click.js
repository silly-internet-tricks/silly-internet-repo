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

export default function holdKeyAndClick(handlers) {
 document.addEventListener('keydown', ({ code }) => {
  Object.entries(handlers).forEach(([key, handler]) => {
   if (code === `Key${key.toLocaleUpperCase()}`) {
    document.addEventListener('click', handler);
    document.addEventListener('click', preventDefaultHandler);
    if (!holding) {
     addBorder({ target: hoverTarget });
    }
   }
  });
 });

 document.addEventListener('keyup', ({ code }) => {
  Object.entries(handlers).forEach(([key, handler]) => {
   if (code === `Key${key.toLocaleUpperCase()}`) {
    document.removeEventListener('click', handler);
    document.removeEventListener('click', preventDefaultHandler);
    holding = false;
    body.removeEventListener('mouseover', addBorder);
    resetBorder();
   }
  });
 });
}
