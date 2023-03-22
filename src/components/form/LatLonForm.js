import React from "react";

export default function LatLonForm(props) {
    const { onCoordinatesSubmit, onEpsgSubmit } = props;
    const [longtitude, setLongtitude] = React.useState('');
    const [isLongtitudeCorrect, setIsLongtitudeCorrect] = React.useState(true);
    const [latitude, setLatitude] = React.useState('');
    const [isLatitudeCorrect, setIsLatitudeCorrect] = React.useState(true);
    const [isValid, setIsValid] = React.useState(false);
    const [fromEpsg, setFromEpsg] = React.useState('29191');
    const [isFromEpsgCorrect, setIsFromEpsgCorrect] = React.useState(true);

    const onFormSubmit = (evt) => {
        evt.preventDefault();
        if (evt.target.name === 'search-coord') {
            if (fromEpsg === '') {
                onCoordinatesSubmit('4326', parseFloat(longtitude), parseFloat(latitude));
            } else {
                onCoordinatesSubmit(fromEpsg, parseFloat(longtitude), parseFloat(latitude));
            }
        } else {
            onEpsgSubmit({ coords: { longtitude: parseFloat(longtitude), latitude: parseFloat(latitude) } });
        }
    };

    const checkCoordinate = (coordinate) => {
        const coordinateRegExp = /^(?:0|[1-9][0-9]*)\.[0-9]+$/;
        if (fromEpsg === '4326') {
            if (coordinateRegExp.test(coordinate)) {
                if (coordinate.length !== 0) {
                    return true;
                }
            } return false;
        }
        return true
    };

    const checkEpsg = (epsg) => {
        if (epsg.length === 0) {
            return true;
        } else {
            if ((epsg.length < 4) || (epsg.length > 5)) {
                return false;
            } else {
                return true;
            }
        }
    }

    // ! Validating the form
    React.useEffect(() => {
        if (longtitude.length !== 0) {
            setIsLongtitudeCorrect(checkCoordinate(longtitude));
        } else {
            setIsLongtitudeCorrect(true);
        }

        if (latitude.length !== 0) {
            setIsLatitudeCorrect(checkCoordinate(latitude));
        } else {
            setIsLatitudeCorrect(true);
        }
        if (isLongtitudeCorrect || isLatitudeCorrect) {
            if (isLongtitudeCorrect && isLatitudeCorrect) {
                if (checkEpsg(fromEpsg)) {
                    setIsValid(true);
                }
            } else {
                setIsValid(false);
            }
        } else {
            setIsValid(false);
        }
        // eslint-disable-next-line
    }, [longtitude, latitude]);

    React.useEffect(() => {
        if (checkEpsg(fromEpsg)) {
            setIsFromEpsgCorrect(true);
        } else {
            setIsFromEpsgCorrect(false);
        }
    }, [fromEpsg])

    return (
        <form id="lat-lon-form" className="form">
            <h3 className='input-title'>EPSG:</h3>
            <input
                className="form__input"
                placeholder="Enter EPSG code (default 4326)"
                id="epsg-input1"
                type="text"
                name="epsgInput1"
                minLength="2"
                maxLength="40"
                value={fromEpsg}
                onChange={(evt) => setFromEpsg(evt.currentTarget.value)}
            />
            <p className={`error-massage${isFromEpsgCorrect ? '' : '_visible'}`}>EPSG incorrect</p>

            <h3 className='input-title'>Longtitude/X coordinate</h3>
            <input
                className="form__input"
                placeholder="Enter longtitude"
                id="longtitude-input"
                type="text"
                name="longtitudeInput"
                required
                minLength="2"
                maxLength="40"
                value={longtitude}
                onChange={(evt) => setLongtitude(evt.currentTarget.value)}
            />
            <p className={`error-massage${isLongtitudeCorrect ? '' : '_visible'}`}>Longtitude incorrect</p>

            <h3 className='input-title'>Latitude/Y coordinate</h3>
            <input
                className="form__input"
                placeholder="Enter latitude"
                id="latitude-input"
                type="text"
                name="latitudeInput"
                required
                minLength="2"
                maxLength="40"
                value={latitude}
                onChange={(evt) => setLatitude(evt.currentTarget.value)}
            />
            <p className={`error-massage${isLatitudeCorrect ? '' : '_visible'}`}>Latitude incorrect</p>
            <div className="form__button-container">
                <button onClick={onFormSubmit} type="submit" name="search-coord" className={`form__button${isValid ? '' : '_invalid'}`}>
                    Find Coordinates
                </button>
                <button onClick={onFormSubmit} type="submit" name="search-epsg" className={`form__button${isValid ? '' : '_invalid'}`}>
                    Find Epsg Code
                </button>
            </div>
        </form>
    );
}
