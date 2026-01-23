import React, { createContext, useContext } from 'react';

const UserContext = createContext();

const Parent = () => {
    const user = { name: "Naveen" }

    return (
        <UserContext.Provider value={user}>
            <ChildOne />
            <ChildTwo />
        </UserContext.Provider>
    )
}

const ChildOne = () => {
    const user = useContext(UserContext);
    return (
        <p>User name is {user.name}</p>
    )
}

const ChildTwo = () => {
    const user = useContext(UserContext);
    return (
        <p>User name is {user.name}</p>
    )
}

export default Parent;