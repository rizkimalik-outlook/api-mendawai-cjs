
const up = function(knex) {
    return knex.schema.createTable('category_sub_lv1', function(table){
        table.increments('id').primary();
        table.string('category_id', 100).notNullable();
        table.string('category_sublv1_id', 100).unique().notNullable();
        table.string('sub_name', 150).notNullable();
        table.string('description');
        table.string('user_create', 100);
        table.string('user_update', 100);
        table.timestamps();
    })
};

const down = function(knex) {
    return knex.schema.dropTable('category_sub_lv1');
};

module.exports = {up, down}