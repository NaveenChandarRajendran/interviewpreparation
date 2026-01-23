import React, { useContext, createContext, useState } from 'react';

const ToggleContext = createContext();

const Toggle = ({ children }) => {
    const [isOpen, setOpen] = useState(false);

    const toggle = () => {
        setOpen((prevState) => !prevState);
    }

    return (
        <ToggleContext.Provider value={{ isOpen, toggle }}>
            {children}
        </ToggleContext.Provider>
    )
}

const Button = ({ children }) => {
    const { toggle } = useContext(ToggleContext);
    return (
        <button onClick={toggle}>
            {children}
        </button>
    )
}

const Status = ({ children }) => {
    const { isOpen } = useContext(ToggleContext);

    return (
        <div>
            {isOpen ? 'On' : 'Off'}
        </div>
    )
}

Toggle.Button = Button;
Toggle.Status = Status;

const ToggleApp = () => {
    return (
        <Toggle>
            <Toggle.Button>Toggle</Toggle.Button>
            <Toggle.Status />
        </Toggle>
    )
}

export default ToggleApp;

