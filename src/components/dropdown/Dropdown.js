import React from 'react';

export default function Dropdown({ children, text }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    React.useEffect(() => {
        if (isOpen) {
            const dropdownHeight = dropdownRef.current.offsetHeight;
            window.scrollBy({ top: dropdownHeight, behavior: 'smooth' });
        }
    }, [isOpen]);

    return (
        <div className='dropdown__container'>
            <button className={`dropdown__button${isOpen ? '_opened' : ''}`} onClick={toggleDropdown}>{text}</button>
            {isOpen && (
                <div className='dropdown__menu' ref={dropdownRef}>{children}</div>
            )}
        </div>
    );
}
