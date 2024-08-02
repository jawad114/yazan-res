// In your React component or JavaScript file
import React, { useEffect, useState } from 'react';

const LocateMe = () => {
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // Check if the Geolocation API is available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error getting user location:', error.message);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    useEffect(() => {
        if (userLocation) {
            // Initialize the map when the userLocation state is updated
            initMap();
        }
    }, [userLocation]);

    const initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
            center: userLocation,
            zoom: 15,
        });

        new window.google.maps.Marker({
            position: userLocation,
            map: map,
            title: 'Your Location',
        });
    };

    return (
        <div>
            {userLocation && (
                <div id="map" style={{ height: '400px', width: '100%' }}></div>
            )}
        </div>
    );
};

export default LocateMe;
