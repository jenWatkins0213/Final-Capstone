const knex = require("../db/connection");
const tableName = "reservations";

function create(params) {
  return knex(tableName)
    .insert(params)
    .returning("*")
    .then((savedData) => {
      return savedData[0];
    });
}

function list(query) {
  return knex(tableName)
    .where(query)
    .select("*")
    .orderBy("reservation_time", "asc");
}

function getById(reservation_id) {
  return knex(tableName)
    .where({ reservation_id })
    .then((savedData) => savedData[0])
    .catch(() => {});
}

function updateStatus(reservation_id, status) {
  return knex(tableName)
    .where({ reservation_id })
    .update({ status })
    .returning("*")
    .then((savedData) => savedData[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function editReservation(reservation_id, data) {
  return knex("reservations")
    .where({ reservation_id })
    .update(data)
    .returning("*")
    .then((savedData) => savedData[0]);
}

module.exports = {
  create,
  list,
  getById,
  updateStatus,
  search,
  editReservation,
};