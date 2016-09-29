var models = require('./index')

module.exports = function () {
  models.sequelize.sync().then(function () {
    return models.User.bulkCreate([
      { email: 'megh@gmail.com', name: 'Megh'},
      { email: 'megh2@gmail.com', name: 'Megh2'}
    ], { ignoreDuplicates: true })
  }).then(function () {
    return models.Question.bulkCreate([
      { qno: 1, title: 'Q1 title', body: 'Question body 1', answer: 1 },
      { qno: 3, title: 'Q3 title', body: 'Question body 3', answer: 3 },
      { qno: 2, title: 'Q2 title', body: 'Question body 2', answer: 2 },
      { qno: 4, title: 'Q4 title', body: 'Question body 4', answer: 4 },
      { qno: 5, title: 'Q5 title', body: 'Question body 5', answer: 5 },
    ], { ignoreDuplicates: true })
  })
}
