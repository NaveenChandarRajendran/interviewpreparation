import React, { useState, useEffect } from "react";
import axios from 'axios';

const Planets = () => {
    const [planetList, setPlanetList] = useState([]);

    async function callPlanterList() {
        const response = await axios.get("https://swapi.dev/api/planets/");
        if (response.status === 200) {
            setPlanetList(response.data.results);
        }
    }

    useEffect(() => {
        callPlanterList();
    }, [])

    const handleChange = (value) => {
        const filterPlanetList = planetList.filter((planet) => planet.name.toLowerCase().includes(value));
        if (filterPlanetList.length > 0) {
            setPlanetList(filterPlanetList)
        }
        if (!value) {
            callPlanterList()
        }
    }


    return (
        <>
            <input type="text" placeholder="Search" onChange={(e) => handleChange(e.target.value)} />
            {planetList.length > 0 && planetList.map((planet) => (
                <p>{planet.name}</p>
            ))}
        </>
    )
}

export default Planets;