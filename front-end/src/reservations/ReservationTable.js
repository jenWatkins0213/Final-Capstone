import React, { useEffect } from "react";
import {SeatButton, EditButton, CancelButton} from "../buttons/Buttons";
import "./Reservations.css";
// import {Dashboard} from "../dashboard/Dashboard"

// used in both the dashboard and the search pages
// isSearchTable and findClicked are particular to the search page
// only displaying certain pieces of data/information accordingly
export default function ReservationsTable({loadDashboard,reservations, isSearchTable, findClicked}){

    const criteria = {
    first_name: "First Name",
    last_name: "Last Name",
    people: "Qty", 
    reservation_time: "Time",
    mobile_number: "Mobile Number",
    status: "Status"
    }
    let criteriaKeys = Object.keys(criteria);
    let criteriaDisplay = Object.values(criteria);
  
    if (!isSearchTable)
        criteriaDisplay.push("Table Status");
    criteriaDisplay.push("Manage");

    useEffect(() => {
        if (isSearchTable && findClicked) {
            // do nothing
        } else {
            // loadDashboard();
        }
    }, [isSearchTable, findClicked]);

    // only displays the seat button if the reservation status is "booked"
    const ReservationRows = () => {
        return reservations.map((reservation, i) => {
            const AllRows = () => {
                return criteriaKeys.map((key, index) => {
                    if (key === "status"){
                        return (<td key={index} data-reservation-id-status={reservation.reservation_id}>{reservation.status}</td>)
                    }
                    return (<td key={index}>{reservation[key]}</td>);
                });
            };

            if (!isSearchTable){
                return (
                    <tr key={i}>
                        <AllRows />
                        {reservation.status === "booked" ?
                        <td><SeatButton reservation_id={reservation.reservation_id} /></td> :
                        <td>Table assigned</td>
                        }
                        <td>
                            {reservation.status === "booked" && <EditButton reservation_id={reservation.reservation_id} />}
                            { (reservation.status !== "cancelled" && reservation.status !== "finished") && <CancelButton reservation_id={reservation.reservation_id} /> }
                        </td>
                     
                    </tr>
                )
            }else{
                return (
                    <tr key={i}>
                        <AllRows />
                        <td>
                            { reservation.status === "booked" && <EditButton reservation_id={reservation.reservation_id} /> }
                            { (reservation.status !== "cancelled" && reservation.status !== "finished") && <CancelButton reservation_id={reservation.reservation_id} /> }
                        </td>
                    </tr>
                )
            }
        })
    }

    const NoReservations = () => {
        if (!isSearchTable){
            return (
                <h1>No reservations...</h1>
            )
        }else if (isSearchTable && findClicked){
            return (
                <h1>No reservations found...</h1>
            )
        }else{
            return null;
        }
    }

    const ReservationsTable = () => {
        return (
        <table className="table">
            <thead>
            <tr>
                {criteriaDisplay.map((info, index)=>{
                return <th scope="col" key={index}>{info}</th>
                })}
            </tr>
            </thead>
            <tbody>
                <ReservationRows />
            </tbody>
        </table>
        )
    }

    return (
        <div className="row-fluid">
            <div className="col-12 reservations-table">
                {reservations.length > 0 ? <ReservationsTable /> : <NoReservations />}
            </div>
        </div>
    )
}