"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import WebSocket from 'ws';
var WebSocket = require('ws');
var NodeJSWebSocketClient = (function () {
    function NodeJSWebSocketClient() {
    }
    NodeJSWebSocketClient.prototype.open = function (url, protocols) {
        var _this = this;
        this.wsc = new WebSocket(url, protocols);
        this.readyState = 0;
        this.wsc.onmessage = function (event) {
            _this.onmessage({ data: event.data, type: event.type, target: _this });
        };
        this.wsc.onclose = function (event) {
            _this.readyState = 3;
            _this.onclose({ wasClean: event.wasClean, code: event.code, reason: event.reason, target: _this });
        };
        this.wsc.onerror = function (err) {
            _this.onerror(err);
        };
        this.wsc.onopen = function (event) {
            _this.readyState = 1;
            _this.onopen({ target: _this });
        };
    };
    NodeJSWebSocketClient.prototype.close = function (code, data) {
        this.readyState = 2;
        this.wsc.close(code, data);
    };
    NodeJSWebSocketClient.prototype.send = function (data) {
        this.wsc.send(data);
    };
    return NodeJSWebSocketClient;
}());
exports.NodeJSWebSocketClient = NodeJSWebSocketClient;
