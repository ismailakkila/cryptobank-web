var React = require("react");
var {Item, Segment, Container, Loader, Grid, Button, Icon, Popup} = require("semantic-ui-react");

var CryptoItem = function(props) {
  var {cryptoName, cryptoTicker, cryptoPrice, cryptoBalance} = props;
  return (
    <Item>
      <Item.Image size='mini' src={'/images/crypto/' + cryptoTicker + '.png'} />
      <Item.Meta style={{marginLeft: "0.5em"}}><b>{cryptoName}</b></Item.Meta>
      <Item.Content style={{textAlign: "right"}} verticalAlign='middle'>
        <Item.Meta><b>{String(cryptoBalance) + " " + cryptoTicker}</b></Item.Meta>
        <Item.Meta>
          {
            isNaN(cryptoPrice)
              ? (<Loader size="mini" active inline />)
              : ("$" + String((cryptoBalance * cryptoPrice).toFixed(2)))
          }
        </Item.Meta>
        <Popup trigger={<Button icon='send' />} content='Withdraw' />
        <Popup trigger={<Button icon='qrcode' />} content='Deposit' />
        <Popup trigger={<Button icon='history' />} content='Transactions' />
      </Item.Content>
    </Item>
  );
};

var CryptoPortfolio = function(props) {
  var cryptoUsdPrices = props.cryptoPortfolio.map(function(crypto) {
      var balance = crypto.cryptoBalance * crypto.cryptoPrice;
      if (!isNaN(balance)) {
        return crypto.cryptoBalance * crypto.cryptoPrice;
      }
      return NaN;
  });
  var cryptoTotalBalance = cryptoUsdPrices.reduce(function(sum, balance) {
    return sum + balance;
  }).toFixed(2);
  var CryptoItemGroup = props.cryptoPortfolio.map(function(crypto) {
    return (
      <CryptoItem
        key={crypto.cryptoTicker}
        cryptoName={crypto.cryptoName}
        cryptoTicker={crypto.cryptoTicker}
        cryptoPrice={crypto.cryptoPrice}
        cryptoBalance={crypto.cryptoBalance}
      />
    );
  });
  return (
    <Segment
      inverted
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flexStart",
        minHeight: "600px",
        padding: "2em"
      }}
      vertical
    >
      <Segment style={{width: "600px", maxWidth: "600px"}}>
        <Item.Group unstackable divided>
          <Item>
            <Item.Meta style={{color: "blue"}}><b>Your Portfolio</b></Item.Meta>
          </Item>
          {CryptoItemGroup}
          <Item>
            <Item.Meta style={{color: "blue"}}>
              <b>
                {"Total Balance: "}
                {
                  isNaN(cryptoTotalBalance)
                  ? (<Loader size="mini" active inline />)
                  :"$" + String(cryptoTotalBalance)
                }
              </b>
            </Item.Meta>
          </Item>
        </Item.Group>
      </Segment>
    </Segment>
  )
};

module.exports = CryptoPortfolio;
