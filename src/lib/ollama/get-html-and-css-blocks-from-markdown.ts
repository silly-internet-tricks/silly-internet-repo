export default function getHtmlAndCssBlocksFromMarkdown(markdown: string) {
 return {
  html: [...markdown.matchAll(/```html(.*?)```/gmsi)].map((e) => e[1]),
  css: [...markdown.matchAll(/```css(.*?)```/gmsi)].map((e) => e[1]),
 };
}
