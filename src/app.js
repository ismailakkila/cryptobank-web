var React = require("react");
var ReactDOM = require("react-dom");
var {createStore, applyMiddleware} = require("redux");
var {connect, Provider} = require("react-redux");
var thunk = require("redux-thunk").default;

var rootReducer = require("./appMappings").rootReducer;
var mapStateToProps = require("./appMappings").mapStateToProps;
var mapDispatchToProps = require("./appMappings").mapDispatchToProps;
var Cryptobank = require("../components/Cryptobank");

var store = createStore(rootReducer, applyMiddleware(thunk));
var Container = connect(mapStateToProps, mapDispatchToProps)(Cryptobank);

var App = function() {
  return (
    <Provider store={store}>
      <Container />
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
