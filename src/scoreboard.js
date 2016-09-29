var models = require('./models');

var lastUpdated, lastScoreboard;
module.exports = function (req, res, next){
  if (lastScoreboard && Date.now() - lastUpdated <= 25*1000) {
    res.send(lastScoreboard);
    return;
  }
  models.User.findAll({
    attributes: ['name', 'score'],
    order: [ [ 'score', 'DESC' ], 'scoreUpdated' ]
  }).then(scores => {
    if (scores) {
      lastScoreboard = scores;
      lastUpdated = Date.now();
      res.send(lastScoreboard);
    }
    else res.sendStatus(400);
  }).catch(err => next(err));
};
