const getSubstrings: (markdown: string, startDelimiter: string) => string[] = function getSubstrings(
 markdown,
 startDelimiter,
) {
 const substrings: string[] = [];
 let remaining: string = markdown;
 const re: RegExp = new RegExp(startDelimiter);

 while (remaining.match(re)) {
  const endDelimiter: string = '```';
  const startSubstringIndex: number = remaining.indexOf(startDelimiter);
  const startSubstring: string = remaining.substring(startSubstringIndex + startDelimiter.length);
  const endIndex: number = startSubstring.indexOf(endDelimiter);
  if (endIndex !== -1) {
   const substring: string = startSubstring.substring(0, endIndex);
   substrings.push(substring);
   remaining = startSubstring.substring(endIndex + endDelimiter.length);
  } else {
   substrings.push(startSubstring);
   remaining = startSubstring;
  }
 }

 return substrings;
};

export default function getHtmlAndCssBlocksFromMarkdown(markdown: string) {
 const htmlAndCss: { html: string[]; css: string[] } = {
  html: [],
  css: [],
 };

 getSubstrings(markdown, '```html').forEach((substring) => {
  htmlAndCss.html.push(substring);
 });

 getSubstrings(markdown, '```css').forEach((substring) => {
  htmlAndCss.css.push(substring);
 });

 return htmlAndCss;
}
