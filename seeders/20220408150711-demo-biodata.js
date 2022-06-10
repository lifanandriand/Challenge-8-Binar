'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Biodata',
      [
        {
          name: 'user1',
          age: 20,
          user_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'user2',
          age: 22,
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
