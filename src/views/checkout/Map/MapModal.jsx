// import React, { useState, useEffect, useRef } from 'react';
// import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
// import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
// import { GoogleMap } from '@react-google-maps/api';
// import MyLocationIcon from '@mui/icons-material/MyLocation';
// import InputAdornment from '@mui/material/InputAdornment';
// import SearchIcon from '@mui/icons-material/Search';


// const MapModal = ({ open, onClose, location, onConfirm }) => {
//   const [selectedLocation, setSelectedLocation] = useState(location);
//   const [address,selectedAddress] = useState(location.address);

//   const [autocompleteOptions, setAutocompleteOptions] = useState([]);
//   const mapRef = useRef(null);
//   const autoCompleteRef = useRef(null);
// console.log('Location in Mapmodal',location);
//   useEffect(() => {
//     const loadMap = async () => {
//       const { Map } = await window.google.maps.importLibrary('maps');
//       const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');
//       const center = {
//         lat: selectedLocation.lat,
//         lng: selectedLocation.lng
//       };
//        mapRef.current = new Map(document.getElementById('map'), {
//         center: center,
//         zoom: 17,
//         mapId: '4504f8b37365c3d0',
//       });

//       const draggableMarker = new AdvancedMarkerElement({
//         map: mapRef.current,
//         position: selectedLocation,
//         gmpDraggable: true,
//         title: 'This marker is draggable.',
//       });

//       draggableMarker.addListener('dragend', (event) => {
//         const position = draggableMarker.position;

//         setSelectedLocation({ lat: position.lat, lng: position.lng });
//       });

//       const input = document.getElementById('search-input');
//       autoCompleteRef.current = new window.google.maps.places.Autocomplete(input, {
//         fields: ['place_id', 'geometry', 'name', 'formatted_address'],
//         types: ['geocode'],
//       });

//       autoCompleteRef.current.bindTo('bounds', mapRef.current);

//       autoCompleteRef.current.addListener('place_changed', () => {
//         const place = autoCompleteRef.current.getPlace();

//         if (!place || !place.place_id) {
//           console.error('No place selected or invalid place.');
//           return;
//         }

//         mapRef.current.setZoom(11);
//         mapRef.current.panTo(place.geometry.location);

//         draggableMarker.setPosition(place.geometry.location);
//         draggableMarker.setVisible(true);

//         setSelectedLocation({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
//       });
//     };

//     if (window.google && window.google.maps) {
//       loadMap();
//     } else {
//       console.error('Google Maps API not loaded.');
//     }
//   }, [selectedLocation]);

//   const handleUseMyLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           console.log('Position',position);
//           console.log('User current location Latitude and Longitude',latitude, longitude);
//           setSelectedLocation({ lat: latitude, lng: longitude });
//         },
//         (error) => {
//           console.error('Error getting current location:', error);
//         },
//         // { enableHighAccuracy: true }
//       );
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };

