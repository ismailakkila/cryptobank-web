var React = require("react");
var {Button, Icon, Dimmer, Segment, Container, Transition} = require("semantic-ui-react");

var CallButtons = function(props) {
  var {
    showCollabControls,
    audioMuted,
    videoMuted,
    handleUnmuteAudio,
    handleMuteAudio,
    handleUnmuteVideo,
    handleMuteVideo,
    handleDisconnectCall
  } = props;
  return (
    <Transition visible={showCollabControls} mountOnShow={true} animation='scale' duration={500}>
       <div style={{
         zIndex: 1001,
         textAlign: "center",
         position: "absolute",
         display: "block",
         bottom: "30px",
         width: "100%"
       }}>
       {
         audioMuted
         ?
          (
            <Button
              style={{
                opacity: "0.9",
                margin: "6px"
              }}
              onClick={handleUnmuteAudio}
              circular
              icon='mute'
              color="red"
              size="huge"
            />
          )
         :
          (
            <Button
              style={{
                opacity: "0.9",
                margin: "6px"
              }}
              onClick={handleMuteAudio}
              circular
              icon='mute'
              primary
              size="huge"
            />
          )
        }
        {
          videoMuted
          ?
           (
             <Button
               style={{
                 opacity: "0.9",
                 margin: "6px"
               }}
               onClick={handleUnmuteVideo}
               circular
               icon='video camera'
               color="red"
               size="huge"
             />
           )
          :
           (
             <Button
               style={{
                 opacity: "0.9",
                 margin: "6px"
               }}
               onClick={handleMuteVideo}
               circular
               icon='video camera'
               primary
               size="huge"
             />
           )
         }
           <Button
             style={{
               opacity: "0.9",
               margin: "6px"
             }}
             onClick={handleDisconnectCall}
             circular
             icon='close'
             color="red"
             size="huge"
           />
       </div>
     </Transition>
  )
};

class FixedVideoCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showCollabControls: false, audioMuted: false, videoMuted: false};
    this.handleVideoMouseEnter = this.handleVideoMouseEnter.bind(this);
    this.handleVideoMouseLeave = this.handleVideoMouseLeave.bind(this);
  }

  handleVideoMouseEnter() {
    this.setState({showCollabControls: true});
  }

  handleVideoMouseLeave() {
    this.setState({showCollabControls: false});
  }

  render() {
    var {showCollabControls} = this.state;
    var {
      videoRef,
      handleDisconnectCall,
      handleMuteAudio,
      handleUnmuteAudio,
      handleMuteVideo,
      handleUnmuteVideo,
      audioMuted,
      videoMuted
    } = this.props;
    return (
      <Segment
        onMouseEnter={this.handleVideoMouseEnter}
        onMouseLeave={this.handleVideoMouseLeave}
        style={{
          display: "flex",
          height: "90vh",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Container
          style={{
            borderRadius: "15px",
            display: "flex",
            maxHeight: "100%",
            width: "100%",
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <video
            style={{
              minWidth: "100%",
            }}
            ref={videoRef}
            autoPlay
          />
          <CallButtons
            showCollabControls={showCollabControls}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            handleUnmuteAudio={handleUnmuteAudio}
            handleMuteAudio={handleMuteAudio}
            handleUnmuteVideo={handleUnmuteVideo}
            handleMuteVideo={handleMuteVideo}
            handleDisconnectCall={handleDisconnectCall}
          />
        </Container>
      </Segment>
    );
  }
}

module.exports = FixedVideoCall;
