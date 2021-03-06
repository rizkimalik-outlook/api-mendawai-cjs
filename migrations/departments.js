
const up = function(knex) {
    return knex.schema.createTable('departments', function(table){
        table.increments('id').primary();
        table.string('department_name').notNullable();
        table.string('description');
    })
};

const down = function(knex) {
    return knex.schema.dropTable('departments');
};

module.exports = {up, down}