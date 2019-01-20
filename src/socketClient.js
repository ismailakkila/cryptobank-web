var socket = require("socket.io-client");
var subscriptions = ["cryptoPriceFeed"];

var {updateSocket} = require("./socketReducer");
var {updateCryptoPriceFeed} = require("./cryptoFeedReducer");
var {updateCollabSession} = require("./collabReducer");
var backendUrl = require("./backendUrl");

var socketConnectionTimeout = 10000;

var connect = function(dispatch) {
  return new Promise(function(resolve, reject) {
    var client = socket.connect(backendUrl);
    setTimeout(function() {
      reject("Socket connection timed after: " + socketConnectionTimeout + "ms");
    }, socketConnectionTimeout);
    client.on("connect", function() {
      updateSocket(client)(dispatch);
      subscriptions.forEach(function(subscription) {
        client.on(subscription, function(data) {
          updateCryptoPriceFeed(data)(dispatch);
        });
      });
      resolve(true);
      return;
    });
    client.on("cryptobankRepAssigned", function(data) {
      updateCollabSession(data)(dispatch);
    });
    client.on("roomAssigned", function(data) {
      updateCollabSession(data)(dispatch);
    });
    client.on("collabErr", function(data) {
      updateCollabSession(data)(dispatch);
    });
  });
};

module.exports = {
  connect: connect
};
