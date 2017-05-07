"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var RxAVClient_1 = require("./RxAVClient");
var SDKPlugins_1 = require("../internal/SDKPlugins");
var AVCommand_1 = require("../internal/command/AVCommand");
var RxAVRealtime = (function () {
    function RxAVRealtime() {
        this.idSeed = -65535;
    }
    Object.defineProperty(RxAVRealtime, "instance", {
        get: function () {
            if (RxAVRealtime.singleton == null)
                RxAVRealtime.singleton = new RxAVRealtime();
            return RxAVRealtime.singleton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxAVRealtime.prototype, "RxWebSocketController", {
        get: function () {
            return SDKPlugins_1.SDKPlugins.instance.WebSocketController;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 打开与 Push Server 的 WebSocket
     *
     * @returns {Observable<boolean>}
     *
     * @memberOf RxAVRealtime
     */
    RxAVRealtime.prototype.open = function () {
        var _this = this;
        if (RxAVClient_1.RxAVClient.instance.currentConfiguration.server.rtm != null)
            return this.RxWebSocketController.open(RxAVClient_1.RxAVClient.instance.currentConfiguration.server.rtm);
        var pushRouter = RxAVClient_1.RxAVClient.instance.appRouterState.RealtimeRouterServer + "/v1/route?appId=" + RxAVClient_1.RxAVClient.instance.currentConfiguration.applicationId + "&secure=1";
        if (RxAVClient_1.RxAVClient.instance.currentConfiguration.server.pushRouter != null)
            pushRouter = RxAVClient_1.RxAVClient.instance.currentConfiguration.server.pushRouter;
        return RxAVClient_1.RxAVClient.instance.request(pushRouter).flatMap(function (response) {
            _this.pushRouterState = response.body;
            console.log('pushRouterState', _this.pushRouterState);
            return _this.RxWebSocketController.open(_this.pushRouterState.server);
        });
    };
    /**
     * 客户端打开聊天 v2 协议
     *
     * @param {string} clientId 当前客户端应用内唯一标识
     * @returns {Observable<boolean>}
     *
     * @memberOf RxAVRealtime
     */
    RxAVRealtime.prototype.connect = function (clientId) {
        var _this = this;
        this.clientId = clientId;
        return this.open().flatMap(function (opened) {
            if (opened) {
                var sessionOpenCmd = new AVCommand_1.AVCommand();
                sessionOpenCmd.data = {
                    cmd: 'session',
                    op: 'open',
                    appId: RxAVClient_1.RxAVClient.instance.currentConfiguration.applicationId,
                    peerId: clientId,
                    i: _this.cmdId,
                    ua: 'ts-sdk',
                };
                return _this.RxWebSocketController.execute(sessionOpenCmd).map(function (response) {
                    RxAVIMMessage.initValidators();
                    _this.messages = new rxjs_1.Subject();
                    _this.RxWebSocketController.onMessage.subscribe(function (message) {
                        var data = JSON.parse(message);
                        if (Object.prototype.hasOwnProperty.call(data, 'cmd')) {
                            if (data.cmd == 'direct') {
                                var newMessage = new RxAVIMMessage();
                                newMessage.deserialize(data);
                                _this.messages.next(newMessage);
                                _this.sendAck(newMessage.convId, newMessage.id);
                            }
                        }
                    });
                    return response.body.op == 'opened';
                });
            }
            return rxjs_1.Observable.from([opened]);
        });
    };
    /**
     *
     *
     * @param {string} convId
     * @param {{ [key: string]: any }} data
     * @returns
     *
     * @memberOf RxAVRealtime
     */
    RxAVRealtime.prototype.send = function (convId, data) {
        var mimeType = 'text';
        var iMessage = new RxAVIMMessage();
        var msg = {};
        if (Object.prototype.hasOwnProperty.call(data, 'type')) {
            mimeType = data.type;
        }
        switch (mimeType) {
            case 'text':
                msg = this._makeText(data);
                break;
            case 'image' || 'img' || 'pic' || 'picture':
                msg = this._makeImage(data);
                break;
            default:
                msg = data;
                break;
        }
        iMessage.content = JSON.stringify(msg);
        return this._send(convId, iMessage);
    };
    RxAVRealtime.prototype._makeText = function (data) {
        var text = '';
        if (Object.prototype.hasOwnProperty.call(data, 'text')) {
            text = data.text;
        }
        var msg = {
            _lctype: -1,
            _lctext: text
        };
        return this._makeArrtributes(msg, data);
    };
    RxAVRealtime.prototype._makeImage = function (data) {
        var url = "https://dn-lhzo7z96.qbox.me/1493019545196";
        if (Object.prototype.hasOwnProperty.call(data, 'url')) {
            url = data.url;
            delete data.url;
        }
        var text = '';
        if (Object.prototype.hasOwnProperty.call(data, 'text')) {
            text = data.text;
            delete data.text;
        }
        var msg = {
            _lctype: -2,
            _lctext: text,
            _lcfile: {
                url: url
            }
        };
        return this._makeArrtributes(msg, data);
    };
    RxAVRealtime.prototype._makeArrtributes = function (msg, data) {
        var attrs = {};
        for (var key in data) {
            attrs[key] = data.key;
        }
        msg['_lcattrs'] = attrs;
        return msg;
    };
    RxAVRealtime.prototype._send = function (convId, iMessage, tr, r, level) {
        var msgCmd = this.makeCommand()
            .attribute('cmd', 'direct')
            .attribute('cid', convId)
            .attribute('r', r ? r : true)
            .attribute('level', level ? level : 1)
            .attribute('msg', iMessage.serialize());
        return this.RxWebSocketController.execute(msgCmd).map(function (response) {
            if (Object.prototype.hasOwnProperty.call(response.body, 'uid')) {
                iMessage.id = response.body.uid;
            }
            return iMessage;
        });
    };
    RxAVRealtime.prototype.sendAck = function (convId, msgId, fromts, tots) {
        var ackCmd = this.makeCommand()
            .attribute('cid', convId)
            .attribute('cmd', 'ack');
        if (msgId) {
            ackCmd = ackCmd.attribute('mid', msgId);
        }
        if (fromts) {
            ackCmd = ackCmd.attribute('fromts', fromts);
        }
        if (tots) {
            ackCmd = ackCmd.attribute('tots', tots);
        }
        this.RxWebSocketController.execute(ackCmd);
    };
    RxAVRealtime.prototype.makeCommand = function () {
        var cmd = new AVCommand_1.AVCommand();
        cmd.attribute('appId', RxAVClient_1.RxAVClient.instance.currentConfiguration.applicationId);
        cmd.attribute('peerId', this.clientId);
        cmd.attribute('i', this.cmdId);
        return cmd;
    };
    RxAVRealtime.prototype.cmdIdAutomation = function () {
        return this.idSeed++;
    };
    Object.defineProperty(RxAVRealtime.prototype, "cmdId", {
        get: function () {
            return this.cmdIdAutomation();
        },
        enumerable: true,
        configurable: true
    });
    return RxAVRealtime;
}());
exports.RxAVRealtime = RxAVRealtime;
var RxAVIMMessage = (function () {
    function RxAVIMMessage() {
    }
    RxAVIMMessage.prototype.deserialize = function (data) {
        if (Object.prototype.hasOwnProperty.call(data, 'cid')) {
            this.convId = data.cid;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'id')) {
            this.id = data.id;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'timestamp')) {
            this.timestamp = data.timestamp;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'fromPeerId')) {
            this.from = data.cid;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'offline')) {
            this.offline = data.offline;
        }
        if (Object.prototype.hasOwnProperty.call(data, 'msg')) {
            this.content = data.msg;
        }
    };
    RxAVIMMessage.prototype.serialize = function () {
        return this.content;
    };
    RxAVIMMessage.prototype.validate = function () {
        return true;
    };
    RxAVIMMessage.prototype.toJson = function () {
        var rtn = {};
        for (var key in this) {
            rtn[key] = this[key];
        }
        try {
            var msgMap = JSON.parse(this.content);
            for (var index = 0; index < RxAVIMMessage.validators.length; index++) {
                var validator = RxAVIMMessage.validators[index];
                if (validator(this.content, rtn)) {
                    break;
                }
            }
        }
        catch (error) {
        }
        return rtn;
    };
    RxAVIMMessage.initValidators = function () {
        RxAVIMMessage.validators = [];
        var commonSet = function (msgMap, dataMapRef) {
            if (Object.prototype.hasOwnProperty.call(msgMap, '_lcattrs')) {
                var attrs = msgMap['_lcattrs'];
                for (var key in attrs) {
                    dataMapRef[key] = attrs[key];
                }
            }
        };
        var textValidator = function (msgStr, dataMapRef) {
            var msgMap = JSON.parse(msgStr);
            if (Object.prototype.hasOwnProperty.call(msgMap, '_lctype')) {
                var valid = msgMap['_lctype'] == -1;
                if (valid) {
                    dataMapRef.type = 'text';
                    dataMapRef.text = msgMap['_lctext'];
                    commonSet(msgMap, dataMapRef);
                }
                return valid;
            }
            return false;
        };
        var imageValidator = function (msgStr, dataMapRef) {
            var msgMap = JSON.parse(msgStr);
            if (Object.prototype.hasOwnProperty.call(msgMap, '_lctype')) {
                var valid = msgMap['_lctype'] == -2;
                commonSet(msgMap, dataMapRef);
                if (valid) {
                    dataMapRef.type = 'image';
                    var fileInfo = msgMap['_lcfile'];
                    if (Object.prototype.hasOwnProperty.call(fileInfo, 'url')) {
                        dataMapRef.url = fileInfo.url;
                    }
                    if (Object.prototype.hasOwnProperty.call(fileInfo, 'objId')) {
                        dataMapRef.fileId = fileInfo.objId;
                    }
                    if (Object.prototype.hasOwnProperty.call(fileInfo, 'metaData')) {
                        dataMapRef.metaData = fileInfo.metaData;
                    }
                }
                return valid;
            }
            return false;
        };
        RxAVIMMessage.validators.push(textValidator);
        RxAVIMMessage.validators.push(imageValidator);
    };
    return RxAVIMMessage;
}());
exports.RxAVIMMessage = RxAVIMMessage;
