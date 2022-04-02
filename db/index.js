const config = require('./knexfile').development
const connection = require('knex')(config)
module.exports = {
  handleUserName,
  getQuestion,
  addChoice,
  getUser,
  getUserChoice,
  getStats,
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
function getUserChoice(user, question, db = connection) {
  return db('questions_users_junction')
    .where({
      question_id: question,
      user_id: user,
    })
    .first()
    .select('choice')
}

// See what proportion of people agree with the current user
async function getStats(choice, question, db = connection) {
  // Get option_1_count and option_2_count from db
  let option1Count = await db('questions')
    .where('id', question)
    .first()
    .select('option_1_count')
  let option2Count = await db('questions')
    .where('id', question)
    .first()
    .select('option_2_count')
  option1Count = option1Count.option_1_count
  option2Count = option2Count.option_2_count

  console.log('option1Count', option1Count, 'of type', typeof option1Count)
  console.log('option2Count', option2Count, 'of type', typeof option2Count)

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
    numberOfResponse1: option1Count,
    numberOfResponse2: option2Count,
    percentAgreeWithUser: percentAgree.toFixed(1),
    percentDisagreeWithUser: percentDisagree.toFixed(1),
  }
}
