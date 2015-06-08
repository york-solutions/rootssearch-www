var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/', require('./routes/index'));

var server = app.listen(process.env.PORT, process.env.IP, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);

});