import React from "react";
import findEpsgCodes from '../../images/find-epsg-codes.svg';
import xyz from '../../images/xyz.svg';
import markerIcon from '../../images/marker.svg';
import Pointer from '../../images/pointer.svg'
import ruler from '../../images/ruler.svg'; // eslint-disable-next-line


export default function ButtonBox(props) {  // eslint-disable-next-line
    const { isModi, isEpsgFormFilled, didCopy, didEPSG, isPointer, isRuler, togglePointer, toggleRuler, onRecenterMarker, onChooseEpsgLocation, copyLocationClickable, onRecenterMe } = props;

    const recenterOnMarker = (evt) => {
        evt.preventDefault();
        onRecenterMarker();
    };

    const epsgClicked = (evt) => {
        if (isEpsgFormFilled) {
            onChooseEpsgLocation(evt);
        }
    };

    return (
        <div className={`button-box${isModi ? '_modified' : ''}`}>
            <img className={`button-box__button${didEPSG ? '_clicked' : ''}${isEpsgFormFilled ? '' : '_disabled'}`} name='choose-location' title={isEpsgFormFilled ? 'Choose location with mouse, finds possible EPSG codes' : 'please fill EPSG form'} src={findEpsgCodes} onClick={epsgClicked} alt='Choose location with mousepad' />
            <img className={`button-box__button${didCopy ? '_clicked' : ''}`} name='copy-location' title="Copy coordinates to search bar" src={xyz} onClick={copyLocationClickable} alt='Copy location to search bar' />
            <img className='button-box__button' name='recenter-marker' title='Recenter on marker' src={markerIcon} onClick={recenterOnMarker} alt='Recenter on marker' />
            <img className={`button-box__button${isPointer ? '_clicked' : ''}`} name='toggle-pointer' title='Show/Hide pointer' src={Pointer} onClick={togglePointer} alt='Show/Hide pointer' />
            <img className={`button-box__button${isRuler ? '_clicked' : ''}`} name='toggle-pointer' title='Calculate distance' src={ruler} onClick={toggleRuler} alt='Calculate distance' />
        </div>
    );
}
