export default function insertCSS(css) {
  const style = document.createElement('style');
  style.appendChild(new Text(css));
  document.body.appendChild(style);
}
