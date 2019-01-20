var React = require("react");

var AuthUser = require("./AuthUser");
var Home = require("./Home");

class Cryptobank extends React.Component {
  constructor(props) {
    super(props);
    props.getLogin();
    this.state = {
      loginFlow: false
    };
    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleLoginClick() {
    this.setState({loginFlow: true});
  }

  render() {
    console.log(this.props);
    var loginFlow = this.state.loginFlow;
    if (loginFlow) {
      return (
        <AuthUser
          handleLoginClick={this.handleLoginClick}
          socket={this.props.socket}
          user={this.props.user}
          collab={this.props.collab}
          cryptoFeed={this.props.cryptoFeed}
          onboard={this.props.onboard}
          login={this.props.login}
          logout={this.props.logout}
          resetPassword={this.props.resetPassword}
          createCollabSession={this.props.createCollabSession}
          getMessages={this.props.getMessages}
          sendMessage={this.props.sendMessage}
          startVideoChat={this.props.startVideoChat}
          startCall={this.props.startCall}
        />
      );
    }
    else {
      return (
        <Home
          handleLoginClick={this.handleLoginClick}
          logout={this.props.logout}
          user={this.props.user}
        />
      );
    }
  }
}

module.exports = Cryptobank;
