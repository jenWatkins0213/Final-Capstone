exports.up = function(knex) {
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.text("table_name").notNullable();
        table.integer("capacity").notNullable();
        table.text("availability").notNullable();
        table.integer("reservation_id");
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("tables");
};