//   const handleSearch = async () => {
//     try {
//       console.log('Searching for:', address);
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAS3sYiLZxlLVObHv7zP2Rrdcz3T2Sc6Vs`
//       );
//       const data = await response.json();
//       console.log('Geocoding response:', data);
//       if (data.results && data.results.length > 0) {
//         const { lat, lng } = data.results[0].geometry.location;
//         console.log('Found location:', { lat, lng });
//         setSelectedLocation({ lat, lng });
//       } else {
//         console.log('No results found');
//       }
//     } catch (error) {
//       console.error('Error searching for location:', error);
//     }
//   };
//   const handleConfirmLocation = () => {
//     onConfirm(selectedLocation);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Select Your Location</DialogTitle>
//       <DialogContent>
//         <Combobox onSelect={(value) => console.log(value)}>
//         <div className="relative mt-4 w-full  mx-auto">
//         <input
//           id="search-input"
//           value={address}
//           onChange={(e) => selectedAddress(e.target.value)}
//           placeholder="Search location..."
//           className="pr-10 pl-4 py-2 border border-gray-300 rounded-md w-full"
//         />
//         <SearchIcon onClick={handleSearch} className="absolute right-3 top-1/2 transform hover:cursor-pointer hover:text-gray-500 -translate-y-1/2 text-blue-500" fontSize="small" />
//       </div>
//           {autocompleteOptions.length > 0 && (
//             <ComboboxPopover>
//               <ComboboxList>
//                 {autocompleteOptions.map((option, index) => (
//                   <ComboboxOption key={index} value={option.description} />
//                 ))}
//               </ComboboxList>
//             </ComboboxPopover>
//           )}
//         </Combobox>
//         <div id="map" className='w-full h-[40vh] md:h-[60vh] mt-4'></div>

//         <div className="flex justify-between mt-4">
//           <Button variant="contained" startIcon={<MyLocationIcon />} onClick={handleUseMyLocation}>
//             Use My Location
//           </Button>
//           <Button variant="contained" onClick={handleConfirmLocation}>Confirm Location</Button>
//         </div>
//         <div className="mt-4">
//           <p className="text-gray-500 text-sm">Drag the marker to select a more accurate location.</p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default MapModal;



import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { toast } from 'react-toastify';

const MapModal = ({ open, onClose, location, onConfirm }) => {
  const [selectedLocation, setSelectedLocation] = useState(location);
  const [address, setAddress] = useState(location.address);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [show,setShow] = useState(false);
  const mapRef = useRef(null);
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      const { Map } = await window.google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');
      const center = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      };

      mapRef.current = new Map(document.getElementById('map'), {
        center: center,
        zoom: 17,
        mapId: '4504f8b37365c3d0',
      });

      const draggableMarker = new AdvancedMarkerElement({
        map: mapRef.current,
        position: selectedLocation,
        gmpDraggable: true,
        title: 'This marker is draggable.',
      });

      draggableMarker.addListener('dragend', async (event) => {
        const position = draggableMarker.position;
        const lat = position.lat;
        const lng = position.lng;
        
        // Update selectedLocation with new coordinates
        setSelectedLocation({ lat, lng });

        // Get formatted address from Geocoding API
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAS3sYiLZxlLVObHv7zP2Rrdcz3T2Sc6Vs`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const formattedAddress = data.results[0].formatted_address;
          setAddress(formattedAddress);
        } else {
          console.log('No address found');
        }
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
        setAddress(place.formatted_address);
      });
    };

    if (window.google && window.google.maps) {
      loadMap();
    } else {
      console.error('Google Maps API not loaded.');
    }
  }, [selectedLocation]);



  const handleUseMyLocation =async () => {
    if (navigator.geolocation) {
      if(!show){
      toast.info('الرجاء التاكد من ان خدمات الموقع  لوكيشين مفعلة لديك');
      setShow(true);
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });

          // Optionally get the formatted address for current location
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAS3sYiLZxlLVObHv7zP2Rrdcz3T2Sc6Vs`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                setAddress(data.results[0].formatted_address);
              } else {
                console.log('No address found');
              }
            })
            .catch(error => console.error('Error fetching address:', error));
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyAS3sYiLZxlLVObHv7zP2Rrdcz3T2Sc6Vs`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setSelectedLocation({ lat, lng });
        setAddress(data.results[0].formatted_address); // Update the address state
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
    }
  };

  const handleConfirmLocation = () => {
    onConfirm({ ...selectedLocation, address });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className='text-center'>Select Your Location</DialogTitle>
      <DialogContent>
        <Combobox onSelect={(value) => console.log(value)}>
          <div className="relative mt-4 w-full mx-auto">
            <ComboboxInput
              id="search-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Search location..."
              className="pr-10 pl-4 py-2 border border-gray-300 rounded-md w-full"
            />
            <SearchIcon
              onClick={handleSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 cursor-pointer hover:text-gray-500"
              fontSize="small"
            />
          </div>
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

        <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between mt-4">
          <Button variant="contained" startIcon={<MyLocationIcon />} onClick={handleUseMyLocation}>
          استخدم موقعي الحالي
          </Button>
          <Button variant="contained" onClick={handleConfirmLocation}>الموافقة على موقعي</Button>
        </div>
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Drag the marker to select a more accurate location.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
