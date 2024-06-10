const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn');

const Employee = sequelize.define('Employee', {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'employees'
});

module.exports = Employee;