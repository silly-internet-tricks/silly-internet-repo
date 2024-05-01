export default function insertCSS(css: string, title?: string) {
 const style: HTMLElement = document.createElement('style');
 style.appendChild(new Text(css));

 if (title) {
  style.title = title;
 }

 document.body.appendChild(style);
}
