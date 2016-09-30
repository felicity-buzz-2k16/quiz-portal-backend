var models = require('./index')

module.exports = function () {
  models.sequelize.sync().then(function () {
    return models.User.bulkCreate([
      { email: 'megh@gmail.com', name: 'Megh'},
      { email: 'megh2@gmail.com', name: 'Megh2'}
    ], { ignoreDuplicates: true })
  }).then(function () {
    return models.Question.bulkCreate([
      { qno: 1, title: 'Q1 title', body: 'Question body 1', answer: 1,unlock_points:0 },
      { qno: 2, title: 'Q2 title', body: 'Question body 2', answer: 2,unlock_points:10 },
      { qno: 3, title: 'Q3 title', body: 'Question body 3', answer: 3,unlock_points:20 },
      { qno: 4, title: 'Q4 title', body: 'Question body 4', answer: 4,unlock_points:20 },
      { qno: 5, title: 'Q5 title', body: 'Question body 5', answer: 5,unlock_points:30 },
    ], { ignoreDuplicates: true })
  })
}
