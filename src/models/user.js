var Sequelize = require('sequelize');
var sequelize = require('./dbconfig');

var User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  lastQuestionAllowed: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  scoreUpdated: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0
  },
  lastWrongAnswer: {
    type: Sequelize.BIGINT,
    allowNull: false,
    defaultValue: 0
  }
});

module.exports = User
