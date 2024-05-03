// ==UserScript==
// @name         Quick React Demonstration
// @namespace    http://tampermonkey.net/
// @version      2024-05-03
// @description  Just briefly show that react can be used in a tampermonkey script (without bundling it in) and how
// @author       Josh Parker
// @require      https://www.unpkg.com/react@18.3.1/umd/react.development.js
// @require      https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js
// @match        https://stackoverflow.com/questions/71421441/can-you-create-a-react-js-with-cdn
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        GM_getResourceText
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/quick-react-demo.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/7459dfa9b8d027dbf6ff7a13f5978861/raw/quick-react-demo.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/7459dfa9b8d027dbf6ff7a13f5978861/raw/quick-react-demo.meta.js
// ==/UserScript==

(function quickReactDemonstration() {
 const Example = React.createElement('div', null, 'hello we do not have the toast container yet');

 // we'll put the div on the question header where we can easily find it (🤞)
 ReactDOM.render(Example, document.getElementById('question-header'));
})();
