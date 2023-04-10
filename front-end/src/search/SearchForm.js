import React, { useState } from "react";
import { search } from "../utils/api";

export default function SearchForm({setReservations, setFindClicked}){
    const [mobileNumber, setMobileNumber] = useState("");

    const onSearch = (evt) => {
        evt.preventDefault();
        
        setFindClicked(true);

        search(mobileNumber)
        .then(({data})=>{
            if (data.data.length === 0){
                setReservations([]);
            }else{
                setReservations(data.data);
            }
        })
        .catch((err)=>{
            console.log("error in attempting to set reservations particular to mobile number: ", err);
        })
    }

    return (
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <div className="float-end">
                        <h1>Search Form</h1>
                    </div>
                    <div className="row">
                    </div>
                    <hr className="mb-3 mt-0" />
                    <form onSubmit={ onSearch }>
                        <div className="row">
                            <div className="col-6">
                                <div className="mb-3">
                                    <label htmlFor="mobile_number" className="mb-1">Mobile Number</label>
                                    <input name="mobile_number" id="mobile_number" placeholder="555-5555" className="form-control" type="tel" onChange={(evt)=>setMobileNumber(evt.target.value)} required />
                                    <div className="mt-1">
                                        <button type="submit" className="btn btn-primary">Find</button>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}