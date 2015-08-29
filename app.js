var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./middleware/locals'));

// Routes
app.use('/', require('./routes/index'));
app.use('/search', require('./routes/search'));
app.use('/settings', require('./routes/settings'));

// Catch 404s
app.use(function(req, res, next) {
  res.status(404).render('404');
});

var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});