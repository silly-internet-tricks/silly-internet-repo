export default function getHtmlAndCssBlocksFromMarkdown(markdown: string) {
 const htmlAndCss: { html: string[]; css: string[] } = {
  html: [],
  css: [],
 };

 let remainingHtml: string = markdown;
 while (remainingHtml.match(/```html/)) {
  const startDelimiter: string = '```html';
  const endDelimiter: string = '```';
  const startSubstringIndex: number = remainingHtml.indexOf(startDelimiter) + startDelimiter.length;
  if (startSubstringIndex !== -1) {
   const startSubstring: string = remainingHtml.substring(startSubstringIndex);
   const subString: string = startSubstring.substring(0, startSubstring.indexOf(endDelimiter));

   htmlAndCss.html.push(subString);

   remainingHtml = startSubstring.substring(startSubstring.indexOf(endDelimiter) + endDelimiter.length);
  }
 }

 let remainingCss: string = markdown;
 while (remainingCss.match(/```css/)) {
  const startDelimiter: string = '```css';
  const endDelimiter: string = '```';
  const startSubstringIndex: number = remainingCss.indexOf(startDelimiter) + startDelimiter.length;
  if (startSubstringIndex !== -1) {
   const startSubstring: string = remainingCss.substring(startSubstringIndex);
   const subString: string = startSubstring.substring(0, startSubstring.indexOf(endDelimiter));

   htmlAndCss.css.push(subString);

   remainingCss = startSubstring.substring(startSubstring.indexOf(endDelimiter) + endDelimiter.length);
  }
 }

 return htmlAndCss;
}
