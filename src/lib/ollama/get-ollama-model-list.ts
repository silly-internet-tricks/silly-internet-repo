export default function getOllamaModelList<T>(ollamaAddress: string) {
 const promise: Promise<{ response: T }> = new Promise<{ response: T }>((resolve) => {
  const requestOptions: GmXmlHttpRequestRequestOptions = {
   url: `${ollamaAddress}api/tags`,
   method: 'GET',
   responseType: 'json',
   fetch: true,
  };

  resolve(GM.xmlHttpRequest(requestOptions));
 });

 return promise;
}
