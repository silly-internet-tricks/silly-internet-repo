// ==UserScript==
// @name         Download Subtitles
// @namespace    http://tampermonkey.net/
// @version      2024-05-17
// @description  Download the Youtube Subtitles so you can search them later
// @author       Josh Parker
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function downloadSubtitles() {
 const videoId = window.location.href.match(/[^=]+$/)[0];

 console.log('about to try to load the subs!');
 console.log(videoId);

 const parser = new DOMParser();

 fetch(window.location.href)
  .then((r) => {
   console.log('got response', r);
   return r.text();
  })
  .then((t) => {
   console.log('got text', t);
   return parser.parseFromString(t, 'text/html');
  })
  .then((dom): void => {
   const re = /"([^"]*timedtext[^"]*lang=en)"/;

   const script = [...dom.querySelectorAll('script')].find((s) => s.textContent.match(re));
   const url = `${script.textContent
    .match(re)[1]
    .replace(
     /\\u0026/g,
     '&',
    )}&fmt=json3&xorb=2&xobt=3&xovt=3&cbr=Chrome&cbrver=124.0.0.0&c=WEB&cver=2.20240514.03.00&cplayer=UNIPLAYER&cos=X11&cplatform=DESKTOP`;

   console.log('url is: ', url);

   fetch(url)
    .then((r) => r.json())
    .then((j) => {
     const text = j.events
      .flatMap((e: { segs: { utf8: string }[] }) => e.segs)
      .filter((e: { utf8: string }) => e)
      .map((e: { utf8: string }) => e.utf8)
      .join('');

     console.log('video id', videoId, 'text', text);
    });
  });
})();
