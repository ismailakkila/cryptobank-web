var ciscospark = require("ciscospark");

var initializeCiscosparkClient = function(jwt) {
  return new Promise(function(resolve, reject) {
    var teams = ciscospark.init();
    teams.once("ready", function() {
      teams.authorization.requestAccessTokenFromJwt({jwt: jwt})
        .then(function() {
          return teams.rooms.create({title: 'test'})
        })
        .then(function(room) {
          resolve({teams: teams, guestId: room.creatorId});
        })
        .catch(function(err) {
          reject("Unable to initialize cisco spark client");
        });
    });
  });
};

var getMessages = function(teamsInstance, socket) {
  return function(params) {
    return teamsInstance.messages.list({
      roomId: params.roomId,
      max: params.max
    })
    .then(function(chats) {
      return chats.items;
    })
    .catch(function(err) {
      throw err;
    });
  };
};

var sendMessage = function(teamsInstance, socket) {
  return function(params) {
    return teamsInstance.messages.create({
      text: params.text,
      roomId: params.roomId
    })
    .then(function(message) {
      socket.emit("guestSendChat", params.roomId);
      return true;
    })
    .catch(function(err) {
      throw err;
    })
  }
};

var register = function(teamsInstance, socket) {

  return function(dispatch, actionCreator) {
    return teamsInstance.phone.register()
      .then(function() {
        return teamsInstance.phone.createLocalMediaStream();
      })
      .then(function(localMediaStream) {
        localMediaStream.getAudioTracks().forEach(function(audioTrack) {
          audioTrack.enabled = false;
        });
        socket.emit("guestWebexRegistered");
        dispatch(actionCreator({
          call: null,
          localMediaStream: localMediaStream
        }));
      })
      .catch(function(err) {
        throw err;
      });
  }
};

var call = function(teamsInstance, socket) {
  return function(destination, options, dispatch, actionCreator) {
    return new Promise(function(resolve, reject) {
      var getCallType = function(mediaStream) {
        var isVideo = mediaStream.getVideoTracks().length > 0;
        if (isVideo) {
          return "video";
        }
        return "audio";
      };

      var bindCallEvents = function(call) {
        call.on(`error`, function(err) {
          throw err;
        });
        call.on(`localMediaStream:change`, function() {
          dispatch(actionCreator({localMediaStream: call.localMediaStream}));
        });
        call.on(`remoteMediaStream:change`, function() {
          dispatch(actionCreator({
            callType: getCallType(call.remoteMediaStream),
            remoteMediaStream: call.remoteMediaStream
          }));
        });
        call.on(`disconnected`, function() {
          socket.emit("guestDisconnectCall", destination);
          call.localMediaStream.getTracks().forEach(function(track) {
            track.stop();
            call.localMediaStream.removeTrack(track);
          });
          call = undefined;
          dispatch(actionCreator({
            call: undefined,
            remoteMediaStream: null,
            localMediaStream: null
          }));
          setTimeout(function() {
            dispatch(actionCreator({
              call: null
            }));
          }, 100);
        });
      };

      var callType = "audio";
      if (options.constraints.video) {
        callType = "video";
      }
      var call = teamsInstance.phone.dial(destination, options);
      if (call) {
        socket.emit("guestInitiateCall", destination);
        dispatch(actionCreator({
          call: call,
          callType: callType
        }));
        bindCallEvents(call);
        resolve(true);
      }
      else {
        reject("Unable to place call");
      }
    });
  }
};

module.exports = function(jwt, socket) {
  return initializeCiscosparkClient(jwt)
    .then(function(teamsInstance) {
      return {
        getMessages: getMessages(teamsInstance.teams, socket),
        sendMessage: sendMessage(teamsInstance.teams, socket),
        register: register(teamsInstance.teams, socket),
        call: call(teamsInstance.teams, socket),
        guestId: teamsInstance.guestId
      };
    })
    .catch(function(err) {
      throw err;
    });
};
