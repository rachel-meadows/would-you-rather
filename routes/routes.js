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
  // Handle case where user has returned to start
  let userId
  if (!data.userId) {
    const userName = data.name
    // Add user to database and return id
    userId = await db.handleUserName(userName)
  } else {
    userId = data.userId
  }
  // Start from the first question
  const questionId = 1
  // Redirect to the id of the new user
  res.redirect(`/${userId[0]}/${questionId}`)
})

// POST after user clicks 'next' when there are no further questions
// site/end
router.post('/end', (req, res) => {
  const data = req.body
  const userId = Number(data.userId)
  res.redirect(`/${userId}/end`)
})

// GET after user clicks 'next' when there are no further questions
// site/:user/end
router.get('/:user/end', (req, res) => {
  const data = req.params
  const userId = Number(data.user)
  const viewData = {
    userId,
  }
  res.render('end', viewData)
})

// POST go to add page
// site/user/add
router.post('/add', async (req, res) => {
  const data = req.body
  const userId = Number(data.userId)
  res.redirect(`/${userId}/add`)
})

// GET add page with user ID retained
router.get('/:user/add', async (req, res) => {
  const data = req.params
  const userId = Number(data.user)
  const viewData = {
    userId,
  }
  res.render('add', viewData)
})

// POST add new question
// site/add/submit
router.post('/add/submit', async (req, res) => {
  const data = req.body
  const option1 = data.option1
  const option2 = data.option2
  const userId = Number(data.userId)

  const questionId = await db.addNewQuestion(userId, option1, option2)
  res.redirect(`/${userId}/${questionId}`)
})

// GET question page
// site/:user/:question
// NOTE: I'm using user ID in route because this is a templating / database exercise, obviously would not do this for a real site
router.get('/:user/:question', async (req, res) => {
  const userId = req.params.user
  const questionId = Number(req.params.question)

  // Get the question from the database
  const viewData = {
    question: await db.getQuestion(questionId),
    user: userId,
  }
  res.render('question', viewData)
})

// POST results after question page
// site/:user/:question/results
router.post('/results', async (req, res) => {
  const data = req.body
  const userId = Number(data.userId)
  const questionId = Number(data.questionId)
  const choice = Number(data.choice)

  // Add user choice to database
  try {
    await db.addChoice(userId, questionId, choice)
  } catch (err) {
    console.error(err)
  }
  // Redirect to the results for that question, retaining the user ID
  res.redirect(`/${userId}/${questionId}/results`)
})

// GET results page
// site/:user/:question/results
router.get('/:user/:question/results', async (req, res) => {
  const data = req.params
  const userId = Number(data.user)
  const questionId = Number(data.question)

  // Get current user's name by id
  const user = await db.getUser(userId)

  // Get user's choice for this question
  const userChoice = await db.getUserChoice(userId, questionId)

  // Get other people's choices for this question
  const questionStats = await db.getStats(
    userId,
    userChoice.choiceId,
    questionId
  )

  // Get how many questions are in database to inform 'next' button display
  const numberQuestions = await db.getQuestionsLength()

  const viewData = {
    // Capitalise user's name
    userId: userId,
    questionId: questionId,
    user: user.name[0].toUpperCase() + user.name.substring(1),
    userChoice: userChoice.choiceValue,
    option1: questionStats.option1,
    option2: questionStats.option2,
    option1Count: questionStats.option1Count,
    option1CountSingular: option1Count === 1,
    option2Count: questionStats.option2Count,
    option2CountSingular: option2Count === 1,
    percentAgreeWithUser: questionStats.percentAgreeWithUser,
    percentDisagreeWithUser: questionStats.percentDisagreeWithUser,
    agreeUserNames: questionStats.agreeUserNames,
    showBack: questionId > 1,
    showNext: questionId < numberQuestions,
    userIsFirstAnswer: option1Count + option2Count === 0,
  }
  res.render('results', viewData)
})

// POST after user clicks 'back' on results page
// site/back
router.post('/back', async (req, res) => {
  const data = req.body
  const userId = Number(data.userId)
  const questionId = Number(data.questionId)

  // // Redirect to the next question, retaining the user ID
  res.redirect(`/${userId}/${questionId - 1}`)
})

// POST after user clicks 'next' on results page
// site/next
router.post('/next', (req, res) => {
  const data = req.body
  const userId = Number(data.userId)
  const questionId = Number(data.questionId)

  // Redirect to the next question, retaining the user ID
  res.redirect(`/${userId}/${questionId + 1}`)
})
