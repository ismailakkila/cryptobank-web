var React = require("react");
var {Modal, Loader} = require("semantic-ui-react");

var FixedVideoCall = require("./FixedVideoCall");
var StartCall = require("./StartCall");

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.localVideoRef = React.createRef();
    this.remoteVideoRef = React.createRef();
    this.state = {blur: false};
    this.updateMediaStreams = this.updateMediaStreams.bind(this);
    this.handleStartVideoCall = this.handleStartVideoCall.bind(this);
    this.handleStartAudioCall = this.handleStartAudioCall.bind(this);
    this.stopLocalStreams = this.stopLocalStreams.bind(this);
    this.setBlur = this.setBlur.bind(this);
  }

  setBlur(val) {
    this.setState({blur: val});
  }

  handleStartVideoCall() {
    var {collab, startCall} = this.props;
    this.stopLocalStreams();
    startCall(
      collab.webexClientTools,
      {
        destination: collab.cryptobankRep.email,
        options: {
          constraints: {
            audio: true,
            video: true
          }
        }
      },
      true
    )
  }

  handleStartAudioCall() {
    var {collab, startCall} = this.props;
    this.stopLocalStreams();
    collab.localMediaStream.getAudioTracks().forEach(function(audioTrack) {
      audioTrack.enabled = true;
    });
    startCall(
      collab.webexClientTools,
      {
        destination: collab.cryptobankRep.email,
        options: {
          constraints: {
            audio: true,
            video: false
          }
        }
      },
      true
    )
  }

  stopLocalStreams() {
    var {collab} = this.props;
    if (collab.localMediaStream) {
      collab.localMediaStream.getTracks().forEach(function(track) {
        track.stop();
        collab.localMediaStream.removeTrack(track);
      });
    }
  }

  updateMediaStreams() {
    var {collab, open, handleCloseVideoChat} = this.props;
    if (open) {
      if (collab.call) {
        if (collab.remoteMediaStream && collab.call.status === "connected" && collab.callType === "video") {
          if (this.remoteVideoRef.current.srcObject !== collab.remoteMediaStream) {
            this.remoteVideoRef.current.srcObject = collab.remoteMediaStream;
            this.setState({blur: false});
          }
        }
        if (collab.remoteMediaStream && collab.call.status === "connected" && collab.callType === "audio") {
          handleCloseVideoChat();
        }
      }
      else {
        if (collab.localMediaStream) {
          if (this.localVideoRef.current.srcObject !== collab.localMediaStream) {
            this.localVideoRef.current.srcObject = collab.localMediaStream;
            this.setState({blur: true});
          }
        }
      }
    }
    else {
      if (!collab.call) {
        this.stopLocalStreams();
      }
    }
  }

  componentWillUnmount() {
    var {handleDisconnectCall} = this.props;
    handleDisconnectCall();
  }

  componentDidUpdate() {
    this.updateMediaStreams();
  }

  render() {
    var {blur} = this.state;
    var {
      open,
      collab,
      startCall,
      handleDisconnectCall,
      handleCloseVideoChat,
      handleMuteAudio,
      handleUnmuteAudio,
      handleMuteVideo,
      handleUnmuteVideo,
      audioMuted,
      videoMuted
    } = this.props;
    var {localVideoRef, remoteVideoRef, handleStartVideoCall, handleStartAudioCall, setBlur} = this;

    var getIdleCallStatusComponent = function() {
        return (
          <StartCall
            blur={blur}
            videoRef={localVideoRef}
            handleStartVideoCall={handleStartVideoCall}
            handleStartAudioCall={handleStartAudioCall}
            setBlur={setBlur}
          />
        );
    };

    var getActiveCallStatusComponent = function() {
      if (collab.call) {
        switch(collab.call.status) {
          case "connected":
            if (collab.callType === "video") {
              return (
                <FixedVideoCall
                  videoRef={remoteVideoRef}
                  handleDisconnectCall={handleDisconnectCall}
                  handleMuteAudio={handleMuteAudio}
                  handleUnmuteAudio={handleUnmuteAudio}
                  handleMuteVideo={handleMuteVideo}
                  handleUnmuteVideo={handleUnmuteVideo}
                  audioMuted={audioMuted}
                  videoMuted={videoMuted}
                />
              );
            }
            break;
          case "initiated":
            return (
              <div style={{
                display: "flex",
                height: "90vh",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <Loader size="huge" content="Calling..." />
              </div>
            );
            break;
          case "ringing":
            return (
              <div style={{
                display: "flex",
                height: "90vh",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <Loader size="huge" content="Ringing..." />
              </div>
            );
            break;
          default:
            return null;
        }
      }
      return null;
    };

    var getStatusComponent = function() {
      if (collab.remoteMediaStream) {
        return getActiveCallStatusComponent();
      }
      else if (collab.localMediaStream) {
        return getIdleCallStatusComponent();
      }
      else {
        return (
          <div style={{
            display: "flex",
            height: "90vh",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <Loader size="huge" content="Video Chat Starting..." />
          </div>
        );
      }
    };

    return (
      <Modal
        open={open}
        onClose={handleCloseVideoChat}
        basic
        dimmer="blurring"
        size='fullscreen'
        closeOnDimmerClick={false}
        closeIcon={true}
      >
        <Modal.Content>
          {
            open
              ? getStatusComponent()
              : null
          }
        </Modal.Content>
        <Modal.Actions>
        </Modal.Actions>
      </Modal>
    );
  }
}

module.exports = Video;
