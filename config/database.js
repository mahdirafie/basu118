const { Sequelize } = require("sequelize");

const database = process.env.DB_NAME || "basu118_db";
const username = process.env.DB_USER || "basu";
const password = process.env.DB_PASSWORD || "basudbadmin";
const host = process.env.DB_HOST || "127.0.0.1";
const port = Number(process.env.DB_PORT || 3306);
const dialect = process.env.DB_DIALECT || "mysql";

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
  logging: false,
  define: {
    underscored: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = { sequelize };


