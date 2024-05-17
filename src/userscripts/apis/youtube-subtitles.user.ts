// ==UserScript==
// @name         Download Subtitles
// @namespace    http://tampermonkey.net/
// @version      2024-05-17
// @description  Download the Youtube Subtitles so you can search them later
// @author       Josh Parker
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_download
// @grant        GM_info
// ==/UserScript==

(function downloadSubtitles() {
 const saveButton = document.createElement('button');
 saveButton.innerText = 'Save subtitles';
 saveButton.setAttribute('style', 'position: fixed; left: 13dvw; top: 0; z-index: 2021;');

 document.querySelector('body').appendChild(saveButton);

 saveButton.addEventListener('click', () => {
  const videoId = window.location.href.match(/[^=]+$/)[0];
  const parser = new DOMParser();

  fetch(window.location.href)
   .then((r) => r.text())
   .then((t) => parser.parseFromString(t, 'text/html'))
   .then((dom): void => {
    const re = /"([^"]*timedtext[^"]*lang=en)"/;

    const script = [...dom.querySelectorAll('script')].find((s) => s.textContent.match(re));
    const url = `${script.textContent
     .match(re)[1]
     .replace(
      /\\u0026/g,
      '&',
     )}&fmt=json3&xorb=2&xobt=3&xovt=3&cbr=Chrome&cbrver=124.0.0.0&c=WEB&cver=2.20240514.03.00&cplayer=UNIPLAYER&cos=X11&cplatform=DESKTOP`;

    fetch(url)
     .then((r) => r.json())
     .then((j) => {
      console.log('got j');
      const events = j.events;
      console.log('events', events);

      const segs = events.flatMap((e: { segs: { utf8: string }[] }) => e.segs);
      console.log(segs, segs);
      const utf8s = segs.filter((e: { utf8: string }) => e).map((e: { utf8: string }) => e.utf8);
      console.log('utf8s', utf8s);
      const text = utf8s.join('');
      console.log('text', text);

      const blob = new Blob([text], { type: 'text/plain' });

      console.log('blob', blob);

      const blobUrl = URL.createObjectURL(blob);

      console.log(blobUrl);
      console.log(videoId);

      console.log(GM_info);

      GM_download({
       url: blobUrl,
       name: `${videoId}.txt`,
       saveAs: true,
       onload: () => {
        console.log('loading');
       },
       onerror: ({ error, details }) => {
        console.error(error);
        console.error(details);
       },
       onprogress: () => {
        console.log('progressing');
       },
       ontimeout: () => {
        console.log('timing out');
       },
      });
     });
   });
 });
})();
