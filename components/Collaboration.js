var React = require("react");
var {Sidebar, Segment, Header, Button, Container, Form, Loader, Image, Message, Icon, Feed} = require("semantic-ui-react");

var ChatMessages = require("./ChatMessages");
var Video = require("./Video");

class Collaboration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      webexTeamsClientStatus: null,
      webexTeamsServerStatus: null,
      webexTeamsNotAvailable: false,
      chatMessage: ""
    };
    this.resetState = this.resetState.bind(this);
    this.handleStartCollab = this.handleStartCollab.bind(this);
    this.handleChatBox = this.handleChatBox.bind(this);
    this.handleAddReply = this.handleAddReply.bind(this);
  }

  resetState() {
    this.setState({
      loading: true,
      webexTeamsClientStatus: null,
      webexTeamsServerStatus: null,
      webexTeamsNotAvailable: false,
      chatMessage: ""
    });
  }

  handleChatBox(e) {
    this.setState({chatMessage: e.target.value});
  }

  handleAddReply() {
    var {collab, sendMessage} = this.props;
    var {chatMessage} = this.state;
    if (chatMessage) {
      sendMessage(collab.webexClientTools, {
        text: chatMessage,
        roomId: collab.roomId
      }, true)
      .then(function() {
        this.setState({chatMessage: ""});
      }.bind(this));
    }
  }

  handleStartCollab() {
    var {webexTeamsClientStatus, webexTeamsServerStatus, webexTeamsNotAvailable} = this.state;
    var {socket, user, createCollabSession, collab} = this.props;

    if (socket.connected && user.webexTeamsToken) {
      if (
        webexTeamsServerStatus === null &&
        webexTeamsClientStatus === null &&
        webexTeamsNotAvailable === false
      ) {
        createCollabSession(socket, user.webexTeamsToken)
          .then(function() {
            if (webexTeamsNotAvailable === false) {
              setTimeout(function() {
                this.setState({
                  webexTeamsClientStatus: "in-progress",
                  webexTeamsServerStatus: "in-progress"
                });
              }.bind(this), 2500);
            }
          }.bind(this));
      }
    }
    else {
      this.setState({
        loading: false,
        webexTeamsNotAvailable: true,
        webexTeamsClientStatus: null,
        webexTeamsServerStatus: null
      });
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  componentDidMount() {
    setInterval(function() {
      var {webexTeamsClientStatus, webexTeamsServerStatus, loading, webexTeamsNotAvailable} = this.state;
      var {collab, getMessages} = this.props;
      if (
          webexTeamsNotAvailable === false &&
          webexTeamsServerStatus === "ready" &&
          webexTeamsClientStatus === "ready" &&
          !loading &&
          collab.chats.length > 0
        ) {
        getMessages(collab.webexClientTools, {roomId: collab.roomId, max: 100}, true);
      }
    }.bind(this), 2500);
  }

  componentDidUpdate() {
    var {webexTeamsClientStatus, webexTeamsServerStatus, loading, webexTeamsNotAvailable} = this.state;
    var {collab, getMessages} = this.props;

    if (collab.err !== null && webexTeamsNotAvailable === false) {
      this.setState({
        loading: false,
        webexTeamsNotAvailable: true,
        webexTeamsClientStatus: null,
        webexTeamsServerStatus: null
      });
      return;
    }
    else {
      if (collab.warn !== null) {
        console.error(collab.warn);
        return;
      }
      if (
          collab.webexClientTools !== null &&
          collab.guestId !== null &&
          webexTeamsClientStatus === "in-progress"
        ) {
        this.setState({webexTeamsClientStatus: "ready"});
        return;
      }
      if (
          collab.cryptobankRep !== null &&
          collab.roomId !== null &&
          collab.botId !== null &&
          webexTeamsServerStatus === "in-progress"
        ) {
        this.setState({webexTeamsServerStatus: "ready"});
        return;
      }
      if (
        webexTeamsNotAvailable === false &&
        webexTeamsClientStatus === "ready" &&
        webexTeamsServerStatus === "ready" &&
        loading
      ) {
        getMessages(collab.webexClientTools, {roomId: collab.roomId, max: 100})
          .then(function() {
            this.setState({loading: false});
          }.bind(this));
          return;
      }
    }
  }

  render() {
    var {
      visible,
      collab,
      openVideoModal,
      handleHideCollab,
      handleStartVideoChat,
      handleCloseVideoChat,
      startCall,
      handleDisconnectCall,
      handleMuteAudio,
      handleUnmuteAudio,
      handleMuteVideo,
      handleUnmuteVideo,
      audioMuted,
      videoMuted
    } = this.props;
    var {loading, webexTeamsNotAvailable, chatMessage} = this.state;
    return (
      <div>
        <Sidebar
          as={Container}
          onVisible={this.handleStartCollab}
          animation="overlay"
          visible={visible}
          width="very wide"
          direction="right"
          style={{
            height: "100%",
            padding: "1em",
            backgroundColor: "white"
          }}
          >
          <div>
            <Header as='h3' dividing>
              <Header.Content>Chat</Header.Content>
              <Icon
                style={{float: "right"}}
                onClick={handleHideCollab}
                name='window close'
                color="blue"
              />
            </Header>
          </div>
          {
            loading
              ?
                (
                  <Segment style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  >
                    <Image src='/images/logo/ciscoWebexTeams.png' size='small' circular />
                    <Loader active inline="centered" size='medium'>Loading Chat...</Loader>
                  </Segment>
                )
              : webexTeamsNotAvailable
                ?
                  (
                    <Segment style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    >
                      <Image src='/images/logo/ciscoWebexTeams.png' size='small' circular />
                      <Message negative>
                        <Message.Header>Service Not Available</Message.Header>
                      </Message>
                    </Segment>
                  )
                :
                  (
                    <div style={{
                      height: "94%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-start",
                    }}
                    >
                      <ChatMessages collab={collab} />
                      <div
                        style={{
                          display: "flex",
                          padding: "2em",
                          justifyContent: "flex-start",
                          alignItems: "flex-end",
                          width: "100%",
                          minHeight: "175px"
                        }}
                      >
                        <Form style={{width: "100%"}} reply>
                          <Form.TextArea
                            style={{resize: "none"}}
                            value={chatMessage}
                            onChange={(e)=>this.handleChatBox(e)}
                          />
                          <Button
                            onClick={this.handleAddReply}
                            content='Add Reply'
                            labelPosition='left'
                            icon='edit'
                            primary
                            disabled={!chatMessage}
                          />
                          {
                            collab.call && collab.callType === "audio"
                              ? null
                              :
                                (
                                  <Button
                                    content='Video Chat'
                                    onClick={handleStartVideoChat}
                                    labelPosition='left'
                                    icon='video camera'
                                    primary
                                  />
                                )
                          }
                        </Form>
                      </div>
                      {
                        collab.call && collab.callType === "audio"
                          ?
                            (
                              <Segment
                                color="blue"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  width: "100%",
                                  minHeight: "60px"
                                }}
                              >
                                <Feed size="small">
                                  <Feed.Event>
                                    <Feed.Label>
                                      <img src={"/images/agent/agent" + collab.cryptobankRep.agentId + ".jpg"} />
                                    </Feed.Label>
                                    <Feed.Content>
                                      Voice call with <Feed.User>{collab.cryptobankRep.displayName}</Feed.User>
                                    </Feed.Content>
                                  </Feed.Event>
                                </Feed>
                                <Button.Group>
                                  {
                                    audioMuted
                                      ?
                                        (
                                          <Button onClick={handleUnmuteAudio} color="red" icon>
                                            <Icon name='mute' />
                                          </Button>
                                        )
                                      :
                                        (
                                          <Button onClick={handleMuteAudio} color="blue" basic icon>
                                            <Icon name='mute' />
                                          </Button>
                                        )
                                  }
                                  <Button onClick={handleDisconnectCall} color="blue" basic icon>
                                    <Icon name='close' />
                                  </Button>
                                </Button.Group>
                              </Segment>
                            )
                          : null
                      }
                      <Video
                        collab={collab}
                        open={openVideoModal}
                        handleCloseVideoChat={handleCloseVideoChat}
                        handleDisconnectCall={handleDisconnectCall}
                        handleMuteAudio={handleMuteAudio}
                        handleUnmuteAudio={handleUnmuteAudio}
                        handleMuteVideo={handleMuteVideo}
                        handleUnmuteVideo={handleUnmuteVideo}
                        startCall={startCall}
                        audioMuted={audioMuted}
                        videoMuted={videoMuted}
                      />
                    </div>
                  )
          }
        </Sidebar>
      </div>
    );
  }
};

module.exports = Collaboration;
