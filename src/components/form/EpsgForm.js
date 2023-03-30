import React from "react";

export default function LatLonForm(props) {
    const { onCoordinatesSubmit } = props;
    const [longtitude, setLongtitude] = React.useState('');
    const [latitude, setLatitude] = React.useState('');
    const [fromEpsg, setFromEpsg] = React.useState('');
    const [isLongtitudeCorrect, setIsLongtitudeCorrect] = React.useState(true);
    const [isLatitudeCorrect, setIsLatitudeCorrect] = React.useState(true);
    const [isFromEpsgCorrect, setIsFromEpsgCorrect] = React.useState(true);
    const [isValid, setIsValid] = React.useState(false);

    const onFormSubmit = (evt) => {
        evt.preventDefault();
        if (fromEpsg === '') {
            onCoordinatesSubmit({ fromEpsg: '4326', x: parseFloat(longtitude), y: parseFloat(latitude) });
        } else {
            if (fromEpsg === 'X' || fromEpsg === 'x') {
                onCoordinatesSubmit({ x: parseFloat(longtitude), y: parseFloat(latitude), isX: true });
            } else {
                onCoordinatesSubmit({ fromEpsg: fromEpsg, x: parseFloat(longtitude), y: parseFloat(latitude) });
            }
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
            if (epsg === 'X' || epsg === 'x') {
                return true;
            } else {
                if ((epsg.length < 4) || (epsg.length > 5)) {
                    return false;
                } else {
                    return true;
                }
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
        }   // eslint-disable-next-line
    }, [longtitude, latitude]);

    React.useEffect(() => {
        if (checkEpsg(fromEpsg)) {
            setIsFromEpsgCorrect(true);
        } else {
            setIsFromEpsgCorrect(false);
        }   // eslint-disable-next-line
    }, [fromEpsg])

    return (
        <form id="lat-lon-form" className="form">
            <h3 className='input-title'>EPSG: (Default 4326)</h3>
            <input
                className="form__input"
                placeholder="Enter EPSG code. if you don't know it enter X"
                id="epsg-input1"
                type="text"
                name="epsgInput1"
                minLength="2"
                maxLength="40"
                value={fromEpsg}
                onChange={(evt) => setFromEpsg(evt.currentTarget.value)}
            />
            <p className={`error-massage${isFromEpsgCorrect ? '' : '_visible'}`}>EPSG incorrect</p>

            <h3 className='input-title'>Y coordinate:</h3>
            <input
                className="form__input"
                placeholder="Enter Y coordinate"
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

            <h3 className='input-title'>X coordinate:</h3>
            <input
                className="form__input"
                placeholder="Enter X coordinate"
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
            <button onClick={onFormSubmit} type="submit" name="search-coord" className={`form__button${isValid ? '' : '_invalid'}`}>
                Find Coordinates
            </button>
        </form>
    );
}
