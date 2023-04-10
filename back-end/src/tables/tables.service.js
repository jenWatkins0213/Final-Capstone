const knex = require("../db/connection");
const tableName = "tables";

function create(params) {
  return knex(tableName)
    .insert(params)
    .returning("*")
    .then((result) => result[0]);
}

function list(query = {}) {
  if (Object.entries(query).length > 0) {
    return knex(tableName).select("*").where(query).orderBy("table_name");
  } else {
    return knex(tableName).select("*").orderBy("table_name");
  }
}

function getById(table_id) {
  return knex(tableName).where({ table_id }).first();
}

function update(
  reservation_id,
  table_id,
  availability,
  reservation_status = "seated"
) {
  return knex
    .transaction((trx) => {
      knex(tableName)
        .where({ table_id })
        .update({ reservation_id, availability })
        .transacting(trx)
        .then(() => {
          return knex("reservations")
            .where({ reservation_id })
            .update({ status: reservation_status })
            .transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => {
      console.log("Error with update transaction in tables.update: ", err);
    });
}

function updateFinishedTable(
  reservation_id,
  table_id,
  availability,
  reservation_status = "finished"
) {
  return knex
    .transaction((trx) => {
      knex(tableName)
        .where({ table_id })
        .update({ reservation_id: null, availability })
        .transacting(trx)
        .then(() => {
          return knex("reservations")
            .where({ reservation_id })
            .update({ status: reservation_status })
            .transacting(trx);
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => {
      console.log("Error with update transaction in tables.update: ", err);
    });
}

function getByReservationId(reservation_id) {
  return knex(tableName)
    .where({ reservation_id })
    .then((result) => result[0]);
}

module.exports = {
  create,
  list,
  getById,
  update,
  updateFinishedTable,
  getByReservationId,
};