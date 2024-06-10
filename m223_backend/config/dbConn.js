const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql'
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connected successfully');
    } catch (error) {
        console.error('Unable to connect to MySQL:', error);
    }
};

module.exports = { sequelize, connectDB };