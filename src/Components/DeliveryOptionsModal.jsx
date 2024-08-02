import React, { useState } from 'react';
import LocateMe from './LocateMe';

const DeliveryOptionsModal = ({ onClose, onSelectOption }) => {
    const [showLocation, setShowLocation] = useState(false);
    const [customerLocation, setCustomerLocation] = useState(null);

    const handleLocationAccepted = (location) => {
        setCustomerLocation(location);
        setShowLocation(true);
    };

    const handleOptionSelection = (option) => {
        onSelectOption(option);
        setShowLocation(false); // Hide the location display when selecting an option
    };

    return (
        <div className="modal">
            <h2>Select Delivery Option</h2>
            <label>
                <input type="radio" value="selfPickup" onChange={() => handleOptionSelection('selfPickup')} />
                Self Pickup
            </label>
            <label>
                <input
                    type="radio"
                    value="customerLocation"
                    onChange={() => handleOptionSelection('customerLocation')}
                />
                Delivery to Customer Location
            </label>

            {/* Display the user's location when accepted */}
            {showLocation && (
                <div className="location-display">
                    <p>Your location is: {customerLocation.lat}, {customerLocation.lng}</p>
                </div>
            )}

            {/* Display the picked location */}
            {showLocation && customerLocation && (
                <div className="location-display">
                    <p>Your location is: {customerLocation.lat}, {customerLocation.lng}</p>
                </div>
            )}

            {/* Display the LocateMe component for accepting the location */}
            {!showLocation && (
                <LocateMe onLocationAccepted={handleLocationAccepted} />
            )}

            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default DeliveryOptionsModal;
