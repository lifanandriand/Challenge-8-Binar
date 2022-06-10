'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Biodata', 
        'photo',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: ""
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Biodata', 'photo'),
    ]);
  },
};