import { HttpRequest } from './httpClient/HttpRequest';
import { IRxHttpClient } from './httpClient/iRxHttpClient';
import { IAVCommandRunner } from './command/IAVCommandRunner';
import { iObjectController } from './object/controller/iObjectController';
import { IUserController } from './user/controller/iUserController';
import { ILeanEngineController } from './LeanEngine/controller/ILeanEngineController';
import { IAVEncoder } from './encoding/IAVEncoder';
import { IAVDecoder } from './encoding/IAVDecoder';
import { IAVObjectDecoder } from './encoding/IAVObjectDecoder';
import { ILeanEngineDecoder } from './LeanEngine/encoding/ILeanEngineDecoder';
export declare class SDKPlugins {
    private _version;
    private _HttpClient;
    private _CommandRunner;
    private _ObjectController;
    private _UserController;
    private _LeanEngineController;
    private _encoder;
    private _decoder;
    private _objectdecoder;
    private _LeanEngineDecoder;
    private static _sdkPluginsInstance;
    constructor(version?: number);
    readonly HttpClient: IRxHttpClient;
    readonly CommandRunner: IAVCommandRunner;
    readonly ObjectControllerInstance: iObjectController;
    readonly UserControllerInstance: IUserController;
    readonly LeanEngineControllerInstance: ILeanEngineController;
    generateAVCommand(relativeUrl: string, method: string, data: {
        [key: string]: any;
    }): HttpRequest;
    readonly Encoder: IAVEncoder;
    readonly Decoder: IAVDecoder;
    readonly ObjectDecoder: IAVObjectDecoder;
    readonly LeanEngineDecoder: ILeanEngineDecoder;
    static readonly instance: SDKPlugins;
    static version: number;
}
