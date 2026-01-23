import React, { useState, useEffect } from 'react';

const HighOrderComponent = (Component) => {
    return function NewComponent() {
        const [isLoading, setIsLoading] = useState(true);

        useEffect(() => {
            setInterval(() => {
                setIsLoading(false);
            }, 1000)
        }, [])

        if (isLoading) {
            return (
                <h2>Loading</h2>
            )
        }



        return (
            <Component />
        )
    }
}

export default HighOrderComponent;