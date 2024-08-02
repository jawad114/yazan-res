import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import { GoogleMap } from '@react-google-maps/api';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const MapModal = ({ open, onClose, location, onConfirm }) => {
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const mapRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      const { Map } = await window.google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

      mapRef.current = new Map(document.getElementById('map'), {
        center: selectedLocation,
        zoom: 17,
        mapId: '4504f8b37365c3d0',
      });

      const draggableMarker = new AdvancedMarkerElement({
        map: mapRef.current,
        position: selectedLocation,
        gmpDraggable: true,
        title: 'This marker is draggable.',
      });

      draggableMarker.addListener('dragend', (event) => {
        const position = draggableMarker.position;

        setSelectedLocation({ lat: position.lat, lng: position.lng });
      });

      const input = document.getElementById('search-input');
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(input, {
        fields: ['place_id', 'geometry', 'name', 'formatted_address'],
        types: ['geocode'],
      });

      autoCompleteRef.current.bindTo('bounds', mapRef.current);

      autoCompleteRef.current.addListener('place_changed', () => {
        const place = autoCompleteRef.current.getPlace();

        if (!place || !place.place_id) {
          console.error('No place selected or invalid place.');
          return;
        }

        mapRef.current.setZoom(11);
        mapRef.current.panTo(place.geometry.location);

        draggableMarker.setPosition(place.geometry.location);
        draggableMarker.setVisible(true);

        setSelectedLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
      });
    };

    if (window.google && window.google.maps) {
      loadMap();
    } else {
      console.error('Google Maps API not loaded.');
    }
  }, [selectedLocation]);

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = async (searchValue) => {
    try {
      console.log('Searching for:', searchValue);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchValue)}&key=AIzaSyAS3sYiLZxlLVObHv7zP2Rrdcz3T2Sc6Vs`
      );
      const data = await response.json();
      console.log('Geocoding response:', data);
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log('Found location:', { lat, lng });
        setSelectedLocation({ lat, lng });
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };
  const handleConfirmLocation = () => {
    onConfirm(selectedLocation);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Select Your Location</DialogTitle>
      <DialogContent>
        <Combobox onSelect={(value) => console.log(value)}>
          <ComboboxInput
            id="search-input"
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search location..."
            className='min-w-screen mt-4'
          />
          {autocompleteOptions.length > 0 && (
            <ComboboxPopover>
              <ComboboxList>
                {autocompleteOptions.map((option, index) => (
                  <ComboboxOption key={index} value={option.description} />
                ))}
              </ComboboxList>
            </ComboboxPopover>
          )}
        </Combobox>
        <div id="map" className='w-full h-[40vh] md:h-[60vh] mt-4'></div>

        <div className="flex justify-between mt-4">
          <Button variant="contained" startIcon={<MyLocationIcon />} onClick={handleUseMyLocation}>
            Use My Location
          </Button>
          <Button variant="contained" onClick={handleConfirmLocation}>Confirm Location</Button>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Drag the marker to select a more accurate location.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
