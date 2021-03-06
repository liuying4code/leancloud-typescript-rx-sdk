// //import WebSocket from 'ws';
// var WebSocket = require('ws');
// import { IRxWebSocketClient } from '../../src/RxLeanCloud';
// import { Observable, Observer, Subject } from 'rxjs';

// export class RxNodeJSWebSocketClient implements IRxWebSocketClient {
//     wsc: any;
//     url: string;
//     protocols: string | string[];
//     listeners: any = {};
//     onMessage: Observable<any>;
//     socket: Subject<any>;
//     onState: Subject<string>;
//     _state: string;

//     get state() {
//         return this._state;
//     }

//     set state(nextState: string) {
//         this._state = nextState;
//         this.onState.next(this.state);
//     }
    
//     open(url: string, protocols?: string | string[]): Observable<boolean> {
//         this.url = url;
//         this.protocols = protocols;
//         let rtn = new Promise<boolean>((resolve, reject) => {
//             this.wsc = new WebSocket(this.url, this.protocols);
//             this.onState = new Subject<any>();
//             this.socket = new Subject<any>();
//             this.state = 'connecting';
//             this.wsc.on('open', () => {
//                 this.state = 'connected';
//                 this.onMessage = this.socket.asObservable();
//                 if (resolve)
//                     resolve(true);
//             });

//             this.wsc.on('error', (error) => {
//                 this.state = 'disconnected';
//                 if (reject)
//                     reject(error);
//             });

//             this.wsc.on('message', (data, flags) => {
//                 let rawResp = JSON.parse(data);
//                 console.log('websocket<=', data);
//                 for (var listener in this.listeners) {
//                     if (Object.prototype.hasOwnProperty.call(rawResp, 'i')) {
//                         if (rawResp.i.toString() == listener) {
//                             this.listeners[listener](rawResp);
//                             delete this.listeners[listener];
//                         }
//                     }
//                 }
//                 this.socket.next(rawResp);
//             });

//             this.wsc.on('close', () => {
//                 console.log('websocket connection closed');
//                 this.state = 'closed';
//             });
//         });
//         return Observable.fromPromise(rtn);
//     }

//     close(code?: number, data?: any): void {
//         this.wsc.close(code, data);
//     }

//     send(data: any, options?: any): Observable<any> {
//         let rawReq = JSON.stringify(data);
//         this.wsc.send(rawReq);
//         console.log('websocket=>', data);
//         let rtn = new Promise<any>((resolve, reject) => {
//             if (Object.prototype.hasOwnProperty.call(data, 'i')) {
//                 let fId = data.i.toString();
//                 this.listeners[fId] = (response) => {
//                     let resp = {};
//                     resp['body'] = response;
//                     resp['satusCode'] = 200;
//                     resolve(resp);
//                 };
//             }
//         });
//         return Observable.fromPromise(rtn);
//     }
// }