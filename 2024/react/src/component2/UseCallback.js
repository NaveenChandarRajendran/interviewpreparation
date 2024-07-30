import React, { useCallback, useState } from 'react';

const Child = React.memo(
    ({ handleClick }) => {
        console.log("Child component");
        return (
            <button onClick={handleClick}>Click me</button>
        )
    }
)

const UseCallBackParent = () => {
    const [count, setCount] = useState(0);

    // const handleClick = () => {
    //     console.log("Button Click");
    // }

    const handleClick = useCallback(() => {
        console.log("Button Click");
    }, [])

    return (
        <>
            <p>Count : {count}</p>
            <button onClick={() => setCount((prevState) => prevState + 1)}>Increment</button>
            <Child handleClick={handleClick} />
        </>
    )

}

export default UseCallBackParent;