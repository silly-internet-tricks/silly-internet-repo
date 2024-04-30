import insertCSS from './insert-css';
import fillInputElement from './fill-input-element';

export default function chatBetweenXAndOllama(
 desiredOllamaModel: string,
 ollamaAddress: string,
 chatMessageSelector: string,
 roleCallback: (e: Element) => string,
 sendMessageSelectors?: { textAreaSelector: string, sendButtonSelector: string },
) {
 // TODO: this css is pretty ugly and could use an update
 insertCSS(`
#ollama-text {
 position: fixed;
 bottom: 10px;
 left: 10px;
 border: solid chartreuse 8px;
 border-radius: 8px;
 padding: 20px;
 background-color: rgba(255,0,127,0.2);
 max-width: 30dvw;
 overflow-y: auto;
 z-index: 10;
 max-height: 98dvh;
}
`);

 const ollamaText: Element = document.createElement('div');
 ollamaText.id = 'ollama-text';
 const ollamaButton: Element = document.createElement('button');
 ollamaButton.appendChild(new Text('ask ollama'));
 ollamaText.appendChild(ollamaButton);
 document.body.appendChild(ollamaText);

 ollamaButton.addEventListener('click', () => {
  const chatMessages: Element[] = [...document.querySelectorAll(chatMessageSelector)];

  const requestOptions: GmXmlHttpRequestRequestOptions = {
   url: `${ollamaAddress}api/chat`,
   method: 'POST',
   responseType: 'stream',
   data: JSON.stringify({
    model: desiredOllamaModel,
    messages: chatMessages.map((e) => ({
     role: roleCallback(e),
     content: e.textContent,
    })).reduce((acc, e) => {
     const last: { role: string, content: string } = acc.pop();

     if (e.role === last.role) {
      last.content += e.content;
      acc.push(last);
     } else {
      acc.push(last);
      acc.push(e);
     }

     return acc;
    }, []),
   }),
   fetch: true,
   onloadstart: async ({ response }) => {
    const responseParagraph: Element = document.createElement('p');
    ollamaText.appendChild(responseParagraph);
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of response) {
     interface OllamaChatApiResponseJson {
      done: boolean,
      message: {
       content: string
      };
     }

     const responseJSON: OllamaChatApiResponseJson = JSON.parse(
      [...chunk].map((b) => String.fromCharCode(b)).join(''),
     );

     const span: Element = document.createElement('span');

     const { message: { content }, done } = responseJSON;

     span.appendChild(new Text(content));
     responseParagraph.appendChild(span);
     if (sendMessageSelectors) {
      fillInputElement(document.querySelector(sendMessageSelectors.textAreaSelector), content);
      if (done) {
       console.log('done');
       const { sendButtonSelector } = sendMessageSelectors;
       const button: HTMLElement = document.querySelector(sendButtonSelector) as HTMLElement;
       console.log(button);
       button.click();
      }
     }
    }
   },
  };

  // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
  GM.xmlHttpRequest(requestOptions);
 });
}
