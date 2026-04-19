let googleMap;
let zonePolygons = {};

// We center around Madison Square Garden to demonstrate spatial intelligence
const centerPoint = { lat: 40.7505, lng: -73.9934 };

const zoneCoords = {
    "North Gate": [
        { lat: 40.7511, lng: -73.9942 },
        { lat: 40.7511, lng: -73.9926 },
        { lat: 40.7506, lng: -73.9926 },
        { lat: 40.7506, lng: -73.9942 }
    ],
    "South Gate": [
        { lat: 40.7504, lng: -73.9942 },
        { lat: 40.7504, lng: -73.9926 },
        { lat: 40.7499, lng: -73.9926 },
        { lat: 40.7499, lng: -73.9942 }
    ],
    "East Concourse": [
        { lat: 40.7509, lng: -73.9924 },
        { lat: 40.7509, lng: -73.9918 },
        { lat: 40.7501, lng: -73.9918 },
        { lat: 40.7501, lng: -73.9924 }
    ],
    "West Concourse": [
        { lat: 40.7509, lng: -73.9950 },
        { lat: 40.7509, lng: -73.9944 },
        { lat: 40.7501, lng: -73.9944 },
        { lat: 40.7501, lng: -73.9950 }
    ],
    "VIP Lounge": [
        { lat: 40.7506, lng: -73.9936 },
        { lat: 40.7506, lng: -73.9932 },
        { lat: 40.7504, lng: -73.9932 },
        { lat: 40.7504, lng: -73.9936 }
    ]
};

window.initRealMap = function() {
    // Clear out the pseudo-map fallback if it's there
    const mapDiv = document.getElementById("google-map");
    mapDiv.innerHTML = '';
    
    // Create the actual Google Map instance
    googleMap = new google.maps.Map(mapDiv, {
        zoom: 18,
        center: centerPoint,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }
        ]
    });

    // Draw Google Maps Polygons for each structural zone
    Object.keys(zones).forEach(zoneId => {
        let name = zones[zoneId].name;
        if (zoneCoords[name]) {
            let poly = new google.maps.Polygon({
                paths: zoneCoords[name],
                strokeColor: "#10b981",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#10b981",
                fillOpacity: 0.35,
                map: googleMap
            });
            zonePolygons[zoneId] = poly;
        }
    });
};

function updateMapPolygons() {
    if (!googleMap) return;
    
    Object.keys(zones).forEach(zoneId => {
        let poly = zonePolygons[zoneId];
        if (poly) {
            let density = zones[zoneId].density;
            let color = "#10b981"; // Green
            
            if (density > 75) {
                color = "#ef4444"; // Red
            } else if (density > 50) {
                color = "#f59e0b"; // Yellow
            }
            
            // Dynamically update the polygon shading based on real-time physics data
            poly.setOptions({
                fillColor: color,
                strokeColor: color
            });
        }
    });
}
