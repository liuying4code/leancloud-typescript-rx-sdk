"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import WebSocket from 'ws';
var WebSocket = require('ws');
const rxjs_1 = require("rxjs");
class RxNodeJSWebSocketClient {
    constructor() {
        this.listeners = {};
    }
    get state() {
        return this._state;
    }
    set state(nextState) {
        this._state = nextState;
        this.onState.next(this.state);
    }
    open(url, protocols) {
        this.url = url;
        this.protocols = protocols;
        let rtn = new Promise((resolve, reject) => {
            this.wsc = new WebSocket(this.url, this.protocols);
            this.onState = new rxjs_1.Subject();
            this.socket = new rxjs_1.Subject();
            this.state = 'connecting';
            this.wsc.on('open', () => {
                this.state = 'connected';
                this.onMessage = this.socket.asObservable();
                if (resolve)
                    resolve(true);
            });
            this.wsc.on('error', (error) => {
                this.state = 'disconnected';
                if (reject)
                    reject(error);
            });
            this.wsc.on('message', (data, flags) => {
                let rawResp = JSON.parse(data);
                console.log('websocket<=', data);
                for (var listener in this.listeners) {
                    if (Object.prototype.hasOwnProperty.call(rawResp, 'i')) {
                        if (rawResp.i.toString() == listener) {
                            this.listeners[listener](rawResp);
                            delete this.listeners[listener];
                        }
                    }
                }
                this.socket.next(rawResp);
            });
            this.wsc.on('close', () => {
                console.log('websocket connection closed');
                this.state = 'closed';
            });
        });
        return rxjs_1.Observable.fromPromise(rtn);
    }
    close(code, data) {
        this.wsc.close(code, data);
    }
    send(data, options) {
        let rawReq = JSON.stringify(data);
        this.wsc.send(rawReq);
        console.log('websocket=>', data);
        let rtn = new Promise((resolve, reject) => {
            if (Object.prototype.hasOwnProperty.call(data, 'i')) {
                let fId = data.i.toString();
                this.listeners[fId] = (response) => {
                    let resp = {};
                    resp['body'] = response;
                    resp['satusCode'] = 200;
                    resolve(resp);
                };
            }
        });
        return rxjs_1.Observable.fromPromise(rtn);
    }
}
exports.RxNodeJSWebSocketClient = RxNodeJSWebSocketClient;
