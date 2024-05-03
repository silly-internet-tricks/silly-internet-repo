// ==UserScript==
// @name         Quick React Demonstration
// @namespace    http://tampermonkey.net/
// @version      2024-05-03
// @description  Just briefly show that react can be used in a tampermonkey script (without bundling it in) and how
// @author       Josh Parker
// @require      https://www.unpkg.com/react@18.3.1/umd/react.development.js
// @require      https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js
// @resource     reacttoastifycss https://unpkg.com/react-toastify@9.0.5/dist/ReactToastify.min.css
// @resource     reacttoastifyjs  https://unpkg.com/react-toastify@9.0.5/dist/react-toastify.umd.js
// @match        https://stackoverflow.com/questions/71421441/can-you-create-a-react-js-with-cdn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_getResourceText
// ==/UserScript==

import insertCSS from '../../lib/util/insert-css';

(function quickReactDemonstration() {
 // @ts-expect-error GM.getResourceText is defined as part of the tampermonkey api
 GM.getResourceText('reacttoastifycss').then((css) => insertCSS(css));
 // @ts-expect-error we get React from the cdn
 const Example = React.createElement('div', null, 'hello we do not have the toast container yet');

 // we'll put the div on the question header where we can easily find it (🤞)
 // @ts-expect-error we get ReactDOM from the cdn
 ReactDOM.render(Example, document.getElementById('question-header'));

 // @ts-expect-error GM.getResourceText is defined as part of the tampermonkey api
 GM.getResourceText('reacttoastifyjs').then((js: string) => {
  const script = document.createElement('script');
  script.appendChild(new Text(js));
  document.body.appendChild(script);
  // Example.props.
 });

 setTimeout(() => {
  // @ts-expect-error toast is a function from react-toastify
  toast('another two seconds have passed');
 }, 2000);
})();
