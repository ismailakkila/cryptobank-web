var React = require("react");
var {Comment, Card} = require("semantic-ui-react");

class ChatMessages extends React.Component {
  constructor(props) {
    super(props);
    this.chatMessagesRef = React.createRef();
    this.chatsLength = props.collab.chats.length;
    this.state = {};
  }

  componentDidUpdate() {
    if (this.chatsLength !== this.props.collab.chats.length) {
      this.chatsLength = this.props.collab.chats.length;
      this.chatMessagesRef.current.scrollTop = this.chatMessagesRef.current.scrollHeight;
    }
  }

  render() {
    var {collab} = this.props;

    var formatTime = function(number) {
      if (number < 10) {
        number = "0" + String(number);
        return number;
      }
      return number;
    };

    var chats = collab.chats.filter(function(chat) {
      return Boolean(chat.text);
    }).map(function(chat) {
      var {personId, created, text, id} = chat;
      var hours = formatTime(new Date(created).getHours());
      var minutes = formatTime(new Date(created).getMinutes());
      var date = hours + ":" + minutes;
      if (personId === collab.guestId) {
        return (
          <Card key={id} style={{float: "right", padding: "0.5em"}}>
            <Comment>
              <Comment.Content>
                <Comment.Author as="a">You</Comment.Author>
                <Comment.Metadata>
                  <div>{date}</div>
                </Comment.Metadata>
                <Comment.Text style={{color: "blue"}}>{text}</Comment.Text>
              </Comment.Content>
            </Comment>
          </Card>
        );
      }
      if (personId === collab.botId) {
        return (
          <Card key={id} style={{float: "left", padding: "0.5em"}}>
            <Comment>
              <Comment.Avatar src={"/images/agent/cryptobank.jpg"} />
              <Comment.Content>
                <Comment.Author as="a">CryptoBank</Comment.Author>
                <Comment.Metadata>
                  <div>{date}</div>
                </Comment.Metadata>
                <Comment.Text>{text}</Comment.Text>
              </Comment.Content>
            </Comment>
          </Card>
        );
      }
      return (
        <Card key={id} style={{float: "left", padding: "0.5em"}}>
          <Comment>
            <Comment.Avatar src={"/images/agent/agent" + collab.cryptobankRep.agentId + ".jpg"} />
            <Comment.Content>
              <Comment.Author as="a">{collab.cryptobankRep.displayName}</Comment.Author>
              <Comment.Metadata>
                <div>{date}</div>
              </Comment.Metadata>
              <Comment.Text>{text}</Comment.Text>
            </Comment.Content>
          </Comment>
        </Card>
      );
    });

    return (
      <div
        ref={this.chatMessagesRef}
        style={{
          maxHeight: "100%",
          overflowY: "auto",
          width: "100%",
          padding: "1em"
        }}
      >
        <Comment.Group>
          {chats.reverse()}
        </Comment.Group>
      </div>
    );
  }
}

module.exports = ChatMessages;
