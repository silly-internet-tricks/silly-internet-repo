import { WebSocket, RawData } from 'ws';

export interface Listeners {
 onError: (err: Error) => void;
 onClose: (code: number, reason: Buffer) => void;
 onMessage?: (data: RawData) => void;
 onOpen: () => void;
}

export function setupWs(ws: WebSocket, listeners: Listeners) {
 ws.on('error', listeners.onError);
 ws.on('close', listeners.onClose);
 if (listeners.onMessage) ws.on('message', listeners.onMessage);
 ws.on('open', listeners.onOpen);
}
