import holdKeyAndClick from './hold-key-and-click';

export default function generalElementEffectifier(
 callback,
 scriptName,
 targetClassName,
) {
 const effectifierHandler = function effectifierHandler(event) {
  event.preventDefault();
  const { target } = event;
  if (targetClassName) {
   target.classList.add(targetClassName);
  }

  if (!target['target-child-nodes']) {
   const targetChildNodes = [...target.childNodes];

   target['target-child-nodes'] = targetChildNodes;

   target.innerHTML = '';
   callback(target, targetChildNodes);

   document.removeEventListener('click', effectifierHandler);
  }
 };

 const revertChildNodes = function revertChildNodes(element) {
  if (!element) return;
  if (element['target-child-nodes']) {
   element.innerHTML = '';
   element['target-child-nodes'].forEach((node) => {
    element.appendChild(node);
   });

   delete element['target-child-nodes'];
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
