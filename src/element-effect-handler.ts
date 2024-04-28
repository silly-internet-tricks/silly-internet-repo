// type ElementEffectHandler = (Node[], ) => Node[];
export default function elementEffectHandler(
 childNodes: ChildNode[],
 textNodeHandler: (textNode: Text, newChildNodes: Node[], prevNodeWasText: boolean) => Node[],
 elementNodeHandler: (element: Element) => Element,
) {
 const newChildNodes: Node[] = [];
 let prevNodeWasText: boolean = false;
 childNodes.forEach((node: Node) => {
  if (node.nodeName === '#text') {
   const textNode: Text = node as Text;
   textNodeHandler(textNode, newChildNodes, prevNodeWasText).forEach((affectedNode: Text) => {
    newChildNodes.push(affectedNode);
    console.log(newChildNodes);
   });

   prevNodeWasText = true;
  } else if (node.nodeType === Node.COMMENT_NODE) {
   newChildNodes.push(new Comment(node.textContent));
  } else {
   const elementNode: Element = node as Element;
   if (!elementNode.tagName) throw new Error(`expected the node ${elementNode} to be an Element`);
   const freshNode: Element = document.createElement(elementNode.tagName);
   Object.values(elementNode.attributes).forEach(({ nodeName, nodeValue }) => {
    freshNode.setAttribute(nodeName, nodeValue);
   });

   const freshChildNodes: Node[] = elementEffectHandler(
    [...elementNode.childNodes],
    textNodeHandler,
    elementNodeHandler,
   );

   freshChildNodes.forEach((freshChildNode) => {
    freshNode.appendChild(freshChildNode);
   });

   newChildNodes.push(elementNodeHandler(freshNode));
   prevNodeWasText = false;
  }
 });

 return newChildNodes;
}
