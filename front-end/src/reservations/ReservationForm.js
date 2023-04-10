import React, { useState, useEffect } from "react";
import { createReservation, editReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservationById } from "../utils/api";
import { useParams } from "react-router";

import "./Reservations.css";

export default function ReservationForm() {
  const today = new Date();
  const history = useHistory();

  const [reservationsError, setReservationsError] = useState(null);
  const [first_name, set_first_name] = useState("");
  const [last_name, set_last_name] = useState("");
  const [reservation_date, set_reservation_date] = useState(today);
  const [reservation_time, set_reservation_time] = useState("17:30");
  const [mobile_number, set_mobile_number] = useState("");
  const [people, set_people] = useState(null);

  // particular to edit page
  const { reservation_id = null } = useParams();
  const [existingReservation, setExistingReservation] = useState({});

  // const loadReservation = () => {
  //   if (!reservation_id) return;

    getReservationById(reservation_id)
      .then((reservation) => {
        const rDate = reservation.reservation_date.split("T")[0];
        set_first_name(reservation.first_name);
        set_last_name(reservation.last_name);
        set_reservation_date(rDate);
        set_reservation_time(reservation.reservation_time);
        set_mobile_number(reservation.mobile_number);
        set_people(reservation.people);
        setExistingReservation(reservation);
      })
      .catch((err) => console.log("there was an error: ", err));
  // };

  // refreshes data on reservations upon page load
  useEffect(() => {
    // effect code here
  }, [reservation_id]);

  const handleNewReservationSubmit = (evt) => {
    evt.preventDefault();

    const inputs = {
      first_name,
      last_name,
      reservation_date,
      reservation_time,
      mobile_number,
      people,
    };

    if (validFormInputs(inputs)) {
      // people seems to end up being cast as a string; changing it to a number here
      inputs.people = Number(inputs.people);

      if (!reservation_id) {
        createReservation(inputs)
          .then((feedback) => {
            history.push(`/dashboard?date=${reservation_date}`);
          })
          .catch(setReservationsError);
      } else {
        const updatedReservation = { ...existingReservation, ...inputs };
        editReservation(updatedReservation)
          .then((feedback) => {
            history.push(`/dashboard?date=${reservation_date}`);
          })
          .catch(setReservationsError);
      }
    } else {
      return;
    }
  };

  // sets the values dynamically as the user enters them
  const setValues = (evt) => {
    switch (evt.target.id) {
      case "first_name":
        set_first_name(evt.target.value);
        break;
      case "last_name":
        set_last_name(evt.target.value);
        break;
      case "reservation_date":
        set_reservation_date(evt.target.value);
        break;
      case "reservation_time":
        set_reservation_time(evt.target.value);
        break;
      case "mobile_number":
        set_mobile_number(evt.target.value);
        break;
      case "people":
        set_people(Number(evt.target.value));
        break;
      default:
        break;
    }
  };

  // if any of the inputs are incorrect, return false and display error
  // if all inputs are correct, return true and allow posting of data
  const validFormInputs = (inputs) => {
    const keys = Object.keys(inputs);

    for (let n = 0; n < keys.length; n++) {
      const key = keys[n];
      const value = inputs[key];
      switch (key) {
        case "first_name":
          if (!value || value.length < 2) {
            setReservationsError({
              message:
                "Please provide a first name with at least two alphabetical characters",
            });
            return false;
          }
          break;
        case "last_name":
          if (!value || value.length < 1) {
            setReservationsError({
              message:
                "Please provide a last name with at least one alphabetical character",
            });
            return false;
          }
          break;
        case "reservation_date":
          const prospectiveDateTime = new Date(value + "T" + reservation_time);
          const prospectiveYear = prospectiveDateTime.getUTCFullYear();
          const currentYear = today.getUTCFullYear();
          const prospectiveDate = prospectiveDateTime.getUTCDate();
          const currentDate = today.getUTCDate();

          if (prospectiveDate < currentDate && prospectiveYear <= currentYear) {
            setReservationsError({
              message: "Please select a date in the future",
            });
            return false;
          }

          break;
        case "reservation_time":
          const timeInQuestion = new Date(`${reservation_date} {value}`);
          const firstReservations = new Date(
            `${reservation_date} 10:30:00`
          );
          const lastReservations = new Date(
            `${reservation_date} 21:30:00`
          );
          const timeNow = new Date();

          if (timeInQuestion < timeNow) {
            setReservationsError({
              message: "Please select a time in the future",
            });
            return false;
          } else if (timeInQuestion < firstReservations) {
            setReservationsError({
              message:
                "The restaurant is not accepting reservations at this hour. Please choose a time at or after 10:30am",
            });
            return false;
          } else if (timeInQuestion > lastReservations) {
            setReservationsError({
              message:
                "The restaurant is not accepting reservations at this hour. Please choose a time before 9:30pm",
            });
            return false;
          }
          break;
        case "mobile_number":
          if (value.match(/[a-zA-Z]/)) {
            setReservationsError({
              message: "Please enter a valid phone number",
            });
            return false;
          }

          let mnParsed = value.split("");
          let rawMobile = "";
          for (let n = 0; n < mnParsed.length; n++) {
            if (mnParsed[n].match(/[0-9]/)) rawMobile += mnParsed[n];
          }
          // 10 numbers is the area code + phone number; 11 would be with the country code
          if (rawMobile.length < 7 || rawMobile.length > 11) {
            setReservationsError({
              message: "Please input a valid phone number",
            });
            return false;
          }

          break;
        default:
          break;
      }
    }
    return true;
  };

  return (
    <div className="row">
      <div className="card">
        <div className="float-end">
          {reservation_id ? (
            <h1>Edit Reservation</h1>
          ) : (
            <h1>New Reservation</h1>
          )}
        </div>
        <div className="row">
          <ErrorAlert error={reservationsError} />
        </div>
        <hr className="mb-3 mt-0" />
        <form onSubmit={handleNewReservationSubmit}>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="first_name">First Name</label>
                <input
                  name="first_name"
                  id="first_name"
                  placeholder="First Name"
                  className="form-control"
                  type="text"
                  defaultValue={first_name}
                  required
                  onChange={setValues}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="last_name">Last Name</label>
                <input
                  name="last_name"
                  id="last_name"
                  placeholder="Last Name"
                  className="form-control"
                  type="text"
                  defaultValue={last_name}
                  required
                  onChange={setValues}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="reservation_date">Reservation Date</label>
                <input
                  name="reservation_date"
                  id="reservation_date"
                  className="form-control"
                  type="date"
                  required
                  placeholder={reservation_date}
                  value={reservation_date}
                  onChange={setValues}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="reservation_time">Reservation Time</label>
                <input
                  name="reservation_time"
                  id="reservation_time"
                  className="form-control"
                  type="time"
                  required
                  defaultValue={reservation_time}
                  onChange={setValues}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="people">Qty of Guests</label>
                <input
                  name="people"
                  id="people"
                  className="form-control"
                  onChange={setValues}
                  type="number"
                  defaultValue={people}
                ></input>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="phone">Phone</label>
                <input
                  name="mobile_number"
                  id="mobile_number"
                  className="form-control"
                  placeholder={mobile_number}
                  type="tel"
                  onChange={setValues}
                  defaultValue={mobile_number}
                  required
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="mb-2">
              <button type="submit" className="btn btn-primary float-end">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-secondary float-end"
                onClick={() => history.goBack()}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}