const express = require('express')
const router = express.Router()
const db = require('../db/index')
module.exports = router

// GET Root route
router.get('/', (req, res) => {
  res.render('home')
})

// POST Root route - after name entered
router.post('/', async (req, res) => {
  const data = req.body
  const userName = data.name

  // Add user to database and return id
  const userId = await db.handleUserName(userName)

  // Redirect to the id of the new user
  res.redirect(`/${userId[0]}/question`)
})

// GET question page
// site/:user/question
router.get('/:user/question', (req, res) => {
  res.send('hi')
})

// POST question page
// site/question
router.post('/:user/question', (req, res) => {
  res.send('hi')
})
