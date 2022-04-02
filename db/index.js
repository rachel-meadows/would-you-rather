const config = require('./knexfile').development
const connection = require('knex')(config)
module.exports = {
  handleUserName,
  getQuestion,
  addChoice,
  getUser,
  getUserChoice,
  getStats,
  getQuestionsLength,
}

//
// Database functions to be called from routes
//

// Add new users to the database
function handleUserName(name, db = connection) {
  return db('users').insert({ name: name })
}

// Get the current question
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

// Add the user's choice to the database
async function addChoice(user, question, choice, db = connection) {
  // Get current option_1_count and option_2_count from db
  let option1CountData = await db('questions')
    .where('id', question)
    .first()
    .select('option_1_count')
  let option2CountData = await db('questions')
    .where('id', question)
    .first()
    .select('option_2_count')
  option1Count = Number(option1CountData.option_1_count)
  option2Count = Number(option2CountData.option_2_count)

  // Increment count for the correct question option
  if (choice == 1) {
    option1Count++
  } else if (choice == 2) {
    option2Count++
  }

  // Update the count in the database
  await db('questions').where('id', question).update({
    option_1_count: option1Count,
    option_2_count: option2Count,
  })

  // Specify which user made this choice using the composite key
  await db('questions_users_junction')
    .insert({
      user_id: user,
      question_id: question,
      choice: choice,
    })
    .catch((err) => {
      console.error(err)
    })
  return
}

// Return user name by id
function getUser(user, db = connection) {
  return db('users').where('id', user).first().select()
}

// Return user choice by userId and questionId
async function getUserChoice(user, question, db = connection) {
  // Todo: Refactor with a join
  let choiceObj = await db('questions_users_junction')
    .where({
      question_id: question,
      user_id: user,
    })
    .first()
    .select('choice')
  choice = choiceObj.choice

  const options = await db('questions')
    .where({
      id: question,
    })
    .first()
    .select('option_1', 'option_2')

  return {
    choiceId: choice,
    choiceValue: options[`option_${choice}`],
  }
}

// See what proportion of people agree with the current user
async function getStats(choice, question, db = connection) {
  // Get option_1_count and option_2_count from db
  let option1CountObj = await db('questions')
    .where('id', question)
    .first()
    .select('option_1_count as option1Count')
  let option2CountObj = await db('questions')
    .where('id', question)
    .first()
    .select('option_2_count as option2Count')
  option1Count = option1CountObj.option1Count
  option2Count = option2CountObj.option2Count

  // Get strings of the questions from db
  let option1Obj = await db('questions')
    .where('id', question)
    .first()
    .select('option_1 as option1')
  let option2Obj = await db('questions')
    .where('id', question)
    .first()
    .select('option_2 as option2')
  option1 = option1Obj.option1
  option2 = option2Obj.option2

  // Work out % of responses that are the same as user's
  let percentAgree
  let percentDisagree
  if (choice == 1) {
    percentAgree = (option1Count / (option1Count + option2Count)) * 100
    percentDisagree = (option2Count / (option1Count + option2Count)) * 100
  } else if (choice == 2) {
    percentAgree = (option2Count / (option1Count + option2Count)) * 100
    percentDisagree = (option1Count / (option1Count + option2Count)) * 100
  }

  // Return an object that gives the popularity of answers
  return {
    option1: option1,
    option2: option2,
    option1Count: option1Count,
    option2Count: option2Count,
    percentAgreeWithUser: percentAgree.toFixed(1),
    percentDisagreeWithUser: percentDisagree.toFixed(1),
  }
}

async function getQuestionsLength(db = connection) {
  const questionsArray = await db('questions').select()
  return questionsArray.length
}
