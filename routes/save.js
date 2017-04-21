var express = require('express');
var router = express.Router();

// Handle POST of GEDCOM X data for saving to the FamilySearch Family Tree.
// We do not allow for GET requests. Data must be POSTed.
router.post('/fs', function(req, res) {
  if(req.body && req.body.gedcomx){
    res.render('save/fs', {
      gedcomx: req.body.gedcomx
    });
  } else {
    res.status(400).send('Missing GEDCOM X data');
  }
});

// OAuth is performed client side via a popup and polling the URL via JS for
// the OAuth token. We just need to render a page. To be nice we add a spinner.
router.get('/fs/oauth-redirect', function(req, res){
  res.render('save/fsOauthRedirect');
});

// In development we have a page that helps us issue POST requests.
if(process.env.NODE_ENV !== 'production'){
  router.get('/fs/post', function(req, res){
    res.render('save/fsPost');
  });
}

module.exports = router;