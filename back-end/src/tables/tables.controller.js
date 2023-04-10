const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const tableService = require("./tables.service");
const {
  validateInputs,
  validateReservation,
  validateTableId,
  validateCapacityAndAvailability,
  checkAvailabilityStatus,
} = require("./tables.middleware");

// creates a new table given a table name and capacity
async function create(req, res) {
  const { params = null } = res.locals;
  const data = await tableService.create(params);

  return res.status(201).json({ data });
}

// displays tables - allowing a query
async function list(req, res) {
  const { query } = req;
  let data;
  if (Object.entries(query).length > 0) {
    data = await tableService.list(query);
  } else {
    data = await tableService.list();
  }
  return res.json({ data });
}

// updates a table with a reservation_id and sets the table status to 'occupied'
async function update(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { table_id } = req.params;
  const availability = "occupied";
  const data = await tableService.update(
    reservation_id,
    table_id,
    availability
  );

  return res.json({ data });
}

// when the user clicks 'finished', this resets the the reservation_id for the table to null
// likewise sets the table status to `free`
async function updateFinishedTable(req, res) {
  const { reservation_id } = res.locals.table;
  const { table_id } = req.params;

  const data = await tableService.updateFinishedTable(
    reservation_id,
    table_id,
    "free",
    "finished"
  );

  return res.json({ data });
}

module.exports = {
  create: [validateInputs, asyncErrorBoundary(create)],
  list: [asyncErrorBoundary(list)],
  update: [
    asyncErrorBoundary(validateTableId),
    validateReservation,
    validateCapacityAndAvailability,
    asyncErrorBoundary(update),
  ],
  updateFinishedTable: [
    asyncErrorBoundary(validateTableId),
    checkAvailabilityStatus,
    asyncErrorBoundary(updateFinishedTable),
  ],
}