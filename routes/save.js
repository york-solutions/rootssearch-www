var express = require('express');
var router = express.Router();

router.post('/:site', function(req, res) {
  if(req.body && req.body.gedcomx){
    res.render(`save/${req.params.site}`, {
      gedcomx: req.body.gedcomx
    });
  } else {
    res.status(400).send('Missing GEDCOM X data');
  }
});

if(process.env.NODE_ENV !== 'production'){
  router.get('/fs/post', function(req, res){
    res.render('save/fsPost');
  });
}

module.exports = router;