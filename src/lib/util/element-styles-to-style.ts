export default function elementStylesToStyle() {
 const style = document.createElement('style');

 const css: string[] = [];

 const elementsWithElementStyle = [...document.querySelectorAll('[style]')] as HTMLElement[];

 elementsWithElementStyle.forEach((element) => {
  const { cssText } = element.style;
  if (cssText) {
   const generatedSelector = `${element.tagName.toLocaleLowerCase()}${element.id ? `#${element.id}` : ''}${
    element.classList.length ? `.${[...element.classList].join('.')}` : ''
   }`;

   css.push(`${generatedSelector} { ${cssText} }`);
  }
 });

 style.appendChild(new Text(css.join('\n\n')));

 console.log('made style from element styles');
 console.log(style);

 return style;
}
