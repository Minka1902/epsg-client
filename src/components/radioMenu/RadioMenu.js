import React from "react";

export default function RadioMenu({ children }) {
    const [mode, setMode] = React.useState('form');

    const handleModeChange = (event) => {
        setMode(event.target.value);
    };

    return (
        <div className='radio__menu-container'>
            <div className='radio__container'>
                <label className='redio__label'>
                    <input
                        type="radio"
                        value="form"
                        checked={mode === 'form'}
                        onChange={handleModeChange}
                    />
                    Manual
                </label>
                <label className='radio__label'>
                    <input
                        type="radio"
                        value="file"
                        checked={mode === 'file'}
                        onChange={handleModeChange}
                    />
                    File
                </label>
            </div>
            {mode === 'form' ?
                children[0]
                :
                children[1]
            }
        </div>
    );
};
