import generalElementEffectifier from './general-element-effectifier';

export default function generalTextEffectifier(affectText, scriptName, targetClassName) {
 const childNodeEffectifier = function childNodeEffectifier(childNodes) {
  const newChildNodes = [];

  let prevNodeWasText = false;
  childNodes.forEach((node) => {
   if (node.nodeName === '#text') {
    if (prevNodeWasText) newChildNodes.push(new Text(' '));
    affectText(node.textContent).forEach((affectedNode) => {
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

 generalElementEffectifier(childNodeEffectifier, scriptName, targetClassName);
}
