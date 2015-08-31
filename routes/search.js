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
  if(req.body) {
    if(req.body.data){
      data = req.body.data;
    }
    if(req.body._sites){
      res.cookie('settings', JSON.stringify({sites: req.body._sites.split(',')}));
    }
  }
  res.render('search', {
    data: data
  });
  
  // TODO: log referring url from body.url
});

module.exports = router;