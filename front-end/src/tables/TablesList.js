import React, { useEffect } from "react";
import { resetTable } from "../utils/api";
import "./tablesList.css";

// displays the tables data in a list off to the right of the page
export default function TablesList({ tables, loadDashboard, tablesError }) {
  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleFinishTable(evt) {
    evt.preventDefault();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This action cannot be undone."
      )
    ) {
      // reset table logic here
      const table_id = evt.target.value;
      resetTable({ table_id }).then(loadDashboard).catch(tablesError);
    }
  }

  function getListItem(table, index) {
    return (
      <li
        className="list-group-item d-flex justify-content-between align-items-start "
        key={index}
      >
        <div className="ms-2 me-auto">
          <div className="fw-bold">
            {table.table_name} - {table.capacity}
          </div>
          Can hold {table.capacity} people (table id: {table.table_id})
        </div>
        {table.availability === "free" ? (
          <span
            className="badge bg-primary rounded-pill"
            data-table-id-status={table.table_id}
          >
            {table.availability}
          </span>
        ) : (
          <>
            <button
              type="button"
              data-table-id-finish={table.table_id}
              value={table.table_id}
              className="btn btn-success"
              onClick={handleFinishTable}
            >
              finish
            </button>
            <span
              className="badge bg-danger rounded-pill"
              data-table-id-status={table.table_id}
            >
              {table.availability}
            </span>
          </>
        )}
      </li>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <h4>Tables List</h4>
        <ul className="list-group list-full-width">
          {tables.map((table, index) => getListItem(table, index))}
        </ul>
    </div>
    </div>
  );
}