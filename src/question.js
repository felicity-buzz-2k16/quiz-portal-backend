var router = require('express').Router();
var models = require('./models');
var middleware = require('./middleware');

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
  if (Date.now() - req.user.lastWrongAnswer <= 30*1000) { res.sendStatus(406); return }
  var { qno } = req.params;
  const { answer } = req.body;
  const { lastQuestionAllowed } = req.user;
  const { score } = req.user;
  const uid = req.user.id
  if (!qno) qno = lastQuestionAllowed;
  models.Question.findOne({where : { qno }})
  .then(question => {
    if (question) {
      if ( question.unlock_points > score)
        {res.status(403).send({points:question.unlock_points});return false;}
      models.Mapping.findOne({where: {qno:qno,uid:uid}}).then(mapping => {
        if(!mapping){
          if (question.answer == answer && question.unlock_points <= score){
            req.user.update({
              score: score + question.points,
              lastQuestionAllowed: lastQuestionAllowed + 1,
              scoreUpdated: Date.now(),
              lastWrongAnswer: 0,
            });
            models.Mapping.create({qno,uid});
          }
          else if (question.answer != answer && question.unlock_points <= score)
            req.user.update({ lastWrongAnswer: Date.now() });
        }
      })
      res.send({result: question.answer == answer});
    } else res.sendStatus(400);
  })
})

module.exports = router;
