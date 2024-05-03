import React, { useRef, useEffect } from 'react';
import "../styles/computation/ComputationPopup.css";

const ComputationPopup = ({ isVisible, signMessage, hidePopup }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        hidePopup();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible]);

  const popupClassName = isVisible ? 'computation-popup-div' : 'computation-popup-div';
  const popupBg = isVisible ? 'popup-background' : '';

  return (
    <div className={popupClassName} ref={popupRef}>
      <div>
        <div className="d-flex justify-content-between">
          <div className="">Sign the message below to authorize.</div>
          <div className="" onClick={hidePopup} style={{ cursor: 'pointer' }}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        <hr />
        <button className="popup-btn" onClick={signMessage}>
        Click here to sign in.
        </button>
      </div>
    </div>
  );
};

export default ComputationPopup;