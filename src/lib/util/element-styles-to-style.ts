export default function elementStylesToStyle() {
 const style = document.createElement('style');

 const css: string[] = [];

 const elementsWithElementStyle = [...document.querySelectorAll('[style]')] as HTMLElement[];

 elementsWithElementStyle.forEach((element) => {
  const { cssText } = element.style;
  if (cssText) {
   const selector = [];
   let cur = element;

   while (cur && cur !== document.body.parentElement) {
    selector.push(
     `${cur.tagName.toLocaleLowerCase()}${cur.id ? `#${cur.id}` : ''}${
      cur.classList.length ? `.${[...cur.classList].join('.')}` : ''
     }`,
    );

    cur = cur.parentElement;
   }

   const generatedSelector = selector.reverse().join(' > ');

   css.push(`${generatedSelector} { ${cssText} }`);
  }
 });

 style.appendChild(new Text(css.join('\n\n')));

 console.log('made style from element styles');
 console.log(style);

 return style;
}
