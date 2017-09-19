var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.put('/local/X/:xParam/Y/:yParam/weight/:weightParam', function(req, res) {
	var newLocalFish = {
		X : xParam,
		Y : yParam,
		weight : weightParam
	};
	res.json(newLocalFish);
});

module.exports = router;