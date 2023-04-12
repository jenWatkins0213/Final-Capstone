import React, { useEffect, useCallback } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsTable from "../reservations/ReservationTable";
import ReservationsNavigation from "../reservations/ReservationNavigation";
import TablesList from "../tables/TablesList";
import "./Dashboard.css";

function Dashboard({
  date,
  reservations,
  reservationsError,
  tables,
  tablesError,
  loadDashboard,
}) {
  const memoizedLoadDashboard = useCallback(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    memoizedLoadDashboard();
  }, [memoizedLoadDashboard]);

  return (
    <main>
      <div>
        {reservationsError && <ErrorAlert error={reservationsError} />}
        {tablesError && <ErrorAlert error={tablesError} />}

        <div className="row-fluid">
          <div className="col-12">
            <h1>Dashboard</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 col-lg-8">
            <ReservationsNavigation date={date} />
            <ReservationsTable
              reservations={reservations}
              isSearchTable={false}
              loadDashboard={memoizedLoadDashboard}
            />
          </div>
          <div className="col-xs-12 col-md-4 col-lg-4">
            <TablesList
              tables={tables}
              loadDashboard={memoizedLoadDashboard}
              tablesError={tablesError}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
