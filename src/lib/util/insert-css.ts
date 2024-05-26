export default function insertCSS(css: string) {
 const style: HTMLStyleElement = document.createElement('style');
 style.appendChild(new Text(css));
 document.head.appendChild(style);

 return style.sheet;
}
