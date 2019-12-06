var express = require('./server/config/express.js');
let port = 8080;  //dev port

var start = function() {
  var app = express.init();
  app.listen(port, function() {
    console.log('App listening on port', port);
  });
};
start();  //start listening for requests
