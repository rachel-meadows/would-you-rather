// Database functions to be called from routes

const config = require('./knexfile').development
const connection = require('knex')(config)
