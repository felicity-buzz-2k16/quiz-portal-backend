var router = require('express').Router();
var models = require('./models');
var middleware = require('./middleware');
var config = require('./config');

router.get('/:qno(\\d+)?', middleware.isAuthenticated, (req, res) => {
  var qno  = req.params.qno;
  var score  = req.user.score;
  var lastQuestionAllowed =req.user.lastQuestionAllowed;
  if (!qno) qno = lastQuestionAllowed;
  models.Question.findOne({
    where : { qno },
    attributes: {exclude: ['answer']}
  }).then(question => {
    if (question){
      if ( question.unlock_points > score)
        {res.status(403).send({points:question.unlock_points});return false;}
      else res.send(question);
    }
    else {
      res.sendStatus(400);
    }
  })
});

router.post('/check/:qno(\\d+)?', middleware.isAuthenticated, (req, res) => {
  var qno  = req.params.qno;
  const uid = req.user.id;
  const answer  = req.body.answer;
  const lastQuestionAllowed  = req.user.lastQuestionAllowed;
  const score = req.user.score;
  if (!qno) qno = lastQuestionAllowed;
  models.Question.findOne({where : { qno }})
  .then(question => {
    if (question) {
      models.Mapping.findOne({where: {qno:qno,uid:uid}}).then(mapping => {
        if(!mapping){
          if (question.answer == answer && question.unlock_points <= score){
            req.user.update({ score: score + config.scoreIncrementor, lastQuestionAllowed: lastQuestionAllowed + 1 });
            models.Mapping.create({qno,uid});
          }
          else if (question.answer != answer && question.unlock_points <= score)
            req.user.update({ score: score - config.scoreDecrementor });
        }
      })
      res.send({result: question.answer == answer});
    } else res.sendStatus(400);
  })
})

module.exports = router;
