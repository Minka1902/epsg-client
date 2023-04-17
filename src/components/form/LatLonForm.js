import React from "react";

export default function LatLonForm(props) {
    const { onSubmit } = props;
    const [longtitude, setLongtitude] = React.useState('');
    const [latitude, setLatitude] = React.useState('');
    const [isLongtitudeCorrect, setIsLongtitudeCorrect] = React.useState(true);
    const [isLatitudeCorrect, setIsLatitudeCorrect] = React.useState(true);
    const [isValid, setIsValid] = React.useState(false);

    const onFormSubmit = (evt) => {
        evt.preventDefault();
        onSubmit({ y: parseFloat(longtitude), x: parseFloat(latitude), is4326: true });
    };

    const checkCoordinate = (coordinate) => {
        const coordinateRegExp = /^-?\d+(\.\d+)?-?\d+(\.\d+)?$/;
        if (coordinate.length === 0) {
            return true;
        } else {
            if (coordinateRegExp.test(coordinate)) {
                return true;
            }
            return false;
        }
    };

    // ! Validating the form
    React.useEffect(() => {
        setIsLongtitudeCorrect(checkCoordinate(longtitude));
        setIsLatitudeCorrect(checkCoordinate(latitude));
        if (longtitude.length === 0 || latitude.length === 0) {
            setIsValid(false);
        } else {
            if (isLongtitudeCorrect || isLatitudeCorrect) {
                if (isLongtitudeCorrect && isLatitudeCorrect) {
                    setIsValid(true);
                } else {
                    setIsValid(false);
                }
            } else {
                setIsValid(false);
            }
        }
        // eslint-disable-next-line
    }, [longtitude, latitude]);

    return (
        <form id="lat-lon-form" className="form" onSubmit={onFormSubmit}>
            <h3 className='input-title'>Longtitude:</h3>
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
            <p className={`error-massage${isLongtitudeCorrect ? '' : '_visible'}`}>{window.innerHeight <= 599 ? 'Incorrect' : 'Longtitude incorrect'}</p>

            <h3 className='input-title'>Latitude:</h3>
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
            <p className={`error-massage${isLatitudeCorrect ? '' : '_visible'}`}>{window.innerHeight <= 599 ? 'Incorrect' : 'Latitude incorrect'}</p>
            <button type="submit" name="search-coord" className={`form__button${isValid ? '' : '_invalid'}`}>
                Find Coordinates
            </button>
        </form>
    );
}
