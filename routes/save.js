var express = require('express');
var router = express.Router();

router.get('/:site', function(req, res) {
  res.render(`save/${req.params.site}`);
});

module.exports = router;