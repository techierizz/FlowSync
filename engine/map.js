let googleMap;
let zonePolygons = {};

const centerPoint = { lat: 51.556021, lng: -0.279519 };

function getStadiumSlice(center, innerRadius, outerRadius, startAngle, endAngle) {

    const latMeters = 0.00000898;
    const lngMeters = 0.00001445;
    let paths = [];

    for (let a = startAngle; a <= endAngle; a += 5) {
        let rad = a * Math.PI / 180;
        paths.push({
            lat: center.lat + (outerRadius * Math.sin(rad) * latMeters),
            lng: center.lng + (outerRadius * Math.cos(rad) * lngMeters)
        });
    }

    for (let a = endAngle; a >= startAngle; a -= 5) {
        let rad = a * Math.PI / 180;
        paths.push({
            lat: center.lat + (innerRadius * Math.sin(rad) * latMeters),
            lng: center.lng + (innerRadius * Math.cos(rad) * lngMeters)
        });
    }

    let midRadius = (innerRadius + outerRadius) / 2;
    let midAngleRad = ((startAngle + endAngle) / 2) * Math.PI / 180;
    let labelPos = {
        lat: center.lat + (midRadius * Math.sin(midAngleRad) * latMeters),
        lng: center.lng + (midRadius * Math.cos(midAngleRad) * lngMeters)
    };

    return { paths: paths, labelPos: labelPos };
}

const zoneCoords = {
    "North Gate A": getStadiumSlice(centerPoint, 60, 140, 45, 135),
    "South Gate B": getStadiumSlice(centerPoint, 60, 140, 225, 315),
    "Main Concourse": getStadiumSlice(centerPoint, 85, 140, 135, 225),
    "Restrooms East": getStadiumSlice(centerPoint, 60, 140, -45, 45),
    "VIP Lounge": getStadiumSlice(centerPoint, 60, 85, 150, 210),
    "Fan Store": getStadiumSlice(centerPoint, 150, 190, 290, 320)
};

zoneCoords["Main Concourse"].labelPos.lat += 0.00035;
zoneCoords["VIP Lounge"].labelPos.lat -= 0.00035;

window.initRealMap = async function () {
    const mapDiv = document.getElementById("google-map");
    mapDiv.textContent = '';

    googleMap = new google.maps.Map(mapDiv, {
        zoom: 17,
        center: centerPoint,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        tilt: 0,
        mapId: 'DEMO_MAP_ID',
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }
        ]
    });

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    Object.keys(zones).forEach(zoneId => {
        let name = zones[zoneId].name;
        if (zoneCoords[name]) {
            let poly = new google.maps.Polygon({
                paths: zoneCoords[name].paths,
                strokeColor: "#10b981",
                strokeOpacity: 0.9,
                strokeWeight: 3,
                fillColor: "#10b981",
                fillOpacity: 0.45,
                map: googleMap
            });

            const labelDiv = document.createElement('div');
            labelDiv.className = 'map-zone-label';
            labelDiv.style.color = "#ffffff";
            labelDiv.style.fontSize = "13px";
            labelDiv.style.fontWeight = "800";
            labelDiv.textContent = name;

            let marker = new AdvancedMarkerElement({
                position: zoneCoords[name].labelPos,
                map: googleMap,
                content: labelDiv,
                title: name
            });

            zonePolygons[zoneId] = { polygon: poly, marker: marker };
        }
    });
};

function updateMapPolygons() {
    if (!googleMap) return;

    Object.keys(zones).forEach(zoneId => {
        let polyData = zonePolygons[zoneId];
        if (polyData) {
            let density = zones[zoneId].density;
            let color = "#10b981";

            if (density > 75) {
                color = "#ef4444";
            } else if (density > 45) {
                color = "#f59e0b";
            }

            polyData.polygon.setOptions({
                fillColor: color,
                strokeColor: color
            });
        }
    });
}


const mapScript = document.createElement('script');
mapScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCdP7vyEZ7OVapMwHUebJgoAgAAK8KxrpA&callback=initRealMap&loading=async&v=weekly";
mapScript.async = true;
mapScript.defer = true;
document.head.appendChild(mapScript);