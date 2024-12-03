import { useState } from 'react';
import './dash.css'

export const Dashboard = ({cityName})=>{
    const [city,setCity] = useState("");

    function handleCity(e){
        console.log(e.target.value)
        setCity(e.target.value)
    }
    function getCity(){
        cityName(city);
    }

    return <>
        <div className="search-bar">
            <input type="text" 
            onChange={handleCity} 
            value={city}
            placeholder="Enter city"/>

            <button onClick={getCity}>Get forecast</button>
        </div>
        
    </>
}