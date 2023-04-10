const service = require("./reservations.service");

function validateParams(req, res, next) {
  const { data = null } = req.body;

  if (!data) next({ status: 400, message: "Missing all parameters" });

  const requiredParams = [
    "first_name",
    "last_name",
    "reservation_date",
    "reservation_time",
    "mobile_number",
    "people",
  ];

  const givenParams = Object.keys(data);
  // iterate through required params and cross-check against givenParams
  // if givenParams is missing any of the requiredParams, return 400
  for (let n = 0; n < requiredParams.length; n++) {
    const param = requiredParams[n];

    if (!givenParams.includes(param) || !data[param]) {
      return next({
        status: 400,
        message: `Request is missing ${requiredParams[n]}`,
      });
    }
  }

  // check as to whether or not a date is being updated and if so, make sure the status is allowed
  if (data.status && data.status !== "booked" && data.status !== "cancelled") {
    return next({
      status: 400,
      message: `${data.status} is an invalid reservation status`,
    });
  }

  // makes sure the people param is of the right type and has a proper minimum
  if (
    typeof data.people != "number" ||
    !data.people ||
    data.people === 0
  ) {
    return next({
      status: 400,
      message: "The quantity of people must comprise of at least 1 person",
    });
  }

  const dateTest = new Date(data.reservation_date) || null;

  if (!dateTest || dateTest == "Invalid Date")
    return next({
      status: 400,
      message: "Please return a valid reservation_date",
    });

  const reservationsStart = new Date(data.reservation_date + " " + "10:30");
  const reservationsEnd = new Date(data.reservation_date + " " + "21:30");
  const dateTimeStr = data.reservation_date + " " + data.reservation_time;
  const prospectiveDate = new Date(data.reservation_date);

  const today = new Date();
  const dateTimeObj = new Date(dateTimeStr);

  // general date validity check
  if (!dateTimeObj || dateTimeObj == "Invalid Date") {
    return next({
      status: 400,
      message:
        "the date or time you chose was invalid; please enter a valid reservation_time and reservation_date",
    });
  }
  
  // checks to see if the restaurant is open on a Tuesday
  if (prospectiveDate.getDay() === 1) {
    return next({
      status: 400,
      message:
        "The restaurant is closed on Tuesdays; please choose a different date",
    });
  }

  // time was easier to measure as a Date obj, so this checks that the reservation time is booked between the open and close times
  if (dateTimeObj < reservationsStart || dateTimeObj > reservationsEnd) {
    return next({
      status: 400,
      message:
        "The restaurant opens at 10:30am and closes at 10:30pm. Please select a time between 10:30am and 9:30pm",
    });
  }

  // checks both the year and the date to make sure that the date is scheduled for a time in the future
  if (
    prospectiveDate.getUTCDate() < today.getUTCDate() &&
    prospectiveDate.getUTCFullYear() <= today.getUTCFullYear()
  ) {
    return next({
      status: 400,
      message: "Please schedule your reservation for a date/time in the future",
    });
  }

  next();
}

// only queries allowed are for 'mobile_number' and 'date'
function validateQuery(req, res, next) {
  const { query } = req;
  const allowedProperties = ["mobile_number", "date"];

  for (const property in query) {
    if (!allowedProperties.includes(property)) {
      return next({
        status: 400,
        message: `${property} is not a valid query -- please provide either a date or a mobile_number`,
      });
    }
  }

  next();
}

// checks the Id against what is saved in the database
async function validateId(req, res, next) {
  const { reservation_id } = req.params;

  if (!reservation_id)
    return next({ status: 404, message: "Please provide a reservation_id" });

  const data = await service.getById(reservation_id);

  if (!data)
    return next({
      status: 404,
      message: `reservation w/reservation_id ${reservation_id} does not exist`,
    });

  res.locals.reservation = data;

  return next();
}

// status is very particular
function validateStatus(req, res, next) {
  const { status = null } = req.body.data;
  const { reservation = null } = res.locals;

  // theoretically shouldn't run as reservations are tied to the 'reservation_id' param in the url
  // would imply the user is forcibly attempting to change status through the url
  if (!reservation)
    return next({ status: 400, message: "This reservation does not exist" });

  // makes sure a status exists in body.data
  if (!status)
    return next({
      status: 400,
      message: "Please provide a valid status for this reservation",
    });

  // status should only either be seated, finished, or cancelled
  if (
    status != "booked" &&
    status !== "seated" &&
    status !== "finished" &&
    status !== "cancelled"
  )
    return next({ status: 400, message: `${status} is not a valid status ` });

  // makes sure the reservation status is in a state where it can be changed
  if (reservation.status === "finished" || reservation.status === "cancelled")
    return next({
      status: 400,
      message:
        "Reservation status cannot be updated once in 'finished' or 'cancelled' state",
    });

  res.locals.status = status;
  next();
}

module.exports = {
  validateParams,
  validateQuery,
  validateId,
  validateStatus,
};