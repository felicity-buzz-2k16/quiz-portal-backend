var models = require('./index')

module.exports = function () {
  models.sequelize.sync()
}
