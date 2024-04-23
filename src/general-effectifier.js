export default function generalEffectifier(affectText) {
 const effectifierHandler = function effectifierHandler(event) {
  const COMMENT_NODE_TYPE = 8;

  event.preventDefault();
  const { target } = event;
  if (!target.targetChildNodes) {
   const targetChildNodes = [...target.childNodes];

   target.targetChildNodes = targetChildNodes;

   const childNodeEffectifier = function childNodeEffectifier(childNodes) {
    const newChildNodes = [];

    let prevNodeWasText = false;
    childNodes.forEach((node) => {
     if (node.nodeName === '#text') {
      if (prevNodeWasText) newChildNodes.push(new Text(' '));
      newChildNodes.push(new Text(affectText(node.textContent)));
      prevNodeWasText = true;
     } else if (node.nodeType === COMMENT_NODE_TYPE) {
      newChildNodes.push(new Comment(node.textContent));
     } else {
      const freshNode = document.createElement(node.tagName);
      Object.values(node.attributes).forEach(({ nodeName, nodeValue }) => {
       freshNode.setAttribute(nodeName, nodeValue);
      });

      const freshChildNodes = childNodeEffectifier([...node.childNodes]);
      freshChildNodes.forEach((freshChildNode) => {
       freshNode.appendChild(freshChildNode);
      });

      newChildNodes.push(freshNode);
      prevNodeWasText = false;
     }
    });

    return newChildNodes;
   };

   target.innerHTML = '';
   childNodeEffectifier(targetChildNodes).forEach((node) => target.appendChild(node));

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

 // TODO: this is basically what I had in the binary bot: opportunity for code reuse
 const undoHandler = function undoHandler(event) {
  event.preventDefault();

  const { target } = event;

  revertChildNodes(target);
 };

 document.addEventListener('keydown', ({ code }) => {
  if (code === 'KeyB') {
   document.addEventListener('click', effectifierHandler);
  }

  if (code === 'KeyZ') {
   document.addEventListener('click', undoHandler);
  }
 });

 document.addEventListener('keyup', ({ code }) => {
  if (code === 'KeyB') {
   document.removeEventListener('click', effectifierHandler);
  }

  if (code === 'KeyZ') {
   document.removeEventListener('click', undoHandler);
  }
 });
}
