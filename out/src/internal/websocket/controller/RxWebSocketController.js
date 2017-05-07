"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var HttpResponse_1 = require("../../httpClient/HttpResponse");
var RxWebSocketController = (function () {
    function RxWebSocketController(_webSocketClient) {
        this.websocketClient = _webSocketClient;
    }
    RxWebSocketController.prototype.open = function (url, protocols) {
        var _this = this;
        if (this.websocketClient.readyState == 1)
            return rxjs_1.Observable.from([true]);
        console.log(url, 'connecting...');
        this.url = url;
        this.protocols = protocols;
        this.websocketClient.open(url, protocols);
        this.onState = rxjs_1.Observable.create(function (obs) {
            _this.websocketClient.onopen = function (event) {
                obs.next(_this.websocketClient.readyState);
            };
            _this.websocketClient.onerror = function (event) {
                obs.next(_this.websocketClient.readyState);
            };
            _this.websocketClient.onclose = function (event) {
                obs.next(_this.websocketClient.readyState);
            };
        });
        this.onMessage = rxjs_1.Observable.create(function (obs) {
            _this.websocketClient.onmessage = function (event) {
                var messageJson = JSON.parse(event.data);
                console.log('websocket<=', messageJson);
                obs.next(event.data);
            };
            _this.websocketClient.onclose = function (event) {
                obs.complete();
            };
            _this.websocketClient.onerror = function (event) {
                obs.error(event.stack);
            };
        });
        return this.onState.filter(function (readyState) {
            return readyState == 1;
        }).map(function (readyState) {
            return true;
        });
        ;
    };
    RxWebSocketController.prototype.execute = function (httpRequest) {
        var rawReq = JSON.stringify(httpRequest.data);
        this.websocketClient.send(rawReq);
        console.log('websocket=>', rawReq);
        return this.onMessage.filter(function (message) {
            var messageJSON = JSON.parse(message);
            if (Object.prototype.hasOwnProperty.call(messageJSON, 'i') && Object.prototype.hasOwnProperty.call(httpRequest.data, 'i')) {
                return httpRequest.data.i == messageJSON.i;
            }
            return false;
        }).map(function (message) {
            var messageJSON = JSON.parse(message);
            var resp = new HttpResponse_1.HttpResponse();
            resp.body = messageJSON;
            resp.satusCode = 200;
            return resp;
        });
    };
    return RxWebSocketController;
}());
exports.RxWebSocketController = RxWebSocketController;
