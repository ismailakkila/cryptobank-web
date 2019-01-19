var React = require("react");

var {Button, Modal, Container, Grid, Header, Icon, List, Menu, Segment} = require("semantic-ui-react");

var Heading = function(props) {
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
      <Header
        as='h2'
        content='Decentralizing one user at a time'
        inverted
        style={{
          fontSize: '1.7em',
          fontWeight: 'normal',
          marginTop: '1.5em',
        }}
      />
      <Button
        onClick={props.handleOpenSignUp}
        primary size='huge'
      >
        Get Started
        <Icon name='right arrow' />
      </Button>
    </Container>
  );
};

var Footer = function(props) {
  return (
    <Segment inverted vertical style={{ padding: '5em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item onClick={props.handleOpenAboutUs} as='a'>Contact Us</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                More Information
              </Header>
              <p>
                We pride ourselves in a fully transparent service. Our financial audits are made public.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
  );
};

var SignUp = function(props) {
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Modal.Header>Coming Soon</Modal.Header>
      <Modal.Content image>
        <Icon size="massive" name="wrench" />
        <Modal.Description>
          <Header>We Are Sorry!</Header>
          <p>Due to overwhelming demand, we are unable to accept new sign-up requests.</p>
          <p>Please check back soon.</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

var AboutUs = function(props) {
  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Modal.Header>About Us</Modal.Header>
      <Modal.Content image>
        <Icon size="massive" name="building" />
        <Modal.Description>
          <Header>In Brief</Header>
          <p>Founded in June of 2013, CryptoBank is a next generation banking platform where
          consumers can transact with digital currencies and avail crypto banking services based
          on the highest security fundamentals</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpModal: false,
      aboutUsModal: false
    };
    this.handleOpenSignUp = this.handleOpenSignUp.bind(this);
    this.handleCloseSignUp = this.handleCloseSignUp.bind(this);
    this.handleOpenAboutUs = this.handleOpenAboutUs.bind(this);
    this.handleCloseAboutUs = this.handleCloseAboutUs.bind(this);
  }

  handleOpenSignUp() {
    this.setState({signUpModal: true});
  }

  handleCloseSignUp() {
    this.setState({signUpModal: false});
  }

  handleOpenAboutUs() {
    this.setState({aboutUsModal: true});
  }

  handleCloseAboutUs() {
    this.setState({aboutUsModal: false});
  }

  render() {
    var {user, logout, handleLoginClick} = this.props;
    return (
      <div>
        <SignUp
          open={this.state.signUpModal}
          handleClose={this.handleCloseSignUp}
        />
        <AboutUs
          open={this.state.aboutUsModal}
          handleClose={this.handleCloseAboutUs}
        />
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
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
              <Menu.Item
                onClick={this.handleOpenAboutUs}
                as='a'
              >
                About
              </Menu.Item>
              {
                user.authenticated === true
                  ?
                    (
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
                    )
                  :
                    (
                      <Menu.Item position='right'>
                        <Button
                          onClick={handleLoginClick}
                          as='a'
                          inverted={true}
                        >
                          Login
                        </Button>
                        <Button
                          onClick={this.handleOpenSignUp}
                          as='a'
                          inverted={true}
                          primary={false}
                          style={{ marginLeft: '0.5em' }}
                        >
                          Sign Up
                        </Button>
                      </Menu.Item>
                    )
              }
            </Container>
          </Menu>
          <Heading handleOpenSignUp={this.handleOpenSignUp} />
        </Segment>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container text>
            <Header as='h3' style={{ fontSize: '2em' }}>
              Now Securing Over $325 Billion Worth of Crypto Assets
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              We have been in the Bitcoin space since 2013 and our goal is to provide banking services
              for the hardest monetary asset ever known. We offer a full-reserve Bitcoin and custody service
              solution that is unparalleled in the industry.
            </p>
          </Container>
        </Segment>
        <Footer handleOpenAboutUs={this.handleOpenAboutUs}/>
      </div>
    );
  }
}

module.exports = Home;
