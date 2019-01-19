var React = require("react");
var {Segment, Container, Card, Image, Transition} = require("semantic-ui-react");

var LoadingPricesCard = function(props) {
  return (
    <Card raised style={{height: "74px", width: "290px"}}>
      <Image size="small" src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
    </Card>
  );
};

var LoadingPricesCardGroup = function(props) {
  var cardNum = props.cardNum;
  var cardGroup = [];
  for (var i = 0; i < cardNum; i++) {
    cardGroup.push((
      <LoadingPricesCard key={i} />
    ));
  }
  return (
    <Card.Group centered>
      {cardGroup}
    </Card.Group>
  );
};

var CryptoCard = function(props) {
  var {cryptoName, cryptoTicker, cryptoPrice} = props;
  return (
    <Transition transitionOnMount={true} animation="scale" duration={750}>
      <Card>
        <Card.Content>
          <Image floated='right' size='mini' src={'/images/crypto/' + cryptoTicker + '.png'} />
          <Card.Header>{cryptoPrice}</Card.Header>
          <Card.Meta>{cryptoName}</Card.Meta>
        </Card.Content>
      </Card>
    </Transition>
  )
};

var CryptoCardGroup = function(props) {
  var cryptoGroup = props.cryptoFeed.map(function(crypto) {
    return (
      <CryptoCard
        key={crypto.cryptoTicker}
        cryptoName={crypto.cryptoName}
        cryptoTicker={crypto.cryptoTicker}
        cryptoPrice={crypto.cryptoPrice}
      />
    )
  });
  return (
    <Segment
      loading={props.cryptoFeed.length === 0}
      style={{padding: '2em'}}
      textAlign="center"
      vertical
    >
      {
        props.cryptoFeed.length === 0
        ?
          (
            <LoadingPricesCardGroup cardNum={4} />
          )
        :
          (
            <Card.Group centered>
              {cryptoGroup}
            </Card.Group>
          )
      }
    </Segment>
  )
};

module.exports = CryptoCardGroup;
