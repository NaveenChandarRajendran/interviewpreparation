import React from 'react';
import HighOrderComponent from './HighOrderComponent';

function UsingHighOrder() {
    return (
        <div>we are using high order component</div>
    )
}

const EnhancedComponent = HighOrderComponent(UsingHighOrder);

export default EnhancedComponent;