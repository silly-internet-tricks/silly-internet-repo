const getExampleDOM: () => HTMLElement = function getExampleDOM() {
 // This is just a raw example of setting up some DOM
 // that we can interact with. Swap this with your UI
 // framework of choice 😉
 const div: HTMLElement = document.createElement('div');
 div.innerHTML = `
   <label for="username">Username</label>
   <input id="username" />
   <button>Print Username</button>
 `;

 const button: Element = div.querySelector('button') as Element;
 const input: HTMLInputElement = div.querySelector('input') as HTMLInputElement;
 if (input === null) {
  throw new Error('something went wrong when getting example dom. input was null');
 }

 if (button === null) {
  throw new Error('something went wrong when getting example dom. button was null');
 }

 button.addEventListener('click', () => {
  // let's pretend this is making a server request, so it's async
  // (you'd want to mock this imaginary request in your unit tests)...
  setTimeout(() => {
   const printedUsernameContainer: Element = document.createElement('div');
   const printedUsername: Element = document.createElement('div');
   printedUsername.setAttribute('data-testid', 'printed-username');
   printedUsername.appendChild(new Text(input.value));

   printedUsernameContainer.appendChild(new Text('\n       '));
   printedUsernameContainer.appendChild(printedUsername);
   printedUsernameContainer.appendChild(new Text('\n     '));

   div.appendChild(printedUsernameContainer);
  }, Math.floor(Math.random() * 200));
 });

 return div;
};

export default getExampleDOM;
