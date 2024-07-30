import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';

const LayoutEffectExample = () => {
    const [width, setWidth] = useState(0);
    const ref = useRef();

    useEffect(()=>{
        console.log("Use Effect");
    },[])

    useLayoutEffect(() => {
        // Measure the width of the element
        console.log("Use Layout");
        const newWidth = ref.current.getBoundingClientRect().width;
        setWidth(newWidth);
    }, []); // Empty dependency array means it runs once after the first render

    return (
        <div>
            <h2>Element Width:</h2>
            <div ref={ref}>
                <p>Width: {width}px</p>
            </div>
        </div>
    );
};

export default LayoutEffectExample;
