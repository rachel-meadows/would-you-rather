const config = require('./knexfile').development
const connection = require('knex')(config)
module.exports = {
  handleUserName,
  getQuestion,
}

// Database functions to be called from routes
function handleUserName(name, db = connection) {
  return db('users').insert({ name: name })
}

function getQuestion(question, db = connection) {
  return db('questions')
    .where('id', question)
    .first()
    .select(
      'id',
      'option_1 as option1',
      'option_2 as option2',
      'option_1_count as option1Count',
      'option_2_count as option2Count'
    )
}
