// Handle form submission
document.getElementById('emergencyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const phoneNumber = document.getElementById('phoneNumber').value;
    const hospital = document.getElementById('hospitalSelect').value;
    if (hospital) {
        window.location.href = `tel:${phoneNumber}`;
    } else {
        alert("Please select a hospital.");
    }
});

// List of hospitals with their locations
const hospitals = [
    { name: "Sum Ultimate", address: "123 Main St", lat: 40.7128, lon: -74.0060 },
    { name: "Sum Hospital", address: "456 Oak Rd", lat: 40.7306, lon: -73.9352 },
    { name: "AIIMS", address: "789 Pine Ave", lat: 40.7488, lon: -73.9857 },
    { name: "IKCG Multipeciality", address: "101 North Dr", lat: 40.7291, lon: -73.9965 }
];

// Get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Show user's location and update hospital options
function showPosition(position) {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    const nearbyHospitals = hospitals.map(hospital => {
        const distance = getDistance(userLat, userLon, hospital.lat, hospital.lon);
        return { ...hospital, distance };
    }).sort((a, b) => a.distance - b.distance);

    const select = document.getElementById('hospitalSelect');
    const hospitalList = document.getElementById('hospitalList');

    select.innerHTML = nearbyHospitals.map(hospital => 
        `<option value="${hospital.name}">${hospital.name} - ${hospital.distance.toFixed(2)} km away</option>`
    ).join('');

    hospitalList.innerHTML = nearbyHospitals.map(hospital => 
        `<div class="hospitalItem">
            <h4>${hospital.name}</h4>
            <p>${hospital.address}</p>
            <p>Distance: ${hospital.distance.toFixed(2)} km</p>
        </div>`
    ).join('');

    if (nearbyHospitals.length > 0) {
        select.value = nearbyHospitals[0].name;
        // Update map location
        updateMap(userLat, userLon);
    }
}

// Calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Convert degrees to radians
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Handle geolocation errors
function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Update static map URL to center around user's location
function updateMap(lat, lon) {
    const mapImage = document.getElementById('map');
    const zoom = 14; // Adjust zoom level as needed
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&amp;layer=mapnik&zoom=${zoom}`;
    mapImage.src = url;
}
