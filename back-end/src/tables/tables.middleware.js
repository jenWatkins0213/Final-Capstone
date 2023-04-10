const tableService = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

function errorCallback(status, message, next){
    return next({status: status, message: message});
}

// checks for availability, table_name, capacity, and reservation_id
function validateInputs(req, res, next){
    const requiredFields = ["table_name", "capacity"];
    const { data=null } = req.body;
    
    if (!data) return errorCallback(400, "Please provide name, capacity, and availability fields in your request", next);

    const keys = Object.keys(data);
    const params = {};

    // if any of the fields are missing, return an error
    requiredFields.forEach((field)=>{
        if (!keys.includes(field)){
            return errorCallback(400, `Please include the following field: ${field}`, next);
        } else {
            if (field === "table_name"){
                if (data[field].length < 2){
                    return errorCallback(400, "Please provide a table_name with at least two characters", next);
                }
            }else if (field === "capacity"){
                if (typeof data[field] !== "number" || data[field] < 1) {
                    return errorCallback(400, "Please provide a capacity of type number with a value greater than 0", next);
                  }
            }
            params[field] = data[field];
        }
    });

    if (!keys.includes("availability")){
        params.availability = "free";
    }

    if (!keys.includes("reservation_id")){
        params.reservation_id = null;
    }else{
        params.reservation_id = data.reservation_id;
        params.availability = "occupied";
    }

    res.locals.params = params;
    
    next();
}

// makes sure table exists in the database
async function validateTableId(req, res, next){
    const { table_id } = req.params;

    if (!table_id || isNaN(table_id)) return errorCallback(400, "Please enter a valid table_id.", next);

    const data = await tableService.getById(table_id);

    if (!data){
        return errorCallback(404, `Table Id ${table_id} is invalid. Please enter a valid table_id.`, next);
    }

    res.locals.table = data;
    next();
}

// makes sure reservation exists in the database
async function validateReservation(req, res, next){
    const { data = null } = req.body;
    const { table_id = null } = req.params;

    if (!data) return errorCallback(400, 'data was missing from body', next);

    const { reservation_id } = data;
    if (!reservation_id) return errorCallback(400, 'reservation_id was missing from body.data', next);

    const reservation = await reservationService.getById(reservation_id);
    const table = await tableService.getById(table_id);

    if (!reservation) return errorCallback(404, `reservation_id: ${reservation_id} does not exist`, next); 
    if (!table) return errorCallback(404, "This table doesn't exist", next);

    if (reservation.status === "seated"){
        return errorCallback(400, "This reservation is already seated...", next);
    }

    res.locals.reservation = reservation;
    res.locals.table = table;
    next();
}

function validateCapacityAndAvailability(req, res, next){
    const reservation = res.locals.reservation;
    const table = res.locals.table;

    if (table.availability != "free"){
        return errorCallback(400, "This table is occupied - please choose a different table", next);
    }
    
    if (reservation.people > table.capacity){
        return errorCallback(400, "Quantity of people in reservation is larger than table capacity; please try again", next);
    }
    next();
}

// particular to "finishing" a table - makes sure that the table is occupied before setting its status to "free",
// otherwise, return an error
function checkAvailabilityStatus(req, res, next){
    const { availability = null } = res.locals.table;

    if (!availability || availability === "free") return errorCallback(400, `table is not occupied`, next);

    next();
}

module.exports = {
    validateInputs,
    validateTableId,
    validateReservation,
    validateCapacityAndAvailability,
    checkAvailabilityStatus
}