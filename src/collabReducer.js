var ciscosparkHelper = require("./ciscosparkHelper");

var UPDATECOLLABSESSION = "UPDATECOLLABSESSION";

var defaultState = {
  err: null,
  warn: null,
  cryptobankRep: null,
  roomId: null,
  botId: null,
  guestId: null,
  webexClientTools: null,
  chats: [],
  call: null,
  localMediaStream: null,
  remoteMediaStream: null,
  callType: null
};

var updateCollabSessionActionCreator = function(session) {
  return  {
    type: UPDATECOLLABSESSION,
    session: session
  };
};

var collabReducer = function(state=defaultState, action) {
  switch(action.type) {
    case UPDATECOLLABSESSION:
      return Object.assign({}, state, action.session);
    default:
      return state;
  }
};

var updateCollabSession = function(session) {
  return function(dispatch) {
    dispatch(updateCollabSessionActionCreator(session));
  };
};

var createCollabSession = function(socket, jwt, dispatchWarning=false) {
  return function(dispatch) {
    return ciscosparkHelper(jwt, socket)
      .then(function(webexClientTools) {
        dispatch(updateCollabSessionActionCreator({
          webexClientTools: webexClientTools,
          guestId: webexClientTools.guestId
        }));
        socket.emit("createCollabSession", webexClientTools.guestId);
        return true;
      })
      .catch(function(err) {
        if (dispatchWarning) {
          dispatch(updateCollabSessionActionCreator({warn: {type: "initialization", description: err}}));
        }
        else {
          dispatch(updateCollabSessionActionCreator({err: {type: "initialization", description: err}}));
        }
      });
  };
};

var getMessages = function(webexClientTools, params, dispatchWarning=false) {
  return function(dispatch) {
    return webexClientTools.getMessages(params)
      .then(function(chats) {
        dispatch(updateCollabSessionActionCreator({chats: chats}));
        return true;
      })
      .catch(function(err) {
        if (dispatchWarning) {
          dispatch(updateCollabSessionActionCreator({warn: {type: "chat", description: err}}));
        }
        else {
          dispatch(updateCollabSessionActionCreator({err: {type: "chat", description: err}}));
        }
      });
  };
};

var sendMessage = function(webexClientTools, params, dispatchWarning=false) {
  return function(dispatch) {
    return webexClientTools.sendMessage(params)
      .then(function(message) {
        return true;
      })
      .catch(function(err) {
        if (dispatchWarning) {
          dispatch(updateCollabSessionActionCreator({warn: {type: "chat", description: err}}));
        }
        else {
          dispatch(updateCollabSessionActionCreator({err: {type: "chat", description: err}}));
        }
      });
  };
};

var startVideoChat = function(webexClientTools, dispatchWarning=false) {
  return function(dispatch) {
    return webexClientTools.register(dispatch, updateCollabSessionActionCreator)
      .then(function() {
        return true;
      })
      .catch(function(err) {
        if (dispatchWarning) {
          dispatch(updateCollabSessionActionCreator({warn: {type: "video", description: err}}));
        }
        else {
          dispatch(updateCollabSessionActionCreator({err: {type: "video", description: err}}));
        }
      });
  };
};

var startCall = function(webexClientTools, params, dispatchWarning=false) {
  return function(dispatch) {
    return webexClientTools.call(
      params.destination,
      params.options,
      dispatch,
      updateCollabSessionActionCreator
    )
      .then(function() {
        return true;
      })
      .catch(function(err) {
        if (dispatchWarning) {
          dispatch(updateCollabSessionActionCreator({warn: {type: "video", description: err}}));
        }
        else {
          dispatch(updateCollabSessionActionCreator({err: {type: "video", description: err}}));
        }
      });
  };
};

module.exports = {
  collabReducer: collabReducer,
  createCollabSession: createCollabSession,
  updateCollabSession: updateCollabSession,
  getMessages: getMessages,
  sendMessage: sendMessage,
  startVideoChat: startVideoChat,
  startCall: startCall
};
