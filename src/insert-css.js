export default function insertCSS(css, title) {
 const style = document.createElement('style');
 style.appendChild(new Text(css));

 if (title) {
  style.title = title;
 }

 document.body.appendChild(style);
}
