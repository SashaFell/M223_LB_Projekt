const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConn');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roles: {
        type: DataTypes.JSON, // Wir speichern die Rollen als JSON, da Sequelize keine verschachtelten Objekte direkt unterstützt
        defaultValue: {
            User: 2001
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'users'
});

module.exports = User;