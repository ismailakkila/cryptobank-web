var React = require("react");
var {Button, Dimmer, Header, Icon, Segment, Container} = require("semantic-ui-react");

var StartCall = function(props) {
  var {blur, videoRef, handleStartVideoCall, handleStartAudioCall, setBlur} = props;
  return (
    <Segment style={{
      display: "flex",
      height: "90vh",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <Header
        as='h2'
        content='Start Your Call'
        style={{
          fontSize: '1.7em',
          fontWeight: 'bold',
          margin: '1em',
        }}
      />
      <Dimmer.Dimmable
        as={Container}
        blurring
        dimmed={blur}
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
            minWidth: "100%"
          }}
          ref={videoRef}
          autoPlay
        />
      </Dimmer.Dimmable>
      <Button.Group
        size='large'>
        <Button
          onClick={handleStartVideoCall}
          onMouseEnter={()=>setBlur(false)}
          onMouseLeave={()=>setBlur(true)}
          style={{height: "40px", margin: "1em"}}
          size='huge'
          primary
        >
          <Icon name='video camera' /> Start with video
        </Button>
        <Button.Or />
        <Button
          onClick={handleStartAudioCall}
          style={{height: "40px", margin: "1em"}}
          size='huge'
        >
          <Icon name='microphone' /> voice
        </Button>
      </Button.Group>
    </Segment>
  );
};

module.exports = StartCall;
