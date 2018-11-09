cordova.define("cordova-jwplayer.CordovaJWPlayer", function(require, exports, module) {
var exec = require('cordova/exec');

exports.setup = function(config, playlist, success, error) {
    exec(success, error, "CordovaJWPlayer", "setup", [config, playlist]);
};

exports.setPlaylist = function(playlist, success, error) {
    exec(success, error, "CordovaJWPlayer", "setJWPlaylist", [playlist]);
};

exports.play = function(index, success, error) {
    exec(success, error, "CordovaJWPlayer", "play", [index]);
};

exports.onPlay = function(success) {
    exec(success, success, "CordovaJWPlayer", "bindAction", ["onPlay"]);
};

exports.onFullscreen = function(success) {
    exec(success, success, "CordovaJWPlayer", "bindAction", ["onFullscreen"]);
};
});
