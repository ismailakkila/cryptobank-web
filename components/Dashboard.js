var React = require("react");
var {Menu, Container, Button, Segment, Header, Icon, Sidebar, Transition} = require("semantic-ui-react");

var CryptoCardGroup = require("./CryptoCardGroup");
var CryptoPortfolio = require("./CryptoPortfolio");
var Collaboration = require("./Collaboration");
var FloatingVideoCall = require("./FloatingVideoCall");

var BTCBALANCE = 3.678;
var ETHBALANCE = 32;
var LTCBALANCE = 56;
var XRPBALANCE = 2476;

var cryptoBalances = {
  BTC: BTCBALANCE,
  ETH: ETHBALANCE,
  LTC: LTCBALANCE,
  XRP: XRPBALANCE
};

var initialCryptoFeed = [
  {
    cryptoName: "Bitcoin",
    cryptoTicker: "BTC",
    cryptoPrice: ""
  },
  {
    cryptoName: "Ethereum",
    cryptoTicker: "ETH",
    cryptoPrice: ""
  },
  {
    cryptoName: "Litecoin",
    cryptoTicker: "LTC",
    cryptoPrice: ""
  },
  {
    cryptoName: "Ripple",
    cryptoTicker: "XRP",
    cryptoPrice: ""
  }
];

var cryptoPortfolioData = [
  {
    crypto
  }
];

