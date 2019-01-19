var React = require("react");
var {Container, Segment, Header, Icon, Loader} = require("semantic-ui-react");

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

var LoadingPortal = function(props) {
  return (
    <Segment
      inverted
      textAlign='center'
      style={{ minHeight: 700, padding: '1em 0em' }}
      vertical
    >
      <Heading />
      <Loader
        style={{margin: "20px"}}
        size="huge"
        active
        inline="centered"
        content="Launching Portal..."
      />
    </Segment>
  );
};

module.exports = LoadingPortal;
