/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";
import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
     .then(formatReservationDate)
     .then(formatReservationTime);
    // .then((data)=>{
    //   const reformattedTime = readableDateAndTime(data);
    //   return reformattedTime;

    // })
//   .then((reservations)=>reservations);
}

export async function getReservationById(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);

  return await fetchJson(url, { headers, signal }, []);
//   .then((reservations)=>reservations);
}

export async function createReservation(params, signal){
  const url = `${API_BASE_URL}/reservations`;
  return await axios.post(url, {data: params});
}

export async function newTable(params, signal){
  const url = `${API_BASE_URL}/tables`;
  return await axios.post(url, {data: params});
}

export async function listTables(params, signal) {
  let url = API_BASE_URL + "/tables";

  if (Object.keys(params).length > 0){
    url += "?"
    Object.entries(params).forEach(([key, value]) =>
      url += key + "=" + value
    );
  }
  return await fetchJson(url, { headers, signal }, []);
};

export async function updateTable(params){
  const { table_id, reservation_id, availability } = params;
  const data = {table_id, reservation_id, availability};

  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);

  return await axios.put(url, {data});
}

export async function resetTable(params){
  const { table_id } = params;
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await axios.delete(url);
}

// params are the status, reservation_id
export async function updateReservationStatus(params){
  const { status=null, reservation_id=null } = params;
  const data = {status};
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;

  return await axios.put(url, {data});
}

export async function search(mobile_number){
  const url = new URL(`${API_BASE_URL}/reservations?mobile_number=${mobile_number}`);
  
  return axios.get(url);
}

export async function editReservation(params){
  const { reservation_id } = params;
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;

  return await axios.put(url, {data: params});
}