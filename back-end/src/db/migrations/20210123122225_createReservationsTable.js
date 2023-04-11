exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    // let params = ["first_name", "last_name", "reservation_date", "reservation_time", "mobile_number"];
    table.increments("reservation_id").primary();
    table.integer("people").notNullable();
    table.text("first_name").notNullable();
    table.text("last_name").notNullable();
    table.date("reservation_date").notNullable();
    table.text("reservation_time").notNullable();
    table.text("mobile_number").notNullable();
    // params.map((param)=>table.string(param).notNullable());
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};