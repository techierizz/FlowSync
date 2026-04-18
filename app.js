function renderZones() {
    let container = document.getElementById("zones");
    container.innerHTML = "";

    for (let key in zones) {
        let z = zones[key];

        let level = "low";
        if (z.density > 60) level = "high";
        else if (z.density > 30) level = "medium";

        let div = document.createElement("div");
        div.className = `zone ${level}`;
        div.innerText = `${z.name} - Density: ${Math.round(z.density)}`;

        container.appendChild(div);
    }
}

function renderMap() {
    let map = document.getElementById("map");
    map.innerHTML = "";

    for (let key in zones) {
        let z = zones[key];

        let div = document.createElement("div");
        div.className = "box";
        div.innerText = `${z.name}\n${Math.round(z.density)}%`;

        map.appendChild(div);
    }
}

function renderDecisions() {
    let div = document.getElementById("decisions");
    div.innerHTML = "";

    let best = getBestZone();
    let actions = getActions();

    let msg = document.createElement("p");
    msg.innerText = `Best Zone: ${best.name}`;
    div.appendChild(msg);

    actions.forEach(a => {
        let p = document.createElement("p");
        p.innerText = a;
        div.appendChild(p);
    });
}

function loop() {
    updateZones();
    renderZones();
    renderMap();
    renderDecisions();
}

setInterval(loop, 3000);

function simulateStart() {
    zones.gateA.density += 40;
}

function simulateHalftime() {
    zones.food.density += 40;
    zones.washroom.density += 30;
}

function simulateEnd() {
    zones.gateA.density += 50;
}