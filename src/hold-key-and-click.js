export default function holdKeyAndClick(handlers) {
 document.addEventListener('keydown', ({ code }) => {
  Object.entries(handlers).forEach(([key, handler]) => {
   if (code === `Key${key.toLocaleUpperCase()}`) {
    document.addEventListener('click', handler);
   }
  });
 });

 document.addEventListener('keyup', ({ code }) => {
  Object.entries(handlers).forEach(([key, handler]) => {
   if (code === `Key${key.toLocaleUpperCase()}`) {
    document.removeEventListener('click', handler);
   }
  });
 });
}
