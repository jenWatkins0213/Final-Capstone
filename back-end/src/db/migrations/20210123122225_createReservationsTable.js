exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    let params = ["first_name", "last_name", "reservation_date", "reservation_time", "mobile_number"];
    table.increments("reservation_id").primary();
    table.integer("people").notNullable();
    params.map((param)=>table.string(param).notNullable());
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};