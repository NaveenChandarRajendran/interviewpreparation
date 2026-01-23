import { createPortal } from "react-dom";

const Portal = () => {
    return (
        <div>
            <p>This is the parent Component</p>
            {createPortal(
                <p>This is the child placed in the body</p>,
                document.body
            )}
        </div>
    );
}

export default Portal;