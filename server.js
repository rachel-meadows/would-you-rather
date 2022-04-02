const path = require('path')
const express = require('express')
const hbs = require('express-handlebars')

/* Create the server */
const server = express()
module.exports = server

/* Configure the server */
const publicFolder = path.join(__dirname, 'public')
server.use(express.static(publicFolder))
server.use(express.urlencoded({ extended: false }))

server.engine('hbs', hbs.engine({ extname: 'hbs' }))
server.set('view engine', 'hbs')

const routes = require('./routes/routes.js')
server.use('/', routes)
