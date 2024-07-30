import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./starwars/Login";
import Planets from "./starwars/Planets";
import ErrorPage from "./starwars/ErrorPage";
import PlanetDetails from "./starwars/PlanetDetails";
import Register from "./code/register";
import MCQ from "./code/mcq";
import StarWarVehicle from "./code/starwarvehicle";
import LayoutEffectExample from "./component2/LayoutEffect";
import ForwardRef from "./component2/forwardRef";
import ToggleApp from "./component2/compoundComponent";
import TableStructure from "./component2/TableStructure";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <ErrorPage />
    },
    {
        path: "/planet",
        element: <Planets />,
        children: [
            {
                path: ':id',
                element: <PlanetDetails />
            }
        ]
    },
    {

        path: '/planet/:id',
        element: <PlanetDetails />

    },
    {
        path: '/registor',
        element: <Register />
    },
    {
        path: "/mcq",
        element: <MCQ />
    },
    {
        path: "/starwarvehicle",
        element: <StarWarVehicle />
    },
    {
        path: "/layoutEffect",
        element: <LayoutEffectExample />
    },
    {
        path: "/forwardref",
        element: <ForwardRef />
    },
    {
        path: "/compoundcomponent",
        element: <ToggleApp />
    },
    {
        path: "/tablestruc",
        element: <TableStructure />
    }

])

export default routes;