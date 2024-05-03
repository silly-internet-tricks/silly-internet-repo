// ==UserScript==
// @name         Quick React Bundled Demonstration
// @namespace    http://tampermonkey.net/
// @version      2024-05-03
// @description  Just briefly show that react can be used in a tampermonkey script (by bundling it in) and how
// @author       Josh Parker
// @match        https://stackoverflow.com/questions/71421441/can-you-create-a-react-js-with-cdn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_getResourceText
// ==/UserScript==

import * as React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
 return (
  <div className="App">
   <h1>Hello CodeSandbox</h1>
   <h2>Start editing to see some magic happen!</h2>
  </div>
 );
}

const rootElement = document.getElementById('question-header');
const root = createRoot(rootElement);

root.render(<App />);
