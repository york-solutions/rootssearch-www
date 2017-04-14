var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('./middleware/locals'));
app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ 
  extended: true,
  limit: '500kb'
}));

// Routes
app.use('/', require('./routes/index'));
app.use('/search', require('./routes/search'));
app.use('/save', require('./routes/save'));
app.use('/help', require('./routes/help'));

// 404 if we couldn't match a route.
app.use(function(req, res, next) {
  res.status(404).render('404');
});

// Catch errors
app.use(function(error, req, res, next){
  console.error(error.stack);
  res.status(500).render('500');
});

var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});