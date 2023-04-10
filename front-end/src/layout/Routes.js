import React, { useState, useEffect } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationForm from "../reservations/ReservationForm";
import TablesForm from "../tables/TablesForm";
import ReservationSeat from "../reservations/ReservationSeat";
import Search from "../search/Search";
import { listReservations, listTables } from "../utils/api";

// passes loadDashboard to any pages that display information (non-forms)
// in order to refresh reservation and table data whenever there are any changes made to reservations and tables
function Routes() {
  const query = useQuery();
  const date = query.get("date") || today();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);

  const loadDashboard = () => {
    setReservations([]);
    setTables([]);

    setReservationsError(null);
    setTablesError(null);

    const abortController = new AbortController();

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables({}, abortController.signal)
      .then(setTables)
      .catch(setTablesError);

    return () => abortController.abort();
  };

  useEffect(loadDashboard, [date]);

  return (
    <Switch>
      <Route path="/search">
        <Search loadDashboard={loadDashboard} />
      </Route>
      <Route path="/tables/new">
        <TablesForm />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeat
          date={date}
          tables={tables}
          loadDashboard={loadDashboard}
          tablesError={tablesError}
        />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date}
          reservations={reservations}
          reservationsError={reservationsError}
          tables={tables}
          tablesError={tablesError}
          loadDashboard={loadDashboard}
        />
      </Route>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;