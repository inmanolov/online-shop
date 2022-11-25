import React from "react";

const Button = ({ name, clickHandler, clas }) => {
    return(
        <button type="button" onClick={clickHandler} className={`${clas}`} >{name}</button>
    );
};

export default Button;