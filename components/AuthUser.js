var React = require("react");

var Login = require("./Login");
var Dashboard = require("./Dashboard");
var LoadingPortal = require("./LoadingPortal");

class AuthUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true};
    this.resetState = this.resetState.bind(this);
  }

  resetState() {
    this.setState({loading: true});
  }

  componentDidMount() {
    if (this.props.user.authenticated) {
      if (this.state.loading) {
        setTimeout(function() {
          this.setState({loading: false})
        }.bind(this), 2000);
      }
    }
    else {
      if (!this.state.loading) {
        this.resetState();
      }
    }
  }

  componentDidUpdate() {
    if (this.props.user.authenticated) {
      if (this.state.loading) {
        setTimeout(function() {
          this.setState({loading: false})
        }.bind(this), 2000);
      }
    }
    else {
      if (!this.state.loading) {
        this.resetState();
      }
    }
  }

  render() {
    var authenticated = this.props.user.authenticated;
    if (!authenticated) {
      return (
        <Login
          user={this.props.user}
          onboard={this.props.onboard}
          login={this.props.login}
          resetPassword={this.props.resetPassword}
        />
      );
    }
    else {
      if (this.state.loading) {
        return (
          <LoadingPortal />
        );
      }
      else {
        return (
          <Dashboard
            user={this.props.user}
            socket={this.props.socket}
            collab={this.props.collab}
            cryptoFeed={this.props.cryptoFeed}
            handleLoginClick={this.props.handleLoginClick}
            logout={this.props.logout}
            createCollabSession={this.props.createCollabSession}
            getMessages={this.props.getMessages}
            sendMessage={this.props.sendMessage}
            startVideoChat={this.props.startVideoChat}
            startCall={this.props.startCall}
          />
        );
      }
    }
  }
}

module.exports = AuthUser;
