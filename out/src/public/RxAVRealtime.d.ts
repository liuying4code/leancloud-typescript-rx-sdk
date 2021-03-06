import { Observable, Subject } from 'rxjs';
import { IRxWebSocketController } from '../internal/websocket/controller/IRxWebSocketController';
export declare class RxAVRealtime {
    private static singleton;
    static readonly instance: RxAVRealtime;
    readonly RxWebSocketController: IRxWebSocketController;
    messages: Subject<RxAVIMMessage>;
    pushRouterState: any;
    clientId: string;
    /**
     * 打开与 Push Server 的 WebSocket
     *
     * @returns {Observable<boolean>}
     *
     * @memberOf RxAVRealtime
     */
    open(): Observable<boolean>;
    /**
     * 客户端打开聊天 v2 协议
     *
     * @param {string} clientId 当前客户端应用内唯一标识
     * @returns {Observable<boolean>}
     *
     * @memberOf RxAVRealtime
     */
    connect(clientId: string): Observable<boolean>;
    /**
     *
     *
     * @param {string} convId
     * @param {{ [key: string]: any }} data
     * @returns
     *
     * @memberOf RxAVRealtime
     */
    send(convId: string, data: {
        [key: string]: any;
    }): Observable<IRxAVIMMessage>;
    private _makeText(data);
    private _makeImage(data);
    private _makeArrtributes(msg, data);
    private _send(convId, iMessage, tr?, r?, level?);
    private sendAck(convId, msgId?, fromts?, tots?);
    private makeCommand();
    private idSeed;
    private cmdIdAutomation();
    readonly cmdId: number;
}
export interface IRxAVIMMessage {
    convId: string;
    id: string;
    from: string;
    timestamp: number;
    content: string;
    offline: boolean;
    deserialize(data: any): any;
    serialize(): string;
    validate(): boolean;
}
export declare class RxAVIMMessage implements IRxAVIMMessage {
    convId: string;
    id: string;
    from: string;
    timestamp: number;
    content: string;
    offline: boolean;
    deserialize(data: any): void;
    serialize(): string;
    validate(): boolean;
    toJson(): any;
    static initValidators(): void;
    static validators: Array<(msgMap: any, dataMapRef: any) => boolean>;
}
