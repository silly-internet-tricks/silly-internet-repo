export default function elementEffectHandler(childNodes, textNodeHandler, elementNodeHandler) {
 const newChildNodes = [];
 let prevNodeWasText = false;
 childNodes.forEach((node) => {
  if (node.nodeName === '#text') {
   textNodeHandler(node, newChildNodes, prevNodeWasText).forEach((affectedNode) => {
    newChildNodes.push(affectedNode);
   });

   prevNodeWasText = true;
  } else if (node.nodeType === Node.COMMENT_NODE) {
   newChildNodes.push(new Comment(node.textContent));
  } else {
   const freshNode = document.createElement(node.tagName);
   Object.values(node.attributes).forEach(({ nodeName, nodeValue }) => {
    freshNode.setAttribute(nodeName, nodeValue);
   });

   const freshChildNodes = elementEffectHandler([...node.childNodes], textNodeHandler);
   freshChildNodes.forEach((freshChildNode) => {
    freshNode.appendChild(freshChildNode);
   });

   newChildNodes.push(elementNodeHandler(freshNode));
   prevNodeWasText = false;
  }
 });

 return newChildNodes;
}
