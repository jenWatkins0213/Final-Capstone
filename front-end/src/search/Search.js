import React, { useState, useEffect } from "react";
import SearchForm from "./SearchForm";
import ReservationsTable from "../reservations/ReservationTable";

export default function Search(){
    const [ reservations, setReservations ] = useState([]);
    const [ findClicked, setFindClicked ] = useState(false);

    // reloads reservation data when findClicked state changes
    useEffect(() => {
        if (findClicked) {
            const searchNumber = "change later"
            fetch(`/api/reservations?mobile_number=${searchNumber}`)
                .then((response) => response.json())
                .then((data) => {
                    setReservations(data);
                    setFindClicked(false);
                })
                .catch((error) => console.log(error));
        }
    }, [findClicked]);

    return (
        <div>
            <SearchForm setFindClicked={setFindClicked} />
            <ReservationsTable reservations={reservations} isSearchTable={true} />
        </div>
    )
}
