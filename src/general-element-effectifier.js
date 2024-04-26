import holdKeyAndClick from './hold-key-and-click';

export default function generalElementEffectifier(affectElement, scriptName, targetClassName) {
 const effectifierHandler = function effectifierHandler(event) {
  event.preventDefault();
  const { target } = event;
  if (targetClassName) {
   target.classList.add(targetClassName);
  }

  if (!target.targetChildNodes) {
   const targetChildNodes = [...target.childNodes];

   target.targetChildNodes = targetChildNodes;

   target.innerHTML = '';
   affectElement(targetChildNodes).forEach((node) => target.appendChild(node));

   document.removeEventListener('click', effectifierHandler);
  }
 };

 const revertChildNodes = function revertChildNodes(element) {
  if (!element) return;
  if (element.targetChildNodes) {
   element.innerHTML = '';
   element.targetChildNodes.forEach((node) => {
    element.appendChild(node);
   });

   delete element.targetChildNodes;
  } else {
   revertChildNodes(element.parentNode);
  }
 };

 const undoHandler = function undoHandler(event) {
  event.preventDefault();

  const { target } = event;
  target.classList.remove(targetClassName);

  revertChildNodes(target);
 };

 holdKeyAndClick({ do: effectifierHandler, undo: undoHandler }, scriptName);
}
