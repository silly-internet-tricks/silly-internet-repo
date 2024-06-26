import holdKeyAndClickWithUndo from '../util/hold-key-and-click-with-undo';

export default function generalElementEffectifier(
 callback: (target: EventTarget, targetChildNodes: ChildNode[], length?: number) => void,
 scriptName: string,
 targetClassName: string,
 undoCallback?: (element: Element) => void,
) {
 const effectifierHandler: (event: Event) => void = function effectifierHandler(event: Event) {
  event.preventDefault();
  const { target } = event;
  const element: Element = target as Element;
  const { length } = element.textContent;
  if (targetClassName) {
   element.classList.add(targetClassName);
  }

  const targetChildNodes: ChildNode[] = [...element.childNodes];

  // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
  element['target-child-nodes'] = targetChildNodes;

  element.innerHTML = '';
  callback(element, targetChildNodes, length);
  document.removeEventListener('click', effectifierHandler);
 };

 const revertChildNodes: (node: Node) => void = function revertChildNodes(node) {
  if (!node) return;
  // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
  if (node['target-child-nodes']) {
   const element: Element = node as Element;

   element.innerHTML = '';
   // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
   element['target-child-nodes'].forEach((targetChildNode) => {
    element.appendChild(targetChildNode);
   });

   // @ts-expect-error: this is a property I dynamically add to the element in order to access it later
   delete element['target-child-nodes'];
  } else {
   revertChildNodes(node.parentNode);
  }
 };

 const undoHandler: (event: Event) => void = function undoHandler(event) {
  event.preventDefault();

  const { target } = event;

  const element: Element = target as Element;
  if (!element.classList) {
   throw new Error(`expected the element ${element} to be an element and have classList`);
  }

  if (undoCallback) {
   undoCallback(element);
  }

  element.classList.remove(targetClassName);

  revertChildNodes(element);
 };

 holdKeyAndClickWithUndo({ do: effectifierHandler, undo: undoHandler }, scriptName);
}
