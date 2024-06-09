interface GmXmlHttpRequestResponse {
 response: AsyncIterableIterator;
}

interface GmXmlHttpRequestRequestOptions {
 url: string;
 method?: 'GET' | 'POST' | 'HEAD';
 responseType: 'json' | 'arraybuffer' | 'blob' | 'stream';
 data?: string;
 fetch?: boolean;
 onloadstart?: (r: GmXmlHttpRequestResponse) => Promise;
 onload?: () => void;
}
