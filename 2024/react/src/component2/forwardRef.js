import React, { forwardRef, useRef } from 'react';

const ForwardRef = () => {
    const ref = useRef();

    const handleClick = ()=>{
        ref.current.focus()
    }

    return (
        <form>
            <MyInput ref={ref}/>
            <button type="button" onClick={handleClick}>Edit</button>
        </form>
    )
}

const MyInput = forwardRef(function MyInput(props, ref) {
    const { label, ...otherProps } = props;

    return (
        <label>
            {label}
            <input ref={ref} />
        </label>
    )
})

export default ForwardRef;