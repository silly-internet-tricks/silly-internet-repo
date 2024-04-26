import insertCSS from './insert-css';
import holdKeyAndClick from './hold-key-and-click';

export default function generalAnimationifier(animationClassName, CSS, scriptName) {
 insertCSS(CSS);

 const undoHandler = (target) => {
  if (target) {
   if (target.classList.contains(animationClassName)) {
    target.classList.remove(animationClassName);
    if (target.originalDisplay) {
     delete target.originalDisplay;
     target.style.removeProperty('display');
     if (target.originalDisplay === 'element-style-inline') {
      target.style.setProperty('display', 'inline');
     }
    }
   } else {
    undoHandler(target.parentNode);
   }
  }
 };

 const undoEventHandler = ({ target }) => undoHandler(target);

 holdKeyAndClick({
  do: ({ target }) => {
   target.classList.add(animationClassName);
   if (target.computedStyleMap().get('display').value === 'inline') {
    target.originalDisplay = target.style.getPropertyValue('display') === 'inline' ? 'element-style-inline' : 'inline';
    target.style.setProperty('display', 'inline-block');
   }
  },
  undo: undoEventHandler,
 }, scriptName);
}
