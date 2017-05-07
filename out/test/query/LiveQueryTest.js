"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var RxLeanCloud_1 = require("../../src/RxLeanCloud");
var NodeJSWebSocketClient_1 = require("../realtime/NodeJSWebSocketClient");
describe('RxAVLiveQuery', function () {
    before(function (done) {
        RxLeanCloud_1.RxAVClient.init({
            appId: 'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
            appKey: 'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
            region: 'cn',
            log: true,
            server: {},
            plugins: {
                websocket: new NodeJSWebSocketClient_1.NodeJSWebSocketClient()
            }
        });
        // let realtime = RxAVRealtime.instance;
        // realtime.connect('junwu').subscribe(success => {
        // });
        done();
    });
    it('RxAVLiveQuery#subscribe', function (done) {
        var query = new RxLeanCloud_1.RxAVQuery('TodoLiveQuery');
        query.equalTo('name', 'livequery');
        var subscription = query.subscribe();
        subscription.flatMap(function (subs) {
            //save a tofo for test
            var todo = new RxLeanCloud_1.RxAVObject('TodoLiveQuery');
            todo.set('name', 'livequery');
            todo.save().subscribe(function (result) {
                console.log('save a tofo for test,', result);
            });
            console.log('subs', subs);
            return subs.on.asObservable();
        }).subscribe(function (pushData) {
            console.log('pushData.scope', pushData.scope, 'pushData.object.objectId', pushData.object.objectId);
            chai.assert.isNotNull(pushData.scope);
            chai.assert.isNotNull(pushData.object);
            done();
        });
    });
});
