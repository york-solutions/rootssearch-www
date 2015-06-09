var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('search', {
    // Empty search data
    data: {}
  });
});

router.post('/', function(req, res){
  var data = {};
  if(req.body && req.body.data){
    data = req.body.data;
  }
  res.render('search', {
    data: data
  });
  
  // TODO: log referring url from body.url
});

module.exports = router;