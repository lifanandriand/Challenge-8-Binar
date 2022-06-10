'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Histories',
      [
        {
          score: 100,
          score_date: '2022-4-8',
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          score: 90,
          score_date: '2022-4-8',
          user_id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
