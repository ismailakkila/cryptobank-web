var React = require("react");
var {Button, Segment, Icon, Transition} = require("semantic-ui-react");
var Draggable = require('react-draggable');

var CallButtons = function(props) {
  var {
    showCollabControls,
    audioMuted,
    videoMuted,
    handleMuteAudio,
    handleUnmuteAudio,
    handleMuteVideo,
    handleUnmuteVideo,
    handleDisconnectCall
  } = props;
  return (
    <Transition visible={showCollabControls} mountOnShow={true} animation='scale' duration={500}>
       <div style={{
         zIndex: 1001,
         textAlign: "center",
         position: "absolute",
         display: "block",
         bottom: "10px",
         width: "100%"
       }}>
       {
         audioMuted
         ?
          (
            <Button
              style={{
                opacity: "0.9",
                margin: "3px"
              }}
              onClick={handleUnmuteAudio}
              circular
              icon='mute'
              color="red"
            />
          )
         :
          (
            <Button
              style={{
                opacity: "0.9",
                margin: "3px"
              }}
              onClick={handleMuteAudio}
              circular
              icon='mute'
              primary
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
                 margin: "3px"
               }}
               onClick={handleUnmuteVideo}
               circular
               icon='video camera'
               color="red"
             />
           )
          :
           (
             <Button
               style={{
                 opacity: "0.9",
                 margin: "3px"
               }}
               onClick={handleMuteVideo}
               circular
               icon='video camera'
               primary
             />
           )
         }
           <Button
             style={{
               opacity: "0.9",
               margin: "3px"
             }}
             onClick={handleDisconnectCall}
             circular
             icon='close'
             color="red"
           />
       </div>
     </Transition>
  )
};

class FloatingVideoCall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showCollabControls: false};
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
      videoMuted} = this.props;
    return (
      <Draggable>
        <Segment
          onMouseEnter={this.handleVideoMouseEnter}
          onMouseLeave={this.handleVideoMouseLeave}
          raised
          style={{
          zIndex: 1000,
          position: "absolute",
          maxWidth: "480px",
          top: "10px",
          left: "10px",
          padding: "0.1em",
          borderRadius: "15px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
        >
          <video
            style={{
              borderRadius: "15px",
              width: "100%",
              height: "auto"
            }}
            ref={videoRef}
            autoPlay
          />
          <CallButtons
            showCollabControls={showCollabControls}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            handleMuteAudio={handleMuteAudio}
            handleUnmuteAudio={handleUnmuteAudio}
            handleMuteVideo={handleMuteVideo}
            handleUnmuteVideo={handleUnmuteVideo}
            handleDisconnectCall={handleDisconnectCall}
          />
        </Segment>
      </Draggable>
    );
  }
}

module.exports = FloatingVideoCall
