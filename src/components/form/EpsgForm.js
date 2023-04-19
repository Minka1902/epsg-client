import React from "react";

export default function LatLonForm(props) {
    const epsg = require('epsg');
    const { onSubmit, markersChange, getCoordinatesFromUrl } = props;
    const [longtitudeInput, setLongtitudeInput] = React.useState('');
    const [latitudeInput, setLatitudeInput] = React.useState('');
    const [epsgInput, setEpsgInput] = React.useState('');
    const [isLongtitudeInputCorrect, setisLongtitudeInputCorrect] = React.useState(true);
    const [isLatitudeInputCorrect, setisLatitudeInputCorrect] = React.useState(true);
    const [isEpsgInputCorrect, setisEpsgInputCorrect] = React.useState(true);
    const [isFormValid, setisFormValid] = React.useState(false);

    const onFormSubmit = (evt) => {
        evt.preventDefault();
        if (epsgInput === '' && longtitudeInput !== '' && latitudeInput !== '') {
            onSubmit({ isX: true, x: parseFloat(longtitudeInput), y: parseFloat(latitudeInput) });
        } else {
            if (epsgInput !== '' && longtitudeInput === '' && latitudeInput === '') {
                markersChange({ fromEpsg: epsgInput, evt: evt });
            } else {
                if (epsgInput === 'X' || epsgInput === 'x') {
                    onSubmit({ x: parseFloat(longtitudeInput), y: parseFloat(latitudeInput), isX: true });
                } else {
                    onSubmit({ fromEpsg: epsgInput, x: parseFloat(latitudeInput), y: parseFloat(longtitudeInput) });
                }
            }
        }
    };

    const checkCoordinate = (coordinate) => {
        const coordinateRegExp = /^(?:0|[1-9][0-9]*)\.[0-9]+$/;
        if (epsgInput === '4326') {
            if (coordinateRegExp.test(coordinate)) {
                if (coordinate.length !== 0) {
                    return true;
                }
            } return false;
        }
        return true
    };

    const checkEpsg = (fromEpsg) => {
        if (fromEpsg.length === 0) {
            return true;
        } else {
            if (fromEpsg === 'X' || fromEpsg === 'x') {
                return true;
            } else {
                if ((fromEpsg.length < 4) || (fromEpsg.length > 5)) {
                    return false;
                } else {
                    if (epsg[`EPSG:${fromEpsg}`]) {
                        return true;
                    }
                }
            }
        }
    }

    // ! Validating the form
    React.useEffect(() => {
        if (longtitudeInput.length !== 0) {
            setisLongtitudeInputCorrect(checkCoordinate(longtitudeInput));
        } else {
            setisLongtitudeInputCorrect(true);
        }

        if (latitudeInput.length !== 0) {
            setisLatitudeInputCorrect(checkCoordinate(latitudeInput));
        } else {
            setisLatitudeInputCorrect(true);
        }
        if (isLongtitudeInputCorrect || isLatitudeInputCorrect) {
            if (isLongtitudeInputCorrect && isLatitudeInputCorrect) {
                if (checkEpsg(epsgInput)) {
                    setisFormValid(true);
                }
            } else {
                setisFormValid(false);
            }
        } else {
            setisFormValid(false);
        }   // eslint-disable-next-line
    }, [longtitudeInput, latitudeInput]);

    React.useEffect(() => {
        if (checkEpsg(epsgInput)) {
            setisEpsgInputCorrect(true);
        } else {
            setisEpsgInputCorrect(false);
        }   // eslint-disable-next-line
    }, [epsgInput]);

    return (
        <form id="epsg-form" className="form">
            <h3 className='input-title'>EPSG: (Default X)</h3>
            <input
                className="form__input"
                placeholder="Enter EPSG."
                id="epsg-input"
                type="text"
                name="epsgInput"
                minLength="2"
                maxLength="6"
                value={epsgInput}
                onChange={(evt) => setEpsgInput(evt.currentTarget.value)}
            />
            <p className={`error-massage${isEpsgInputCorrect ? '' : '_visible'}`}>EPSG incorrect</p>

            <h3 className='input-title'>Y coordinate:</h3>
            <input
                className="form__input"
                placeholder="Enter Y coordinates"
                id="longtitude-input"
                type="text"
                name="longtitudeInput"
                minLength="2"
                maxLength="40"
                value={longtitudeInput}
                onChange={(evt) => setLongtitudeInput(evt.currentTarget.value)}
            />
            <p className={`error-massage${isLongtitudeInputCorrect ? '' : '_visible'}`}>{window.innerHeight <= 1200 ? 'Incorrect' : 'Longtitude incorrect'}</p>

            <h3 className='input-title'>X coordinate:</h3>
            <input
                className="form__input"
                placeholder="Enter X coordinates"
                id="latitude-input"
                type="text"
                name="latitudeInput"
                minLength="2"
                maxLength="40"
                value={latitudeInput}
                onChange={(evt) => setLatitudeInput(evt.currentTarget.value)}
            />
            <p className={`error-massage${isLatitudeInputCorrect ? '' : '_visible'}`}>{window.innerHeight <= 1200 ? 'Incorrect' : 'Latitude incorrect'}</p>
            <button onClick={onFormSubmit} type="submit" name="search-coord" className={`form__button${isFormValid ? '' : '_invalid'}`}>
                Find Coordinates
            </button>
        </form>
    );
}
