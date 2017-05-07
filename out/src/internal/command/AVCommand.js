"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var HttpRequest_1 = require("../httpClient/HttpRequest");
var RxLeanCloud_1 = require("../../RxLeanCloud");
var AVCommand = (function (_super) {
    __extends(AVCommand, _super);
    function AVCommand(options) {
        var _this = _super.call(this) || this;
        _this.data = {};
        if (options != null) {
            _this.relativeUrl = options.relativeUrl;
            var apiVersion = '1.1';
            if (_this.relativeUrl == null || typeof _this.relativeUrl == 'undefined')
                throw new Error('command must have a relative url.');
            var protocol = 'https://';
            if (RxLeanCloud_1.RxAVClient.instance.currentConfiguration.region == 'cn') {
                _this.url = RxLeanCloud_1.RxAVClient.instance.appRouterState.ApiServer + "/" + apiVersion + _this.relativeUrl;
                if (RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.api != null) {
                    _this.url = RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.api + "/" + apiVersion + _this.relativeUrl;
                }
                if (_this.relativeUrl.startsWith('/push') || _this.relativeUrl.startsWith('/installations')) {
                    _this.url = RxLeanCloud_1.RxAVClient.instance.appRouterState.PushServer + "/" + apiVersion + _this.relativeUrl;
                    if (RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.push != null) {
                        _this.url = RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.push + "/" + apiVersion + _this.relativeUrl;
                    }
                }
                else if (_this.relativeUrl.startsWith('/stats')
                    || _this.relativeUrl.startsWith('/always_collect')
                    || _this.relativeUrl.startsWith('/statistics')) {
                    _this.url = RxLeanCloud_1.RxAVClient.instance.appRouterState.StatsServer + "/" + apiVersion + _this.relativeUrl;
                    if (RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.stats != null) {
                        _this.url = RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.stats + "/" + apiVersion + _this.relativeUrl;
                    }
                }
                else if (_this.relativeUrl.startsWith('/functions')
                    || _this.relativeUrl.startsWith('/call')) {
                    _this.url = RxLeanCloud_1.RxAVClient.instance.appRouterState.EngineServer + "/" + apiVersion + _this.relativeUrl;
                    if (RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.engine != null) {
                        _this.url = RxLeanCloud_1.RxAVClient.instance.currentConfiguration.server.engine + "/" + apiVersion + _this.relativeUrl;
                    }
                }
            }
            _this.method = options.method;
            _this.data = options.data;
            _this.headers = RxLeanCloud_1.RxAVClient.headers();
            if (options.headers != null) {
                for (var key in options.headers) {
                    _this.headers[key] = options.headers[key];
                }
            }
            if (options.sessionToken != null) {
                _this.sessionToken = options.sessionToken;
                _this.headers['X-LC-Session'] = options.sessionToken;
            }
            if (options.contentType != null) {
                _this.contentType = options.contentType;
                _this.headers['Content-Type'] = options.contentType;
            }
        }
        return _this;
    }
    AVCommand.prototype.attribute = function (key, value) {
        this.data[key] = value;
        return this;
    };
    return AVCommand;
}(HttpRequest_1.HttpRequest));
exports.AVCommand = AVCommand;
