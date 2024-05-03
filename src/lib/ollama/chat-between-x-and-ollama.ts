import insertCSS from '../util/insert-css';
import fillInputElement from '../util/fill-input-element';
import getStringFromChunk from '../util/get-string-from-chunk';

export default function chatBetweenXAndOllama(
 desiredOllamaModel: string,
 ollamaAddress: string,
 chatMessageSelector: string | (() => Element[]),
 roleCallback: (e: Element) => string,
 sendMessageSelectors?: {
  textAreaSelector: string | ((s?: string) => void) | (() => HTMLElement);
  sendButtonSelector: string | (() => HTMLElement);
 },
 reverseMessageOrder?: boolean,
 getMessageContent?: (e: Element) => string,
) {
 insertCSS(`
#ollama-text {
 position: fixed;
 bottom: 10dvh;
 left: 10px;
 border: solid chartreuse 8px;
 border-radius: 8px;
 padding: 20px;
 background-color: rgba(255,160,247,0.85);
 max-width: 30dvw;
 overflow-y: auto;
 z-index: 10;
 max-height: 88dvh;
}
`);

 const ollamaText: HTMLElement = document.createElement('div');
 ollamaText.style.setProperty('display', 'block');
 ollamaText.id = 'ollama-text';
 const ollamaButton: HTMLElement = document.createElement('button');
 ollamaButton.style.setProperty('display', 'block');
 ollamaButton.appendChild(new Text('ask ollama'));
 ollamaText.appendChild(ollamaButton);
 document.body.appendChild(ollamaText);

 ollamaButton.addEventListener('click', () => {
  // prettier-ignore
  const chatMessages: Element[] = (
   typeof chatMessageSelector === 'string'
    ? [...document.querySelectorAll(chatMessageSelector)]
    : chatMessageSelector());

  if (reverseMessageOrder) {
   chatMessages.reverse();
  }

  const requestOptions: GmXmlHttpRequestRequestOptions = {
   url: `${ollamaAddress}api/chat`,
   method: 'POST',
   responseType: 'stream',
   data: JSON.stringify({
    model: desiredOllamaModel,
    messages: chatMessages
     .map((e) => ({
      role: roleCallback(e),
      content: getMessageContent ? getMessageContent(e) : e.textContent,
     }))
     .reduce((acc, e) => {
      const last: { role: string; content: string } = acc.pop();

      if (last && e.role === last.role) {
       last.content += e.content;
       acc.push(last);
      } else if (last) {
       acc.push(last);
       acc.push(e);
      } else {
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
      done: boolean;
      message: {
       content: string;
      };
     }

     const responseJSON: OllamaChatApiResponseJson = JSON.parse(getStringFromChunk(chunk));

     const span: Element = document.createElement('span');

     const {
      message: { content },
      done,
     } = responseJSON;

     span.appendChild(new Text(content));
     responseParagraph.appendChild(span);
     if (sendMessageSelectors) {
      if (typeof sendMessageSelectors.textAreaSelector === 'string') {
       fillInputElement(document.querySelector(sendMessageSelectors.textAreaSelector), content);
      } else if (sendMessageSelectors.textAreaSelector.toString().substring(0, 2) === '()') {
       fillInputElement(sendMessageSelectors.textAreaSelector() as HTMLInputElement, content);
      } else {
       sendMessageSelectors.textAreaSelector(content);
      }

      if (done) {
       const { sendButtonSelector } = sendMessageSelectors;
       // prettier-ignore
       const button: HTMLElement = typeof sendButtonSelector === 'string'
        ? (document.querySelector(sendButtonSelector) as HTMLElement)
        : sendButtonSelector();
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
