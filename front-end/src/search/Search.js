import React, { useState } from "react";
import SearchForm from "./SearchForm";
import ReservationsTable from "../reservations/ReservationTable";

export default function Search({loadDashboard}){
    const [ reservations, setReservations ] = useState([]);
    const [ findClicked, setFindClicked ] = useState(false);

    return (
        <div>
            <SearchForm setReservations={setReservations} setFindClicked={setFindClicked} />
            <ReservationsTable reservations={reservations} isSearchTable={true} findClicked={findClicked} loadDashboard={loadDashboard} />
        </div>
    )
}