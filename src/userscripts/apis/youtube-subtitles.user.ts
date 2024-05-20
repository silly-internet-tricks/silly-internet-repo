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
// @source       https://github.com/silly-internet-tricks/silly-internet-repo/blob/main/src/userscripts/apis/youtube-subtitles.user.ts
// @downloadURL  https://gist.githubusercontent.com/silly-internet-tricks/ec46427ee08ca2252bab339cca3fcaac/raw/youtube-subtitles.user.js
// @updateURL    https://gist.githubusercontent.com/silly-internet-tricks/ec46427ee08ca2252bab339cca3fcaac/raw/youtube-subtitles.meta.js
// ==/UserScript==

(function downloadSubtitles() {
 const mo = new MutationObserver((mutationRecords) => {
  if (
   mutationRecords.find((mr) => {
    const { target } = mr;
    return target instanceof HTMLElement && target.tagName === 'TITLE';
   })
  ) {
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
       const { events } = j;
       const segs = events.flatMap((e: { segs: { utf8: string }[] }) => e.segs);
       const utf8s = segs.filter((e: { utf8: string }) => e).map((e: { utf8: string }) => e.utf8);
       const text = utf8s.join('');
       const blob = new Blob([text], { type: 'text/plain' });
       const blobUrl = URL.createObjectURL(blob);

       GM_download({
        url: blobUrl,
        name: `youtube-subtitles/${videoId}.txt`,
        saveAs: true,
        conflictAction: 'overwrite',
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
  }
 });

 mo.observe(document.head.querySelector('title'), { childList: true });
})();
