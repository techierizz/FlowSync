let googleMap;
let zonePolygons = {};

// Center on Wembley Stadium for a massive open-air visualization
const centerPoint = { lat: 51.556021, lng: -0.279519 };

// Helper function to draw mathematically precise curved stadium seating sections
function getStadiumSlice(center, innerRadius, outerRadius, startAngle, endAngle) {
    // Conversion factors for meters to degrees at London's latitude
    const latMeters = 0.00000898;
    const lngMeters = 0.00001445;
    let paths = [];
    
    // Outer arc
    for (let a = startAngle; a <= endAngle; a += 5) {
        let rad = a * Math.PI / 180;
        paths.push({
            lat: center.lat + (outerRadius * Math.sin(rad) * latMeters),
            lng: center.lng + (outerRadius * Math.cos(rad) * lngMeters)
        });
    }
    // Inner arc (reverse)
    for (let a = endAngle; a >= startAngle; a -= 5) {
        let rad = a * Math.PI / 180;
        paths.push({
            lat: center.lat + (innerRadius * Math.sin(rad) * latMeters),
            lng: center.lng + (innerRadius * Math.cos(rad) * lngMeters)
        });
    }
    return paths;
}

// Generate the geographic zones based on the stadium's physical blueprint
const zoneCoords = {
    "North Gate A": getStadiumSlice(centerPoint, 60, 140, 45, 135),
    "South Gate B": getStadiumSlice(centerPoint, 60, 140, 225, 315),
    "Main Concourse": getStadiumSlice(centerPoint, 85, 140, 135, 225),  // West Upper
    "Restrooms East": getStadiumSlice(centerPoint, 60, 140, -45, 45),   // East Stand
    "VIP Lounge": getStadiumSlice(centerPoint, 60, 85, 150, 210),       // West Lower VIP
    "Fan Store": getStadiumSlice(centerPoint, 150, 190, 290, 320)       // External Plaza South-East
};

window.initRealMap = function () {
    const mapDiv = document.getElementById("google-map");
    mapDiv.innerHTML = '';

    googleMap = new google.maps.Map(mapDiv, {
        zoom: 17, // Zoomed in just enough to see the whole stadium
        center: centerPoint,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        tilt: 0, // Force top-down view for accurate geometry
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }
        ]
    });

    Object.keys(zones).forEach(zoneId => {
        let name = zones[zoneId].name;
        if (zoneCoords[name]) {
            let poly = new google.maps.Polygon({
                paths: zoneCoords[name],
                strokeColor: "#10b981",
                strokeOpacity: 0.9,
                strokeWeight: 3,
                fillColor: "#10b981",
                fillOpacity: 0.45,
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

// Dynamically inject the Google Maps API only AFTER this file has fully parsed
// This guarantees initRealMap is defined before the API calls it.
const mapScript = document.createElement('script');
mapScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCdP7vyEZ7OVapMwHUebJgoAgAAK8KxrpA&callback=initRealMap&loading=async";
mapScript.async = true;
mapScript.defer = true;
document.head.appendChild(mapScript);