var router = require('express').Router();
var models = require('./models');
var middleware = require('./middleware');

router.get('/:qno(\\d+)?', middleware.isAuthenticated, (req, res) => {
  var { qno } = req.params;
  const { lastQuestionAllowed } = req.user;
  if (!qno) qno = lastQuestionAllowed;
  if (qno > lastQuestionAllowed) {res.sendStatus(403); return false;}
  models.Question.findOne({
    where : { qno },
    attributes: {exclude: ['answer']}
  }).then(question => {
    if (question) res.send(question);
    else res.sendStatus(400);
  })
});

router.post('/check/:qno(\\d+)?', middleware.isAuthenticated, (req, res) => {
  if (Date.now() - req.user.lastWrongAnswer <= 30*1000) { res.sendStatus(406); return }
  var { qno } = req.params;
  const { answer } = req.body;
  const { lastQuestionAllowed } = req.user;
  const { score } = req.user;
  if (!qno) qno = lastQuestionAllowed;
  if (qno > lastQuestionAllowed) {res.sendStatus(403); return false;}
  models.Question.findOne({where : { qno }})
    .then(question => {
      if (question) {
        if (question.answer == answer && qno ==lastQuestionAllowed)
          req.user.update({
            score: score + question.points,
            lastQuestionAllowed: lastQuestionAllowed + 1,
            scoreUpdated: Date.now(),
            lastWrongAnswer: 0,
          });
        else if (question.answer != answer && qno == lastQuestionAllowed)
          req.user.update({ lastWrongAnswer: Date.now() });
        res.send({result: question.answer == answer});
      } else res.sendStatus(400);
    })
})

module.exports = router;
