'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('note', {
      idNote: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      commentary: {
        type: Sequelize.STRING(500),
      },
      idProcess: {
        type: Sequelize.INTEGER,
        references: {
          model: 'process',
          key: 'idProcess',
        },
        allowNull: false,
        onDelete: 'RESTRICT',
      },
      idStageA: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      idStageB: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('note');
  },
};
