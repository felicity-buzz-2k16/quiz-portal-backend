var models = require('./models');

function createUserIfNot (email, name, cb) {
  models.User.findOrCreate({where : { email }, defaults: { name }})
    .then(user => cb(null, user[0]))
    .catch(cb)
}

function isAuthenticated (req, res, next) {
  var email = req.get('SSO-Email');
  var name = req.get('SSO-Name');
  if (!email) { res.sendStatus(403); return }
  createUserIfNot(email, name, function (err, user) {
    if (err) {
      next(err);
    } else if (!user) {
      res.sendStatus(403);
    } else {
      req.user = user;
      next();
    }
  })
}

function isNotAuthenticated (req, res, next) {
  var email = req.get('SSO-Email');
  var name = req.get('SSO-Name');
  if (!email) { next(); return }
  createUserIfNot(email, name, function (err, user) {
    if (err) {
      next(err);
    } else if (!user) {
      next();
    } else {
      res.sendStatus(403)
    }
  })
}

function maybeAuthenticated (req, res, next) {
  var email = req.get('SSO-Email');
  var name = req.get('SSO-Name');
  if (!email) { next(); return }
  createUserIfNot(email, name, function (err, user) {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  })
}

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
  maybeAuthenticated
}
