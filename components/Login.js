var React = require("react");
var QrReader = require("react-qr-reader");
var passwordValidator = require('password-validator');
var {Container, Menu, Button, Form, Grid, Header, Message, Segment, Icon, Modal} = require("semantic-ui-react");

var validateUsernameFormat= function(username) {
  var schema = new passwordValidator();
  schema
    .is().min(1)
    .is().max(64)
    .has().not().spaces();
  return schema.validate(username);
};

var validatePasswordFormat = function(password) {
  var schema = new passwordValidator();
  schema
    .is().min(1)
    .is().max(64)
    .has().not().spaces();
  return schema.validate(password);
};

var validateResetPasswordFormat = function(password) {
  var schema = new passwordValidator();
  schema
    .is().min(8)
    .is().max(64)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().not().spaces();
  return schema.validate(password);
};

var MenuBar = function(props) {
  return (
    <Menu
      fixed={'top'}
      inverted={true}
      secondary={true}
      pointing={true}
      size='large'
    >
      <Container>
        <Menu.Item as='a' href="/" active>
          Home
        </Menu.Item>
      </Container>
    </Menu>
  );
}

var Heading = function() {
  return (
    <Container text>
      <Header
        as='h1'
        content='CryptoBank'
        inverted
        style={{
          fontSize: '4em',
          fontWeight: 'normal',
          marginBottom: 0,
          marginTop: '3em',
        }}
      />
      <Icon size="massive" name="bitcoin" />
    </Container>
  );
};

