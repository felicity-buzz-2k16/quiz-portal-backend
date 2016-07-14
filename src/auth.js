var jwt = require('jsonwebtoken');
var router = require('express').Router();
var config = require('./config');
var models = require('./models');
var middleware = require('./middleware');

function sendUserData (user, res) {
  jwt.sign({}, config.secret, { subject: user.id.toString(), expiresIn: "2h" }, function (err, token) {
    if (err != null) {
      throw err;
    } else {
      res.send({token: token, email: user.email, name: user.name});
    }
  });
}

router.post ('/login', middleware.isNotAuthenticated, (req, res, next) => {
  const { email, password } = req.body;
  if (typeof email != 'string' || typeof password != 'string') {
    res.sendStatus(400);
    return;
  }

  models.User.find({where : {
    email, password
  }}).then(user => {
    if (user) sendUserData(user, res);
    else res.sendStatus(401);
  }).catch(next)
})

router.post ('/register',  middleware.isNotAuthenticated, (req, res, next) => {
  const { email, password, name } = req.body;

  return models.User.find({where : { email }}).then(user => {
    if (user) {
      if (user.password == password) sendUserData(user, res);
      else res.sendStatus(401);
    } else {
      return models.User.create({
        email, password, name
      }).then(user => {
        sendUserData(user, res);
      })
    }
  }).catch(next)
})

module.exports = router;
