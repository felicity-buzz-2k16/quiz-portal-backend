var Sequelize = require('sequelize');
var sequelize = require('./dbconfig');

var Mapping = sequelize.define('mapping', {
  qno: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      isInt: true,
    }
  },
  uid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      notEmpty: true,
    }
  },
});

module.exports = Mapping;
