import React from 'react';
import Dropdown from '../dropdown/Dropdown';

export default function DropdownControl({ children }) {
    const [isForm1Open, setIsForm1Open] = React.useState(false);
    const [isForm2Open, setIsForm2Open] = React.useState(false);

    const closeDropdowns = () => {
        setIsForm1Open(false);
        setIsForm2Open(false);
    }

    const toggleDropdown1 = () => {
        closeDropdowns();
        setIsForm1Open(!isForm1Open);
    };

    const toggleDropdown2 = () => {
        closeDropdowns();
        setIsForm2Open(!isForm2Open);
    };

    return (
        <>
            <Dropdown toggleDropdown={toggleDropdown1} text='Lat/Lng' isOpen={isForm1Open}>
                {children[0]}
            </Dropdown>
            <Dropdown toggleDropdown={toggleDropdown2} text='Find coordinates by EPSG' isOpen={isForm2Open}>
                {children[1]}
            </Dropdown>
        </>
    );
}