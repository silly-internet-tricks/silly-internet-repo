export default function getOllamaGeneratedResponse(
 ollamaAddress: string,
 model: string,
 prompt: string,
 callback: (response: string) => void,
) {
 const promise: Promise<void> = new Promise<void>((resolve) => {
  const requestOptions: GmXmlHttpRequestRequestOptions = {
   url: `${ollamaAddress}api/generate`,
   method: 'POST',
   responseType: 'stream',
   data: JSON.stringify({ model, prompt }),
   fetch: true,
   onloadstart: async ({ response }) => {
    // I think this is the idiomatic way to usually handle streams.
    // Next time I'll try it a different way, but I'm ignoring the linter this time
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of response) {
     const responseJSON: { response: string } = JSON.parse(
      [...chunk].map((b) => String.fromCharCode(b)).join(''),
     );

     callback(responseJSON.response);
    }

    resolve();
   },
  };

  // @ts-expect-error GM is defined as part of the API for the tampermonkey chrome extension
  GM.xmlHttpRequest(requestOptions);
 });

 return promise;
}
