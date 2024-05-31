import getStringFromChunk from '../util/get-string-from-chunk';

export default function getTwitchChatMessage(callback: (message: string, username: string) => void) {
 const requestOptions: GmXmlHttpRequestRequestOptions = {
  url: 'http://localhost:9821',
  responseType: 'stream',
  onloadstart: async ({ response }) => {
   // eslint-disable-next-line no-restricted-syntax
   for await (const chunk of response) {
    const chunkString = getStringFromChunk(chunk);
    console.log(chunkString);
    const { message, username } = JSON.parse(chunkString);
    callback(message, username);
   }
  },
 };

 GM.xmlHttpRequest(requestOptions);
}
