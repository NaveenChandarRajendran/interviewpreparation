import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVehicles } from "../slice/starwarSlice";

const StarWarVehicle = () => {
    const dispatch = useDispatch();
    const list = useSelector((state)=> state.starWar.apiData);
    const apiDataRequest = useSelector((state)=> state.starWar.isRequesting);

    useEffect(() => {
        dispatch(getVehicles());
    }, [])

    return (
        <>
        <h2>Starwar vehicle</h2>
        {apiDataRequest ? "Loading": JSON.stringify(list)}
        </>
    )
}

export default StarWarVehicle;