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
  // Start from the first question
  const questionId = 1
  // Redirect to the id of the new user
  res.redirect(`/${userId[0]}/${questionId}`)
})

// GET question page
// site/:user/:question
router.get('/:user/:question', async (req, res) => {
  const userId = req.params.user
  const questionId = Number(req.params.question)

  // Get the question from the database
  const question = {
    question: await db.getQuestion(questionId),
  }
  console.log(question)

  res.render('question', question)
})

// POST question page
// site/:user/question
router.post('/:user/:question', async (req, res) => {
  res.send('hi')
})
