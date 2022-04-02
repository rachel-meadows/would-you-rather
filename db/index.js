const config = require('./knexfile').development
const connection = require('knex')(config)
module.exports = {
  handleUserName,
}

// Database functions to be called from routes
function handleUserName(name, db = connection) {
  return db('users').insert({ name: name })
}
