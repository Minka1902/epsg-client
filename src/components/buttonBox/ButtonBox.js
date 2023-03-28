import React from "react";
import findEpsgCodes from '../../images/find-epsg-codes.svg';
import xyz from '../../images/xyz.svg';
import markerIcon from '../../images/marker.svg';
import Pointer from '../../images/pointer.svg'
import LocationMe from "../../images/location-me.svg";


export default function ButtonBox(props) {
    const { isModi, didCopy, didEPSG, isPointer, togglePointer, onRecenterMe, onRecenterMarker, onChooseEpsgLocation, copyLocationClickable } = props;


    const recenterOnMarker = (evt) => {
        evt.preventDefault();
        onRecenterMarker();
    }

    return (
        <div className={`button-box${isModi ? '_modified' : ''}`}>
            <img className={`button-box__button${didEPSG ? '_clicked' : ''}`} name='choose-location' title='Choose location with mouse, finds possible EPSG codes' src={findEpsgCodes} onClick={onChooseEpsgLocation} alt='Choose location with mousepad' />
            <img className={`button-box__button${didCopy ? '_clicked' : ''}`} name='copy-location' title="Copy coordinates to search bar" src={xyz} onClick={copyLocationClickable} alt='Copy location to search bar' />
            <img className='button-box__button' name='recenter-marker' title='Recenter on marker' src={markerIcon} onClick={recenterOnMarker} alt='Recenter on marker' />
            <img className={`button-box__button${isPointer ? '_clicked' : ''}`} name='toggle-pointer' title='Show/Hide pointer' src={Pointer} onClick={togglePointer} alt='Show/Hide pointer' />
            {/* <img className='button-box__button' name='recenter-me' title="Recenter on me" src={LocationMe} onClick={onRecenterMe} alt='Recenter on me' /> */}
        </div>
    );
}
