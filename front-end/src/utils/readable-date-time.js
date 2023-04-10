function getMonth(month){
    switch(month){
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
        default:
            return "";
    }
}

function getDayOfWeek(day){
    switch(day){
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        case 7:
            return "Sunday";
        default:
            return "";
    }
}

export function getSimpleDate(unformattedDate){
    if (!unformattedDate) return;

    const date = new Date(unformattedDate);

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = String(date.getFullYear()).split("20")[1];
    
    return `${month}/${day}/${year}`;
}

export function getFormalDate(unformattedDate){
    
    const date = new Date(unformattedDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();
    const formalMonth = getMonth(month);
    const dayOfWeek = getDayOfWeek(date.getDay());

    return `${dayOfWeek}, ${formalMonth} ${day}, ${year}`;
}

export function getSimpleTime(unformattedTime){
    if (!unformattedTime) return;

    if (!unformattedTime.includes("am") && !unformattedTime.includes("pm")){
        const splitTime = unformattedTime.split(":");
        let hour = Number(splitTime[0]);
        const minutes = splitTime[1];
        let meridian = "am";

        if (hour > 12){
            hour -= 12;
            meridian = "pm";
        };

        const result = `${hour}:${minutes}${meridian}`;
        return result;
    }
}

export function getSimpleDateAndTime(dateStr){
    const dateTimeArr = dateStr.split("T");
    const date = getSimpleDate(dateTimeArr[0]);
    const time = getSimpleTime(dateTimeArr[1]);
    return `${date} @ ${time}`;
}

export function readableDateAndTime(reservations){
    if (Array.isArray(reservations) && reservations.length > 0){
        const readableReservations = reservations.map((res)=>{
            const reservation_date = getSimpleDate(res.reservation_date);
            const reservation_time = getSimpleTime(res.reservation_time);
            const created_at = getSimpleDateAndTime(res.created_at);
            const updated_at = getSimpleDateAndTime(res.updated_at);

            res.reservation_date = reservation_date;
            res.reservation_time = reservation_time;
            res.created_at = created_at;
            res.updated_at = updated_at;

            return res;
        })
        return readableReservations;
    }
}