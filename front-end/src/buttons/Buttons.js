import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";
import "./Buttons.css";

// redirects user to the reservation seat page
export function SeatButton({ reservation_id }) {
  return (
    <Link
      to={`/reservations/${reservation_id}/seat`}
      href={`/reservations/${reservation_id}/seat`}
    >
      <button type="button" className="btn btn-primary table-btn manage-btn">
        Seat
      </button>
    </Link>
  );
}
// redirects user to the reservation edit page
export function EditButton({ reservation_id }) {
  return (
    <Link
      to={`/reservations/${reservation_id}/edit`}
      href={`/reservations/${reservation_id}/edit`}
    >
      <button type="button" className="btn btn-success table-btn manage-btn">
        Edit
      </button>
    </Link>
  );
}

// cancels reservation and reloads tables/reservations data
export function CancelButton({ reservation_id, loadDashboard }) {
  const onCancel = (evt) => {
    evt.preventDefault();

    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      updateReservationStatus({ status: "cancelled", reservation_id })
        .then(loadDashboard)
        .catch((err) => {
          console.log("error w/cancelling reservation: ", err);
        });
    }
  };

  return (
    <button
      type="button"
      className="btn btn-danger table-btn manage-btn"
      data-reservation-id-cancel={reservation_id}
      onClick={onCancel}
    >
      Cancel
    </button>
  );
}