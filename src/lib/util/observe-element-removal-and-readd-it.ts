export default function observeElementRemovalAndReaddIt(htmlElement: HTMLElement) {
 const originalParentNode = htmlElement.parentNode;

 const mutationObserver = new MutationObserver(() => {
  // is the htmlElement still on its parent?
  if (![...originalParentNode.childNodes].find((node) => node === htmlElement)) {
   // if not, let's put it back.
   originalParentNode.appendChild(htmlElement);
  }
 });

 mutationObserver.observe(originalParentNode, {
  childList: true,
 });
}
