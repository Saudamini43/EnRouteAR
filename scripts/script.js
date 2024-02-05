document.addEventListener('DOMContentLoaded', function () {
    // Get HTML elements
    const destinationSelectInput = document.getElementById('select-destination');
    const destinationSelectButton = document.getElementById('get-direction-button');
    const mapContainer = document.getElementById('map');
    let map;
    let compass;
    let currentLocationMarker; // To keep track of the marker at the current location
    let destinationMarker; // Define a global variable to keep track of the current destination marker
    // Function to initialize the map and get the user's current location
    const initMapAndLocation = async () => {
        try {
            // Initialize the map with Mapbox
            mapboxgl.accessToken = 'pk.eyJ1IjoicHJhbmtpdGEiLCJhIjoiY2xydnB6aXQzMHZqejJpdGV1NnByYW1kZyJ9.OedTGDqNQXNv-DJOV2HXuw';
            map = new mapboxgl.Map({
                container: mapContainer,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [0, 0], // Default center
                zoom: 15,
                bearing: 0, // Initial bearing
                pitch: 0, // Initial pitch
            });
            // Enable map controls (zoom, pan, rotate)
            map.addControl(new mapboxgl.NavigationControl());
            // Create a compass element
            compass = document.createElement('div');
            compass.className = 'compass';
            compass.innerHTML = '<img src="../models/compass.png" alt="Compass Icon">';
            // Add compass to the compass container
            const compassContainer = document.getElementById('compass-container');
            compassContainer.appendChild(compass);
            // Watch for changes in the device's orientation
            window.addEventListener('deviceorientation', handleOrientation);
            // Get and update the user's current location
            navigator.geolocation.watchPosition(
                (position) => {
                    const userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    updateMapCenter(userLocation.latitude, userLocation.longitude);
                    // If the current location marker exists, update its position; otherwise, create a new marker
                    if (currentLocationMarker) {
                        updateMarker(currentLocationMarker, userLocation.latitude, userLocation.longitude, 'You are here!');
                    } else {
                        currentLocationMarker = addMarker(userLocation.latitude, userLocation.longitude, 'You are here!');
                    }
                },
                (error) => {
                    console.error('Error in retrieving position', error);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 27000 }
            );
            // Watch for changes in the device's orientation
            window.addEventListener('deviceorientation', handleOrientation);
            // Disable map rotation with right-click or two-finger rotation gesture
            map.dragRotate.disable();
            map.touchZoomRotate.disableRotation(); // Disable rotation with two-finger touch
        } catch (error) {
            console.error('Error initializing map and getting initial location:', error);
        }
    };
    // Function to update the marker on the map
    const updateMarker = (marker, latitude, longitude, title) => {
        marker.setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML(title));
    };
    // Function to add a marker on the map
    const addMarker = (latitude, longitude, title) => {
        return new mapboxgl.Marker()
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML(title))
            .addTo(map);
    };

        // Function to handle changes in device orientation
        const handleOrientation = (event) => {
            const compassRotation = event.alpha; // Rotation in degrees
            const compassRotation = 360 - event.alpha; // Rotation in degrees
            compass.style.transform = `rotate(${360 - compassRotation}deg)`;

            // Set the bearing of the Mapbox map to achieve rotation
            map.setBearing(compassRotation);
        };
    // Function to get the user's current location
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }),
                error => {
                    console.error('Error in retrieving position', error);
                    reject(error);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 27000 }
            );
        });
    };