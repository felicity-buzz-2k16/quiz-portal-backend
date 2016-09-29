var Sequelize = require('sequelize');

var sequelize;

if (process.env.NODE_ENV == 'development') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
  });
} else {
  sequelize = new Sequelize('database', 'user', 'password', {
    dialect: 'mariadb',
    define: {
      charset: 'utf8',
    }
  })
}

module.exports = sequelize;
