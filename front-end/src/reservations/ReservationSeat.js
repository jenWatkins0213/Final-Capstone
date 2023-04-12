import React, { useState, useEffect } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservationById, updateTable } from "../utils/api";
import { useParams, useHistory } from "react-router-dom";

// particular to the reservation seat page
export default function ReservationSeat({ tables }) {
  const [tableAssignmentError, setTableAssignmentError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(0);
  const { reservation_id } = useParams();
  const [reservationInfo, setReservationInfo] = useState({});
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    getReservationById(reservation_id, abortController.signal)
      .then(setReservationInfo)
      .catch(setTableAssignmentError);

    return () => abortController.abort();
  }, [reservation_id]);

  const handleTableAssignmentSubmit = (evt) => {
    evt.preventDefault();
    if (tables) {
      const requestBody = {
        table_id: tables[selectedTable].table_id,
        reservation_id,
        availability: "occupied",
      };

      updateTable(requestBody)
        .then(() => {
          history.push(`/dashboard?date=${reservationInfo.reservation_date}`);
        })
        .catch((err) => {
          if (err) setTableAssignmentError(err);
        });
    }

    if (tables[selectedTable].availability !== "free") {
      setTableAssignmentError({
        message:
          "This table is occupied during this time.. please select a different table",
      });
    }
  };

  const onTableSelect = (evt) => {
    setSelectedTable(evt.target.value);
  };

  const tableOptions = () => {
    return tables.map((table, index) => {
      return (
        <option key={index} value={index}>
          {table.table_name} - {table.capacity}
        </option>
      );
    });
  };

  return (
    <div className="row">
      <div className="card">
        <div className="float-end">
          <h1>
            Assign Table For Reservation {reservation_id} (Party of{" "}
            {reservationInfo.people})
          </h1>
        </div>
        <div className="row">
          <ErrorAlert error={tableAssignmentError} />
        </div>
        <hr className="mb-3 mt-0" />
        <form onSubmit={handleTableAssignmentSubmit}>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <label htmlFor="table_select">Table Selection</label>
                <select
                  name="table_id"
                  className="form-select form-select-lg mb-3"
                  aria-label=".form-select-lg table-select"
                  defaultValue={0}
                  placeholder="choose table"
                  onChange={onTableSelect}
                >
                  {tableOptions()}
                </select>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => history.goBack()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