var LoginCredentials =  function(props) {
    return (
      <div>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header
              as='h2'
              inverted
              textAlign='center'
              style={{
                marginBottom: 0,
                marginTop: '2em',
              }}
            >
              Account Login
            </Header>
            <Form size='large'>
              <Segment stacked inverted>
                <Form.Input
                  onChange={(e)=>props.handleUsername(e)}
                  value={props.username}
                  fluid icon='user'
                  iconPosition='left'
                  placeholder='Username'
                />
                <Form.Input
                  onChange={(e)=>props.handlePassword(e)}
                  value={props.password}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                />
                <Button
                  onClick={()=>props.handleLogin()}
                  disabled={!props.validUsername || !props.validPassword}
                  primary
                  fluid
                  size='large'
                  style={{marginBottom: "1em"}}
                >
                  Login
                </Button>
                <Button
                  onClick={props.handleOpenQrScan}
                  color="teal"
                  size="large"
                  fluid
                >
                  <Icon name="qrcode" />
                   First Time?  Show QR Code
                </Button>
                {
                  props.showCamera
                    ?
                      (
                        <Camera
                          open={props.showCamera}
                          handleClose={props.handleCloseQrScan}
                          handleScan={props.handleQrScan}
                          handleScanError={props.handleQrScanError}
                        />
                      )
                    : null
                }
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
};

var ResetCredentials =  function(props) {
    return (
      <div>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header
              as='h2'
              inverted
              textAlign='center'
              style={{
                marginBottom: 0,
                marginTop: '2em',
              }}
            >
              Set Your Account Password
            </Header>
            <Form size='large'>
              <Segment stacked inverted>
                <Form.Input
                  value={props.username}
                  fluid icon='user'
                  iconPosition='left'
                  placeholder='Username'
                />
                <Form.Input
                  onChange={(e)=>props.handlePassword(e)}
                  value={props.password}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                />
                <Form.Input
                  onChange={(e)=>props.handleRetypePassword(e)}
                  value={props.retypePassword}
                  fluid
                  icon='lock'
                  iconPosition='left'
                  placeholder='Retype Password'
                  type='password'
                />
                <Button
                  onClick={()=>props.handleResetPassword()}
                  disabled={!(props.validInitialToken && props.validUsername && props.validPassword && props.passwordMatch)}
                  primary
                  fluid
                  size='large'
                  style={{marginBottom: "1em"}}
                >
                  Set Password
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
};

var Camera = function(props) {
  return (
    <Modal size="mini" open={props.open} onClose={props.handleClose}>
      <Modal.Header>Show QR Code</Modal.Header>
      <Modal.Content image>
        <QrReader
          delay={5000}
          onScan={props.handleScan}
          onError={props.handleScanError}
          style={{width: "100%"}}
        />
      </Modal.Content>
    </Modal>
  );
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      validUsername: false,
      password: "",
      retypePassword: "",
      validPassword: false,
      passwordMatch: false,
      initialToken: null,
      validInitialToken: null,
      showCamera: false,
      passwordResetSuccess: false,
      invalidLogin: false,
    };
    this.resetState = this.resetState.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleRetypePassword = this.handleRetypePassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleResetPassword = this.handleResetPassword.bind(this);
    this.handleQrScan = this.handleQrScan.bind(this);
    this.handleOpenQrScan = this.handleOpenQrScan.bind(this);
    this.handleCloseQrScan = this.handleCloseQrScan.bind(this);
    this.handleQrScanError = this.handleQrScanError.bind(this);
  }

  resetState() {
    this.setState({
      username: "",
      validUsername: false,
      password: "",
      validPassword: false,
      retypePassword: "",
      passwordMatch: false,
      initialToken: null,
      validInitialToken: null,
      showCamera: false,
      passwordResetSuccess: false,
      invalidLogin: false,
    });
  }

  handleUsername(e) {
    this.setState({
      username: e.target.value,
      validUsername: validateUsernameFormat(e.target.value)
    });
  }

  handlePassword(e) {
    if (this.state.validInitialToken !== true) {
      this.setState({
        password: e.target.value,
        validPassword: validatePasswordFormat(e.target.value),
        passwordMatch: e.target.value === this.state.reTypePassword
      });
    }
    else {
      this.setState({
        password: e.target.value,
        validPassword: validateResetPasswordFormat(e.target.value),
        passwordMatch: e.target.value === this.state.reTypePassword
      });
    }
  }

  handleRetypePassword(e) {
    if (this.state.validInitialToken === true) {
      this.setState({
        retypePassword: e.target.value,
        validPassword: validateResetPasswordFormat(e.target.value),
        passwordMatch: e.target.value === this.state.password
      });
    }
  }

  handleLogin() {
    if (this.state.validUsername && this.state.validPassword) {
      this.props.login({
        username: this.state.username,
        password: this.state.password
      });
      this.resetState();
    }
  }

  handleResetPassword() {
    if (this.state.validInitialToken && this.state.validUsername && this.state.validPassword && this.state.passwordMatch) {
      this.props.resetPassword({
        initialToken: this.state.initialToken,
        username: this.state.username,
        password: this.state.password
      });
      this.setState({
        password: "",
        validPassword: false,
        retypePassword: "",
        passwordMatch: false,
        initialToken: null,
        validInitialToken: null,
        showCamera: false,
        passwordResetSuccess: false,
        invalidLogin: false
      });
    }
  }

  handleQrScan(initialToken) {
    if (initialToken) {
      this.props.onboard({initialToken: initialToken});
      this.setState({initialToken: initialToken});
    }
  }

  handleQrScanError(err) {
    if (err) {
      console.error(err);
      this.setState({
        showCamera: false,
        validInitialToken: false
      });
    }
  }

  handleOpenQrScan() {
    this.setState({showCamera: true});
  }

  handleCloseQrScan() {
    this.setState({showCamera: false});
  }

  componentDidUpdate() {
    var user = this.props.user;
    if (this.state.showCamera && this.state.initialToken) {
      if (user.authenticated === null && user.user) {
        if (user.user.passwordResetRequired) {
          this.setState({
            showCamera: false,
            username: user.user.username,
            validUsername: true,
            validInitialToken: true
          });
        }
      }
    }
    if (user.authenticated === null && user.user) {
      if (!this.state.passwordResetSuccess && !user.user.passwordResetRequired) {
        this.setState({
          passwordResetSuccess: true,
          username: user.user.username,
        });
      }
    }
    if (!this.state.invalidLogin && user.authenticated === false) {
      this.setState({
        invalidLogin: true
      });
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    return (
      <div>
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
          <MenuBar />
            <Heading />
            {
              this.state.validInitialToken === true
                ?
                  (
                    <ResetCredentials
                     handleUsername={this.handleUsername}
                     handlePassword={this.handlePassword}
                     handleRetypePassword={this.handleRetypePassword}
                     handleResetPassword={this.handleResetPassword}
                     username={this.state.username}
                     password={this.state.password}
                     retypePassword={this.state.retypePassword}
                     passwordMatch={this.state.passwordMatch}
                     validUsername={this.state.validUsername}
                     validPassword={this.state.validPassword}
                     validInitialToken={this.state.validInitialToken}
                    />
                  )
                :
                  (
                   <LoginCredentials
                     handleUsername={this.handleUsername}
                     handlePassword={this.handlePassword}
                     handleLogin={this.handleLogin}
                     handleOpenQrScan={this.handleOpenQrScan}
                     handleCloseQrScan={this.handleCloseQrScan}
                     handleQrScan={this.handleQrScan}
                     handleQrScanError={this.handleQrScanError}
                     showCamera={this.state.showCamera}
                     username={this.state.username}
                     validUsername={this.state.validUsername}
                     password={this.state.password}
                     validPassword={this.state.validPassword}
                   />
                  )
            }
        </Segment>
        <Segment
          textAlign='center'
          vertical
        >
          {
           this.state.validInitialToken && this.state.password && !this.state.validPassword
             ?
               (
                 <Message color='red'>
                   Password must contain at least 8 characters with uppercase letters and digits
                 </Message>
               )
             : null
          }
          {
           Boolean(this.state.passwordResetSuccess)
             ?
               (
                 <Message color='green'>
                   Password Successfully Reset. You can now Login!
                 </Message>
               )
             : null
          }
          {
           Boolean(this.state.invalidLogin)
             ?
               (
                 <Message color='red'>
                   Invalid Credentials!
                 </Message>
               )
             : null
          }
        </Segment>
      </div>
    );
  }
}

module.exports = Login;