var MenuBar = function(props) {
  var {user, handleLoginClick, logout, collab} = props;
  return (
    <Menu
      fixed={'top'}
      inverted={true}
      secondary={true}
      pointing={true}
      size='large'
    >
      <Container>
        {
          collab.call
          ?
            (
              <Menu.Item disabled>
                Home
              </Menu.Item>
            )
          :
            (
              <Menu.Item as='a' href="/" active>
                Home
              </Menu.Item>
            )
        }
        <Menu.Item position='right'>
          <Button
            onClick={handleLoginClick}
            as='a'
            inverted={true}
          >
            {user.user.username}
          </Button>
          <Button
            onClick={logout}
            as='a'
            inverted={true}
            style={{ marginLeft: '0.5em' }}
          >
            Log Out
          </Button>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

var Heading = function() {
  return (
    <Container text>
      <Header
        as='h1'
        content='CryptoBank'
        inverted
        style={{
          fontSize: '1.5em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '2em',
        }}
      />
      <Icon size="large" name="bitcoin" />
    </Container>
  );
};

var getCryptoPortfolioData = function(cryptoFeed) {
  return cryptoFeed.map(function(crypto) {
    return Object.assign({}, crypto, {
      cryptoBalance: Number(cryptoBalances[crypto.cryptoTicker]),
      cryptoPrice: Number(crypto.cryptoPrice.split(" ")[1]),
    });
  });
};

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.remoteVideoRef = React.createRef();
    this.remoteAudioRef = React.createRef();
    this.state = {
      showCollab: false,
      openVideoModal: false,
      audioMuted: false,
      videoMuted: false
    };
    this.handleShowCollab = this.handleShowCollab.bind(this);
    this.handleHideCollab = this.handleHideCollab.bind(this);
    this.handleStartVideoChat = this.handleStartVideoChat.bind(this);
    this.handleCloseVideoChat = this.handleCloseVideoChat.bind(this);
    this.handleDisconnectCall = this.handleDisconnectCall.bind(this);
    this.handleMuteAudio = this.handleMuteAudio.bind(this);
    this.handleUnmuteAudio = this.handleUnmuteAudio.bind(this);
    this.handleMuteVideo = this.handleMuteVideo.bind(this);
    this.handleUnmuteVideo = this.handleUnmuteVideo.bind(this);
  }

  componentDidUpdate() {
    var {collab} = this.props;
    var {audioMuted, videoMuted} = this.state;
    var {showCollab, openVideoModal} = this.state;
    if (openVideoModal) {
      if (collab.call === undefined) {
        this.setState({
          openVideoModal: false,
          audioMuted: false,
          videoMuted: false
        });
      }
    }
    else {
      if (collab.call === undefined) {
        if (audioMuted || videoMuted) {
          this.setState({
            audioMuted: false,
            videoMuted: false
          });
        }
      }
      if (collab.call) {
        if (collab.call.status === "connected" && collab.remoteMediaStream) {
          if (collab.callType === "video") {
            if (this.remoteVideoRef.current.srcObject !== collab.remoteMediaStream) {
              this.remoteVideoRef.current.srcObject = collab.remoteMediaStream;
            }
          }
          if (collab.callType === "audio") {
            if (this.remoteAudioRef.current.srcObject !== collab.remoteMediaStream) {
              this.remoteAudioRef.current.srcObject = collab.remoteMediaStream;
            }
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.handleDisconnectCall();
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

  handleStartVideoChat() {
    var {collab, startVideoChat} = this.props;
    this.setState({openVideoModal: true});
    if (!collab.call) {
      startVideoChat(collab.webexClientTools)
      .then(function() {
        console.log("Registered with Webex");
      });
    }
  }

  handleCloseVideoChat() {
    this.setState({openVideoModal: false});
  }

  handleShowCollab() {
    this.setState({showCollab: true});
  }

  handleHideCollab() {
    this.setState({showCollab: false});
  }

  handleDisconnectCall() {
    var {collab} = this.props;
    if (collab.call) {
      if (collab.call.status === "connected") {
        collab.call.hangup();
      }
    }
  }

  handleMuteAudio() {
    var {collab} = this.props;
    if (collab.call && collab.localMediaStream) {
      if (collab.call.status === "connected" && collab.remoteMediaStream) {
        collab.localMediaStream.getAudioTracks()[0].enabled = false;
        this.setState({audioMuted: true});
      }
    }
  }

  handleUnmuteAudio() {
    var {collab} = this.props;
    if (collab.call && collab.localMediaStream) {
      if (collab.call.status === "connected" && collab.remoteMediaStream) {
        collab.localMediaStream.getAudioTracks()[0].enabled = true;
        this.setState({audioMuted: false});
      }
    }
  }

  handleMuteVideo() {
    var {collab} = this.props;
    if (collab.call && collab.localMediaStream) {
      if (collab.call.status === "connected" && collab.remoteMediaStream) {
        collab.localMediaStream.getVideoTracks()[0].enabled = false;
        this.setState({videoMuted: true});
      }
    }
  }

  handleUnmuteVideo() {
    var {collab} = this.props;
    if (collab.call && collab.localMediaStream) {
      if (collab.call.status === "connected" && collab.remoteMediaStream) {
        collab.localMediaStream.getVideoTracks()[0].enabled = true;
        this.setState({videoMuted: false});
      }
    }
  }

  render() {
    var {user, socket, collab, cryptoFeed, handleLoginClick, logout, createCollabSession, getMessages, sendMessage, startVideoChat, startCall} = this.props;
    var {showCollab, openVideoModal, audioMuted, videoMuted} = this.state;
    return (
      <div>
        <Sidebar.Pushable style={{height: "100vh"}} as={Segment}>
          <Collaboration
            visible={showCollab}
            openVideoModal={openVideoModal}
            handleHideCollab={this.handleHideCollab}
            handleShowCollab={this.handleShowCollab}
            handleStartVideoChat={this.handleStartVideoChat}
            handleCloseVideoChat={this.handleCloseVideoChat}
            handleDisconnectCall={this.handleDisconnectCall}
            handleMuteAudio={this.handleMuteAudio}
            handleUnmuteAudio={this.handleUnmuteAudio}
            handleMuteVideo={this.handleMuteVideo}
            handleUnmuteVideo={this.handleUnmuteVideo}
            user={user}
            socket={socket}
            collab={collab}
            createCollabSession={createCollabSession}
            getMessages={getMessages}
            sendMessage={sendMessage}
            startVideoChat={startVideoChat}
            startCall={startCall}
            audioMuted={audioMuted}
            videoMuted={videoMuted}
            raised
          />
          <Sidebar.Pusher dimmed={showCollab}>
            <Segment
              inverted
              textAlign='center'
              style={{padding: '1em 0em' }}
              vertical
            >
              <MenuBar
                user={user}
                collab={collab}
                handleLoginClick={handleLoginClick}
                logout={logout}
              />
              <Heading />
            </Segment>
            <CryptoCardGroup cryptoFeed={cryptoFeed} />
            <CryptoPortfolio cryptoPortfolio={cryptoFeed.length < 4 ? getCryptoPortfolioData(initialCryptoFeed) : getCryptoPortfolioData(cryptoFeed)} />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        {
          showCollab
            ? null
            :
              (
                <Transition transitionOnMount={true} animation="bounce" duration={1000}>
                  <Button
                    onClick={this.handleShowCollab}
                    style={{position: "fixed", right: "2em", bottom: "2em"}}
                    color= "blue"
                    size="huge"
                    circular
                    icon={"chat"}
                  />
                </Transition>
              )
        }
        {
          openVideoModal
            ? null
            : !collab.call
              ? null
              : collab.call.status === "connected" && collab.remoteMediaStream
                ? collab.callType === "video"
                  ?
                   (
                     <FloatingVideoCall
                       videoRef={this.remoteVideoRef}
                       handleDisconnectCall={this.handleDisconnectCall}
                       handleMuteAudio={this.handleMuteAudio}
                       handleUnmuteAudio={this.handleUnmuteAudio}
                       handleMuteVideo={this.handleMuteVideo}
                       handleUnmuteVideo={this.handleUnmuteVideo}
                       audioMuted={audioMuted}
                       videoMuted={videoMuted}
                     />
                   )
                  : collab.callType === "audio"
                    ?
                      (
                        <audio
                          style={{display: "none"}}
                          ref={this.remoteAudioRef}
                          autoPlay
                        />
                      )
                    : null
                : null
        }
      </div>
    );
  }
}

module.exports = Dashboard;
