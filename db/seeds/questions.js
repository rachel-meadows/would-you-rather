/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('questions').del()
  await knex('questions').insert([
    {
      id: 1,
      option_1: 'Be able to turn invisible',
      option_2: 'Be able to fly',
      option_1_count: 1,
      option_2_count: 1,
      submitted_by: 'Alice',
    },
    {
      id: 2,
      option_1: 'Have a working lightsaber',
      option_2: 'Have a flaming sword',
      option_1_count: 1,
      option_2_count: 0,
      submitted_by: 'Alice',
    },
    {
      id: 3,
      option_1: 'Be completely covered in scales',
      option_2: 'Be completely covered in hair',
      option_1_count: 1,
      option_2_count: 0,
      submitted_by: 'Bob',
    },
  ])
}
