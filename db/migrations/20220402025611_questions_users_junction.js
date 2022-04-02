/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('questions_users_junction', function (table) {
    table.integer('question_id').references('id').inTable('questions')
    table.integer('user_id').references('id').inTable('users')
    table.primary(['user_id', 'question_id'])
    table.integer('choice')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('questions_users_junction')
}
