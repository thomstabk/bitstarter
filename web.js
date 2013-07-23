
//need to run npm install express first

var express = require('express');
var app = express();
var fs = require('fs');
app.use(express.logger());

app.get('/', function(request, response) {
  fs.readFile('index.html', function(err, data) {
    if (err) throw err;
    respond.send(data.toString());
  });
});

var port = process.env.PORT || 8888;
app.listen(port, function() {
  console.log("Listening on " + port);
});
