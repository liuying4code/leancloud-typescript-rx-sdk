"use strict";
var AVCommand_1 = require('../../command/AVCommand');
var SDKPlugins_1 = require('../../SDKPlugins');
var UserController = (function () {
    function UserController(commandRunner) {
        this._commandRunner = commandRunner;
    }
    UserController.prototype.signUp = function (state, dictionary) {
        var encoded = SDKPlugins_1.SDKPlugins.instance.Encoder.encode(dictionary);
        var cmd = new AVCommand_1.AVCommand({
            relativeUrl: "/users",
            method: 'POST',
            data: encoded
        });
        return this._commandRunner.runRxCommand(cmd).map(function (res) {
            var serverState = SDKPlugins_1.SDKPlugins.instance.ObjectDecoder.decode(res.body, SDKPlugins_1.SDKPlugins.instance.Decoder);
            serverState = serverState.mutatedClone(function (s) {
                s.isNew = true;
            });
            return serverState;
        });
    };
    UserController.prototype.logIn = function (username, password) {
        return null;
    };
    UserController.prototype.logInWithParamters = function (relativeUrl, data) {
        return null;
    };
    UserController.prototype.getUser = function (sessionToken) {
        return null;
    };
    return UserController;
}());
exports.UserController = UserController;