import React from "react";

export default function EpsgForm(props) {
    const { onSubmit } = props;
    const [fromEpsg, setFromEpsg] = React.useState('29191');
    const [toEpsg, setToEpsg] = React.useState('');
    const [isFromEpsgCorrect, setIsFromEpsgCorrect] = React.useState(true);
    const [isToEpsgCorrect, setIsToEpsgCorrect] = React.useState(true);
    const [isValid, setIsValid] = React.useState(false);

    const onFormSubmit = (evt) => {
        evt.preventDefault();
        let tempToEpsg = `${toEpsg}`;
        let tempFromEpsg = `${fromEpsg}`;
        if (fromEpsg === '') {
            tempFromEpsg = '4326';
        }
        if (toEpsg === '') {
            tempToEpsg = '4326';
        }
        onSubmit(tempFromEpsg, tempToEpsg);
    };

    // ! Validating the form
    React.useEffect(() => {
        if (fromEpsg.length !== 0) {
            if (fromEpsg === 'WGS84') {
                setIsFromEpsgCorrect(true);
            } else {
                setIsFromEpsgCorrect(true);
            }
        } else {
            setIsFromEpsgCorrect(true);
        }

        if (toEpsg.length !== 0) {
            setIsToEpsgCorrect(toEpsg.length >= 3);
        } else {
            setIsToEpsgCorrect(true);
        }

        if (isFromEpsgCorrect && isToEpsgCorrect) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }// eslint-disable-next-line
    }, [toEpsg, fromEpsg]);

    return (
        <form id="epsg-form" className="form" onSubmit={onFormSubmit}>
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

            <input
                className="form__input"
                placeholder="Enter EPSG code (default 4326)"
                id="epsg-input2"
                type="text"
                name="epsgInput2"
                minLength="2"
                maxLength="40"
                value={toEpsg}
                onChange={(evt) => setToEpsg(evt.currentTarget.value)}
            />
            <p className={`error-massage${isToEpsgCorrect ? '' : '_visible'}`}>EPSG incorrect</p>

            <button type="submit" className={`form__button${isValid ? '' : '_invalid'}`}>
                Submit
            </button>
        </form>
    );
}
