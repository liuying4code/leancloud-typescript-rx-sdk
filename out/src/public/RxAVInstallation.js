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
var rxjs_1 = require("rxjs");
var RxLeanCloud_1 = require("../RxLeanCloud");
var SDKPlugins_1 = require("../internal/SDKPlugins");
var jstz = require("jstz");
/**
 * 安装数据
 *
 * @export
 * @class RxAVInstallation
 * @extends {RxAVObject}
 */
var RxAVInstallation = (function (_super) {
    __extends(RxAVInstallation, _super);
    function RxAVInstallation() {
        var _this = _super.call(this, '_Installation') || this;
        _this.set('timeZone', _this.timeZone);
        return _this;
    }
    Object.defineProperty(RxAVInstallation.prototype, "channels", {
        /**
         * 获取频道
         *
         *
         * @memberOf RxAVInstallation
         */
        get: function () {
            return this.get('channels');
        },
        /**
         * 设置频道
         *
         *
         * @memberOf RxAVInstallation
         */
        set: function (data) {
            this.set('channels', data);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxAVInstallation.prototype, "badge", {
        get: function () {
            return this.get('badge');
        },
        set: function (data) {
            this.set('badge', data);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxAVInstallation.prototype, "deviceType", {
        get: function () {
            return this.get('deviceType');
        },
        set: function (data) {
            this.set('deviceType', data);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxAVInstallation.prototype, "deviceToken", {
        get: function () {
            return this.get('deviceToken');
        },
        set: function (data) {
            this.set('deviceToken', data);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxAVInstallation.prototype, "installationId", {
        /**
         * 获取 installationId
         *
         * @readonly
         *
         * @memberOf RxAVInstallation
         */
        get: function () {
            return this.get('installationId');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxAVInstallation.prototype, "timeZone", {
        /**
         * 获取设备所在的地区/时区
         *
         * @readonly
         *
         * @memberOf RxAVInstallation
         */
        get: function () {
            return jstz.determine().name();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 保存当前的 {RxAVInstallation} 到云端
     *
     * @returns {Observable<boolean>}
     *
     * @memberOf RxAVInstallation
     */
    RxAVInstallation.prototype.save = function () {
        var _this = this;
        return _super.prototype.save.call(this).flatMap(function (s1) {
            if (s1)
                return RxAVInstallation.saveCurrentInstallation(_this);
            else
                return rxjs_1.Observable.from([false]);
        });
    };
    /**
     * 获取当前的 RxAVInstallation 对象
     *
     * @static
     * @returns {Observable<RxAVInstallation>} 异步操作可能会失败
     *
     * @memberOf RxAVInstallation
     */
    RxAVInstallation.current = function () {
        return SDKPlugins_1.SDKPlugins.instance.LocalStorageControllerInstance.get(RxAVInstallation.installationCacheKey).map(function (installationCache) {
            if (installationCache) {
                var installationState = SDKPlugins_1.SDKPlugins.instance.ObjectDecoder.decode(installationCache, SDKPlugins_1.SDKPlugins.instance.Decoder);
                installationState = installationState.mutatedClone(function (s) { });
                var installation = RxLeanCloud_1.RxAVObject.createSubclass(RxAVInstallation, '');
                installation.handleFetchResult(installationState);
                RxAVInstallation._currentInstallation = installation;
            }
            return RxAVInstallation._currentInstallation;
        });
    };
    Object.defineProperty(RxAVInstallation, "currentInstallation", {
        /**
         *  在调用本方法之前，请务必确保你已经调用了 RxAVInstallation.current()
         *
         * @readonly
         * @static
         *
         * @memberOf RxAVInstallation
         */
        get: function () {
            return RxAVInstallation._currentInstallation;
        },
        enumerable: true,
        configurable: true
    });
    RxAVInstallation.saveCurrentInstallation = function (installation) {
        RxAVInstallation._currentInstallation = installation;
        return RxLeanCloud_1.RxAVObject.saveToLocalStorage(installation, RxAVInstallation.installationCacheKey);
    };
    return RxAVInstallation;
}(RxLeanCloud_1.RxAVObject));
RxAVInstallation.installationCacheKey = 'CurrentInstallation';
RxAVInstallation._currentInstallation = null;
exports.RxAVInstallation = RxAVInstallation;
