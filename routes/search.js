var express = require('express');
var router = express.Router();
var gedx = require('../lib/server/gedx.js');
var debug = require('debug')('rootssearch:routes:search');

router.get('/', function(req, res){
  res.render('search', {
    // Empty search data
    data: {}
  });
});

router.get('/settings', function(req, res) {
  res.render('settings');
});

/**
 * Data has been POSTed for pre-filling the search form.
 */
router.post('/', function(req, res){
  var data = {};
  
  // Do we actually have data?
  if(req.body) {
    
    // If GedcomX, convert to gensearch v1 schema. Otherwise, assume it is 
    // already gensearch v1 schema.
    if(req.body.data){
      debug('gensearch');
      data = req.body.data;
    }
    
    else if(req.body.gedcomx){
      debug('gedcomx');
      try {
        data = gedx.convertToGensearch(JSON.parse(req.body.gedcomx));
      } catch(error) {
        console.error(error.stack);
      }
    }
    
    // Before the rootssearch.io website was created, the extension handled
    // site settings and searching. When the extension is upgraded to v4 and
    // POSTs for the first time then it sends those site settings. We still
    // have a few hundred users on v3. Even when all users have migrated to
    // v4 we don't yet have a way of tracking whether they've sent a POST yet.
    // TODO: add tracking to know when we can remove this. Or decide that it's
    // not worth keeping around; users can change the site settings themselves.
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