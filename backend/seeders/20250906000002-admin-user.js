'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminUserId = uuidv4();

    // Create an admin user
    await queryInterface.bulkInsert('Users', [{
      id: adminUserId,
      email: 'admin@kanoonwise.com',
      role: 'admin',
      created_at: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@kanoonwise.com' }, {});
  }
};
