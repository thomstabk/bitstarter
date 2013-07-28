
//need to run npm install express first

var express = require('express');
var app = express();
var fs = require('fs');
app.use(express.logger());

var body; 
fs.readFile('index.html', function(error, data) {
  if (error) throw error;
  body = data.toString();
  processData();
});
function processData () {
//   console.log(body);
};


app.get('/', function(request, response) {
    response.send(body);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
