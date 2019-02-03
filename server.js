var express = require("express");
var helmet = require("helmet");
var moment = require("moment");

var app = express();
var port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", function(err) {
  if (err) {
    console.log(moment().toISOString() + " - [Node Express] Failed to start server on TCP: " + port);
    console.log(moment().toISOString() + " - [Node Express] Error: " + err);
    return;
  }
  console.log(moment().toISOString() + " - [Node Express] Successfully started server on TCP: " + port);
  app.use(helmet());
  app.use(function(req, res, next) {
    console.log(moment().toISOString() + " - [Node Express] " + req.method + " - " + req.path + " - " + req.ip);
    return next();
  });
  app.use(express.static(__dirname + "/public"));
});
