import React, { useState, useEffect } from 'react';
import './Locationbar.css'; // Import your CSS file

const LocationComponent: React.FC = () => {
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getLocation = async () => {
            try {
                const position = await getCurrentPosition();
                setLocation(position.coords);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred.');
                }
            }
        };

        getLocation();
    }, []);

    const getCurrentPosition = (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    return (
        <div className="LocationComponent">
            <h2>Your Current Location</h2>
            {error && <p className="Error">Error: {error}</p>}
            {location && (
                <div className="LocationInfo">
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                </div>
            )}
        </div>
    );
};

export default LocationComponent;
