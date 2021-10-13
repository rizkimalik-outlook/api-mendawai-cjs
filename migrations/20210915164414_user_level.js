
exports.up = function(knex) {
    return knex.schema.createTable('user_level', function(table){
        table.increments('id').primary();
        table.string('level_name', 100);
        table.string('description');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_level');
};
