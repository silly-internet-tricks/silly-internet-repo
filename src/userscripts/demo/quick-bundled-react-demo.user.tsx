// ==UserScript==
// @name         Quick React Bundled Demonstration
// @namespace    http://tampermonkey.net/
// @version      2024-05-03
// @description  Just briefly show that react can be used in a tampermonkey script (by bundling it in) and how
// @author       Josh Parker
// @match        https://stackoverflow.com/questions/71421441/can-you-create-a-react-js-with-cdn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_getResourceText
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/quick-bundled-react-demo.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/865b2a94b57a561cf5a227dd40cb3502/raw/quick-bundled-react-demo.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/865b2a94b57a561cf5a227dd40cb3502/raw/quick-bundled-react-demo.meta.js
// ==/UserScript==

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = function App() {
 const notify = () => toast('Wow so easy!');

 return (
  <div className="App">
   <h1>Hello CodeSandbox</h1>
   <h2>Start editing to see some magic happen!</h2>
   <button onClick={notify}>Notify!</button>
   <ToastContainer />
  </div>
 );
};

const rootElement = document.getElementById('question-header');
const root = createRoot(rootElement);

root.render(<App />);
