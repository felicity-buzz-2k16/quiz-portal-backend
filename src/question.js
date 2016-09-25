var router = require('express').Router();
var models = require('./models');
var middleware = require('./middleware');
var config = require('./config');

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
  var { qno } = req.params;
  const { answer } = req.body;
  const { lastQuestionAllowed } = req.user;
  const { score } = req.user;
  if (!qno) qno = lastQuestionAllowed;
  if (qno > lastQuestionAllowed) {res.sendStatus(403); return false;}
  models.Question.findOne({where : { qno }})
    .then(question => {
      if (question) {
        var possibleAnswers = JSON.parse(question.answer);
        console.log(possibleAnswers);
        var noOfAnswer = possibleAnswers.length;
        for (var i = 0; i < noOfAnswer; i++){
          var re = new RegExp('^'+possibleAnswers[i]+'$');
          if (re.test(answer)){
            if(qno == lastQuestionAllowed){
              req.user.update({ score: score + config.scoreIncrementor, lastQuestionAllowed: lastQuestionAllowed + 1 });
            }
            res.send({result: true});
          }
        }
        if (qno == lastQuestionAllowed)
          req.user.update({ score: score - config.scoreDecrementor });
        res.send({result: false});
      } else res.sendStatus(400);
    })
})

module.exports = router;
