import * as chai from 'chai';
import { RxAVClient, RxAVObject, RxAVQuery, RxAVRole, RxAVUser, RxAVACL, RxAVRealtime } from '../../src/RxLeanCloud';
import * as random from "../utils/random";
import { NodeJSWebSocketClient } from './NodeJSWebSocketClient';

describe('AVRealtime', () => {
    before(done => {
        RxAVClient.init({
            appId: 'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap',
            appKey: 'kfgz7jjfsk55r5a8a3y4ttd3je1ko11bkibcikonk32oozww',
            region: 'cn',
            log: true,
            pluginVersion: 2,
            plugins: {
                websocket: new NodeJSWebSocketClient()
            }
        });

        let realtime = RxAVRealtime.instance;
        realtime.connect('junwu').subscribe(success => {
            done();
        });
    });

    it('AVRealtime#receive', done => {
        let realtime = RxAVRealtime.instance;
        RESTSendMessage('test');
        realtime.messages.subscribe(message => {
            console.log(message.serialize());
            let msgMap = message.toJson();
            console.log('msgMap', msgMap);
            done();
        });
    });

    it('AVRealtime#send', done => {
        let realtime = RxAVRealtime.instance;
        realtime.send('58be1f5392509726c3dc1c8b', {
            type: 'text',
            text: '我是个测试消息'
        }).subscribe(msg => {
            chai.assert.isNotNull(msg.id);
            done();
        });
    });

});

function RESTSendMessage(text: string, attrs?: any) {
    var request = require("request");
    let textMessage = {
        _lctype: -1,
        _lctext: text
    };

    let options = {
        method: 'POST',
        url: 'https://api.leancloud.cn/1.1/rtm/messages',
        headers:
        {
            'postman-token': '6388b3fe-1943-17d4-98af-65cb010f3351',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'x-lc-key': 'o9sd6j9d30kukvljnhpwv5in73ljrmg95m5csl588917kp8s,master',
            'x-lc-id': 'uay57kigwe0b6f5n0e1d4z4xhydsml3dor24bzwvzr57wdap'
        },
        body:
        {
            from_peer: '1a',
            message: JSON.stringify(textMessage),
            conv_id: '58be1f5392509726c3dc1c8b',
            transient: false
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });
}