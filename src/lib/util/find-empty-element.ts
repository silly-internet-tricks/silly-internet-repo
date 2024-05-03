export default function findEmptyElement() {
 const helper: (e: HTMLElement) => HTMLElement = (e: HTMLElement) => {
  if (e.childNodes.length === 0) {
   return e;
  }

  const htmlElementChildren = [...e.childNodes]
   .filter((childNode) => childNode.nodeType === Node.ELEMENT_NODE && childNode instanceof HTMLElement)
   // sorting by text content length seems irrelevant/illogical (it's just the first thing I thought of)
   // is there another way to consider sorting, or do we even want to sort at all?
   .sort((a, b) => a.textContent.length - b.textContent.length) as HTMLElement[];

  if (htmlElementChildren.length === 0) {
   return null;
  }

  const result = htmlElementChildren.find((child) => helper(child));
  if (result) return result;

  throw new Error("didn't find a single empty element somehow 🔮😕🤔");
 };

 return helper(document.body);
}
