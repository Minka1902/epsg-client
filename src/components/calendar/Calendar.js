import React from 'react';
import './calendar.css';
import Day from './Day';

export default function Calendar() {
    const [date, setDate] = React.useState(new Date());
    const [isOpen, setIsOpen] = React.useState(false);
    const [close, setClose] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const [info, setInfo] = React.useState('');

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const toggleIsOpen = () => setIsOpen(!isOpen);

    const getDaysInMonth = () => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return daysInMonth;
    }

    const getFirstDayOfMonth = () => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        return firstDay === 0 ? 7 : firstDay;
    }

    const setCloseTrue = (evt) => {
        setClose(!close);
    }

    const prevMonth = () => {
        const year = date.getFullYear();
        const month = date.getMonth() - 1;
        setDate(new Date(year, month, 1));
    }

    const nextMonth = () => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        setDate(new Date(year, month, 1));
    }

    const setInfoForDay = (info) => {
        setInfo(info);
    }

    const getRow = (day, firstDayOfMonth) => {
        const offset = (firstDayOfMonth + 6) % 7;

        // Calculate the index of the day within the week (0-6)
        const dayIndex = (day + offset) % 7 + 1;

        // Calculate the row (0-based index)
        const row = Math.floor((day + offset - 1) / 7);

        return row + 1;
    }

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth();
        const firstDayOfMonth = getFirstDayOfMonth();
        const daysArray = [];

        for (let i = 1; i <= daysInMonth; i++) {
            daysArray.push({ dayNumber: i, events: '' });
        }

        while (daysArray.length < firstDayOfMonth + daysInMonth - 1) {
            daysArray.unshift('');
        }

        return (
            <div className="calendar__days">
                {days.map(day => <div key={day} className="calendar__day">{day}</div>)}
                {daysArray.map((day, index) => (
                    <Day day={day} month={date.getMonth()} row={getRow(day.dayNumber, firstDayOfMonth)} key={index} refrence={dropdownRef} toggleOpen={toggleIsOpen} setInfo={setInfoForDay} isClose={close} closeAll={setCloseTrue} />
                ))}
            </div>
        );
    }

    return (
        <div className="calendar">
            <div className="calendar__header">
                <div className="calendar__arrow calendar__arrow_left" onClick={prevMonth}></div>
                <div className="calendar__month">{months[date.getMonth()]}</div>
                <div className="calendar__arrow calendar__arrow_right" onClick={nextMonth}></div>
            </div>
            {renderCalendar()}
            {isOpen ? <div className='calendar__day_info'>{info}</div> : <></>}
        </div>
    );
};
