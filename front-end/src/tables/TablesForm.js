import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { newTable } from "../utils/api";

export default function TablesForm(){
    const [reservationsError, setReservationsError] = useState(null);
    const [table_name, set_table_name] = useState("");
    const [capacity, set_capacity] = useState(0);

    const history = useHistory();
    
    const validateAndCreateTable = (evt) => {
        evt.preventDefault();

        if (!table_name){
            setReservationsError({
                message: "Please provide a table name"
            })
        };

        if (table_name.length < 2){
            setReservationsError({
                message: "Plese provide a table name that is 2 or more characters"
            })
        }
        
        if (!capacity || isNaN(capacity) || capacity <= 0){
            setReservationsError({
                message: "Please enter a capacity of type number with a value larger than 0"
            })
        }

        const tableProps = {table_name, capacity};
        newTable(tableProps)
            .then((data)=>{
                history.push('/dashboard');
            })
            .catch(setReservationsError);
    }


    const setValues = (evt) => {
        switch(evt.target.id){
            case "table_name":
                set_table_name(evt.target.value);
                break;
            case "capacity":
                set_capacity(evt.target.value);
                break;
            default:
                break;
        }
    };

    return (
        <div className="row">
            <div className="card">
                <div className="float-end">
                    <h1>Tables Page!</h1>
                </div>
                <div className="row">
                    <ErrorAlert error={reservationsError} />
                </div>
                <hr className="mb-3 mt-0" />
                <form onSubmit={validateAndCreateTable}>
                    <div className="row">
                        <div className="mb-3">
                            <label htmlFor="table_name">Table Name</label>
                            <input name="table_name" id="table_name" placeholder="Table Name" className="form-control" type="text" defaultValue={table_name} required onChange={setValues} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-3">
                            <label htmlFor="capacity">Capacity</label>
                            <input name="capacity" id="capacity" placeholder={capacity} className="form-control" type="number" min="1" defaultValue={capacity} required onChange={setValues} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="mb-2">
                        <button type="submit" className="btn btn-primary float-end">Submit</button>
                        <button type="button" className="btn btn-secondary float-end" onClick={()=> history.goBack()}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}