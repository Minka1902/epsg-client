import React from "react";

// ! <Checkbox onToggle={onToggle} text={"Hello world!"} />
export default function Checkbox({ onToggle, text, checked }) {
    const handleToggle = (evt) => {
        onToggle(evt);
    };

    return (
        <label className="checkbox-label">
            <input
                type="checkbox"
                id="topo-checkbox"
                className="checkbox-input"
                checked={checked}
                onChange={handleToggle}
            />
            <span className="checkbox-custom"></span>
            <span className="checkbox-text">{text}</span>
        </label>
    );
}
