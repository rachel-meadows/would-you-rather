/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('questions', function (table) {
    table.increments('id').primary()
    table.string('option_1')
    table.string('option_2')
    table.integer('option_1_count')
    table.integer('option_2_count')
    table.string('submitted_by')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('questions')
}
