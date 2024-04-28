// TODO: find out what to use for json response instead of unknown
interface GmXmlHttpRequestResponse {
 response: AsyncIterableIterator;
}

interface GmXmlHttpRequestRequestOptions {
 url: string;
 method?: string;
 responseType: string;
 data?: string;
 fetch?: boolean;
 onloadstart?: (r: GmXmlHttpRequestResponse) => Promise;
}
