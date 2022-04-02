/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('questions_users_junction').del()
  await knex('questions_users_junction').insert([
    { question_id: 1, user_id: 1 },
    { question_id: 2, user_id: 1 },
    { question_id: 3, user_id: 2 },
    { question_id: 1, user_id: 3 },
  ])
}
