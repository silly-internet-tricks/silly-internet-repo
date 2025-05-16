import insertCSS from './insert-css';
import observeElementRemovalAndReaddIt from './observe-element-removal-and-readd-it';

/**
 * this function requires "@grant unsafeWindow"
 */
const toast = (function makeToast() {
 const emptyElementId = 'toast-twitch-chat-empty-element';

 const zIndex = 9001;

 insertCSS(`
 .twitch-chat-toast {
   z-index: ${zIndex};
 }

 #${emptyElementId} {
   z-index: ${zIndex};
 }

 .twitch-chat-modal {
  position: fixed;
  top: 2px;
  left: 2px;
  font-size: 2rem;
  z-index: ${zIndex};
  background-image: linear-gradient(
   to top, #3FFF00 var(--gradient-bottom),
   #FFBF00 var(--gradient-top)
  );

   padding: 0.5rem;
   box-shadow: 2px 2px 2px black;
   text-shadow: 1px 1px 1px magenta;
   animation-name: modal-fade-out;
   animation-duration: 5s;
   animation-timing-function: linear;
   animation-iteration-count: 1;
   animation-fill-mode: forwards;
}

@keyframes modal-fade-out {
 0% {
  opacity: 100%;
  --gradient-top: 0%;
  --gradient-bottom: 0%;
 }

 25% {
  opacity: 100%;
  --gradient-top: 100%;
  --gradient-bottom: 0%;
 }

 50% {
  opacity: 100%;
  --gradient-top: 100%;
  --gradient-bottom: 100%;
 }

 100% {
  opacity: 0%;
  --gradient-top: 100%;
  --gradient-bottom: 100%;
 }
}

@property --gradient-top {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}

@property --gradient-bottom {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
 );`);

 // @ts-expect-error
 if (!unsafeWindow.sitToastChatModal) {
  // @ts-expect-error
  unsafeWindow.sitToastChatModal = document.createElement('div');
   const chatModalUl = document.createElement('ul');
   // @ts-expect-error
   unsafeWindow.sitToastChatModal.appendChild(chatModalUl);
 }

 let timeoutNumber: NodeJS.Timeout;
 // @ts-expect-error
 const chatModal = unsafeWindow.sitToastChatModal;
 const chatModalUl = chatModal.querySelector('ul');

 const emptyElement = document.createElement('div');
 emptyElement.id = emptyElementId;
 document.body.appendChild(emptyElement);
 observeElementRemovalAndReaddIt(emptyElement);

 return function showChatFunction(chat: string) {
  const chatLi = document.createElement('li');
  chatLi.appendChild(new Text(chat));

  chatModalUl.appendChild(chatLi);

  document.body.appendChild(chatModal);
  chatModal.classList.remove('twitch-chat-modal');
  chatModal.classList.add('twitch-chat-modal');
  clearTimeout(timeoutNumber);
  timeoutNumber = setTimeout(() => {
   chatModal.classList.remove('twitch-chat-modal');
   chatModal.parentElement.removeChild(chatModal);
  }, 5000);

  setTimeout(() => chatLi.parentElement.removeChild(chatLi), 5000);
 };
})();

export default toast;
