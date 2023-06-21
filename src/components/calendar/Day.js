import React from "react";

export default function Day({ day, refrence, row, setInfo, toggleOpen, isClose, month, closeAll }) {
    const [isSelected, setIsSelected] = React.useState(false);

    const createEvent = (evt) => {
        closeAll();
        setIsSelected(!isSelected);
        toggleOpen();
        if (evt.target.children[1]) {
            setInfo(evt.target.children[1].textContent);
            const dropdownHeight = refrence.current.offsetHeight;
            window.scrollBy({ top: dropdownHeight, behavior: 'smooth' });
        } else {
            if (evt.target.classList.contains('calendar__number')) {
                setInfo(evt.target.nextElementSibling.textContent);
            }
        }
    }

    React.useEffect(() => {
        setIsSelected(false);
    }, [isClose]);

    return (
        <>
            <div ref={refrence} title={`${day.dayNumber}.${month + 1}`} className={`calendar__day ${day.events === '' ? 'calendar__day--empty' : ''} ${isSelected ? 'calendar__day--active ' : ''}`} onClick={createEvent}>
                {day.dayNumber && <div className="calendar__number">{day.dayNumber}</div>}
                <div className='calendar__day_event'>{day.events}</div>
            </div>
        </>
    );
}