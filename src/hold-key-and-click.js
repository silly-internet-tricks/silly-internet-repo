const preventDefaultHandler = (event) => {
 event.preventDefault();
};

const myTruthyValue = 'my-truth-value';

let hoverTarget;

const resetHighlight = function resetHighlight(element) {
 console.log(element);
 if (element?.oldBoxShadow) {
  element.style?.removeProperty('box-shadow');

  if (element.oldBoxShadow !== myTruthyValue) {
   element.style?.setProperty('box-shadow', element.oldBoxShadow);
  }

  delete element.oldBoxShadow;
 }
};

document.addEventListener('mouseover', ({ target }) => {
 resetHighlight(hoverTarget);
 hoverTarget = target;
});

const addHighlight = function addHighlight(element) {
 element.oldBoxShadow = element.style.getPropertyValue('box-shadow') || myTruthyValue;
 element.style.setProperty('box-shadow', '0 0 4px chartreuse');
};

const highlightWithBoxShadow = () => {
 addHighlight(hoverTarget);
};

export default function holdKeyAndClick(handlers) {
 document.addEventListener('keydown', ({ code }) => {
  Object.entries(handlers).forEach(([key, handler]) => {
   if (code === `Key${key.toLocaleUpperCase()}`) {
    addHighlight(hoverTarget);
    document.addEventListener('click', handler);
    document.addEventListener('click', preventDefaultHandler);
    document.addEventListener('mouseover', highlightWithBoxShadow);
   }
  });
 });

 document.addEventListener('keyup', ({ code }) => {
  Object.entries(handlers).forEach(([key, handler]) => {
   if (code === `Key${key.toLocaleUpperCase()}`) {
    resetHighlight(hoverTarget);
    document.removeEventListener('click', handler);
    document.removeEventListener('click', preventDefaultHandler);
    document.removeEventListener('mouseover', highlightWithBoxShadow);
   }
  });
 });
}
