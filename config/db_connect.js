const knex = require('knex')({
    client: process.env.DB_CONNECTION,
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        options: {
            encrypt: false
        }
    }
});

module.exports = knex;