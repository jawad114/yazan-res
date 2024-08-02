import React, { useEffect, useState } from 'react';

interface UserLocation {
    lat: number;
    lng: number;
}

// Extend the Window interface to include the google property
interface CustomWindow extends Window {
    google: {
        maps: {
            Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
            Marker: new (options: google.maps.MarkerOptions) => google.maps.Marker;
        };
    };
}

const LocateMe: React.FC = () => {
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    useEffect(() => {
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
            initMap();
        }
    }, [userLocation]);

    const initMap = () => {
        const mapElement = document.getElementById('map');

        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        const map = new window.google.maps.Map(mapElement, {
            center: {
                lat: userLocation!.lat,
                lng: userLocation!.lng,
            },
            zoom: 15,
        });

        new window.google.maps.Marker({
            position: userLocation!,
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
