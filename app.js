const firebaseConfig = {
    apiKey: "AIzaSyA5qqN7uL1ErcMLCfofidWgnD64szsv584",
    authDomain: "flowsync-97ce0.firebaseapp.com",
    projectId: "flowsync-97ce0",
    storageBucket: "flowsync-97ce0.firebasestorage.app",
    messagingSenderId: "885697555847",
    appId: "1:885697555847:web:c0e9d9496ec84b28ef3722",
    databaseURL: "https://flowsync-97ce0-default-rtdb.asia-southeast1.firebasedatabase.app"
};

let database;
try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    console.log("Firebase successfully connected to Google Cloud.");
} catch (e) {
    console.error("Firebase initialization failed:", e);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    if (typeof initTelemetry !== 'undefined') initTelemetry();

    let personaSelector = document.getElementById('persona-selector');
    if (personaSelector) {
        personaSelector.addEventListener('change', renderDecisions);
    }

    loop();
    setInterval(loop, 2500);
});

function initTheme() {
    const btn = document.getElementById('theme-toggle');
    btn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        let isLight = document.body.classList.contains('light-theme');
        
        btn.textContent = '';
        let icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = isLight ? 'dark_mode' : 'light_mode';
        btn.appendChild(icon);
    });
}


function renderHeatmap() {
    const pseudoMap = document.getElementById('pseudo-map');
    if (!pseudoMap) return;
    pseudoMap.innerHTML = '';

    for (let key in zones) {
        let z = zones[key];

        let container = document.createElement('div');
        container.className = 'heat-node-container';
        container.style.position = 'absolute';
        container.style.left = z.x + '%';
        container.style.top = z.y + '%';
        container.style.transform = 'translate(-50%, -50%)';

        let node = document.createElement('div');
        node.className = 'heat-node';

        let r = Math.min(255, (z.density / 100) * 255 * 2);
        let g = Math.min(255, ((100 - z.density) / 100) * 255 * 2);
        node.style.background = `rgba(${r}, ${g}, 0, 0.65)`;
        node.style.transform = `scale(${1 + (z.density / 100) * 1.5})`;
        node.style.boxShadow = `0 0 ${z.density}px rgba(${r}, ${g}, 0, 0.8)`;

        let label = document.createElement('span');
        label.className = 'heat-label';
        label.innerText = z.name;

        container.appendChild(node);
        container.appendChild(label);
        pseudoMap.appendChild(container);
    }
}

let lastGlobalDensity = 0;
let isRecovering = false;

function renderZones() {
    let container = document.getElementById("zones");
    container.textContent = "";

    let totalDensity = 0;

    for (let key in zones) {
        let z = zones[key];
        totalDensity += z.density;

        let level = "low";
        if (z.density > 75) level = "high";
        else if (z.density > 45) level = "medium";

        let div = document.createElement("div");
        div.className = `zone-item ${level}`;
        div.setAttribute('role', 'region');
        div.setAttribute('aria-label', `${z.name} status`);

        let infoDiv = document.createElement("div");
        infoDiv.className = "zone-info";
        let nameSpan = document.createElement("span");
        nameSpan.className = "zone-name";
        nameSpan.textContent = z.name;
        let statsSpan = document.createElement("span");
        statsSpan.className = "zone-stats";
        statsSpan.textContent = `Queue: ${z.queue} | Flow: ${z.inflow.toFixed(1)}/min`;
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(statsSpan);

        let densityDiv = document.createElement("div");
        densityDiv.className = "zone-density";
        densityDiv.style.fontFamily = "var(--font-mono)";
        densityDiv.textContent = `${Math.round(z.density)}%`;

        div.appendChild(infoDiv);
        div.appendChild(densityDiv);

        container.appendChild(div);
    }

    let globalAvg = totalDensity / Object.keys(zones).length;
    let globalDensityEl = document.getElementById('global-density');

    let trend = " ~";
    if (lastGlobalDensity > 0) {
        if (globalAvg < lastGlobalDensity - 0.5) trend = " ▼";
        else if (globalAvg > lastGlobalDensity + 0.5) trend = " ▲";
    }

    globalDensityEl.textContent = Math.round(globalAvg) + '%' + trend;
    globalDensityEl.style.color = globalAvg > 75 ? 'var(--alert)' : (globalAvg > 45 ? '#f59e0b' : 'var(--secondary)');

    if (globalAvg > 70) {
        isRecovering = true;
    } else if (globalAvg < 50) {
        isRecovering = false;
    }

    let statusText = document.getElementById('system-status');
    let statusDot = document.querySelector('.status-indicator .dot');

    if (statusText && statusDot) {
        if (isRecovering) {
            statusText.textContent = "ACTIVE MITIGATION";
            statusText.style.fontWeight = "bold";
            statusText.style.color = "var(--alert)";
            statusDot.style.background = "var(--alert)";
            statusDot.style.boxShadow = "0 0 10px var(--alert)";
        } else {
            statusText.innerText = "SYSTEM OPTIMAL";
            statusText.style.color = "var(--text-muted)";
            statusDot.style.background = "var(--secondary)";
            statusDot.style.boxShadow = "0 0 10px var(--secondary)";
        }
    }

    lastGlobalDensity = globalAvg;
}

function renderDecisions(actions) {
    let div = document.getElementById("decisions");

    let personaSelector = document.getElementById('persona-selector');
    let currentPersona = personaSelector ? personaSelector.value : 'speed';

    let desc = document.getElementById('persona-description');
    if (desc) {
        if (currentPersona === 'speed') desc.innerText = "Prioritizing minimum wait time.";
        else if (currentPersona === 'comfort') desc.innerText = "Prioritizing less crowded areas.";
        else if (currentPersona === 'accessibility') desc.innerText = "Prioritizing accessible zones.";
    }

    let best = getBestZone(currentPersona);
    document.getElementById('best-zone').innerText = best.name;

    if (!actions || !Array.isArray(actions)) {
        actions = getActions();
    }


    let newHash = actions.map(a => a.msg).join('');
    if (div.dataset.hash === newHash) return;
    div.dataset.hash = newHash;

    div.textContent = "";
    actions.forEach(a => {
        let p = document.createElement("div");
        p.className = `decision-item ${a.type.toLowerCase()}`;

        let iconStr = 'info';
        if (a.type === 'CRITICAL') iconStr = 'warning';
        if (a.type === 'ALERT') iconStr = 'error';
        if (a.type === 'WARN') iconStr = 'assignment_late';
        if (a.type === 'INFO') iconStr = 'check_circle';

        let iconEl = document.createElement("span");
        iconEl.className = "material-symbols-outlined";
        iconEl.setAttribute("aria-hidden", "true");
        iconEl.textContent = iconStr;

        let msgSpan = document.createElement("span");
        msgSpan.textContent = a.msg;

        p.appendChild(iconEl);
        p.appendChild(msgSpan);
        div.appendChild(p);
    });
}

function syncToFirebase() {
    if (database) {
        database.ref('venue/zones').set(zones).catch(e => console.warn("Firebase push failed:", e));

        let globalAvg = Object.values(zones).reduce((acc, z) => acc + z.density, 0) / Object.keys(zones).length;
        database.ref('venue/status').set({
            globalDensity: Math.round(globalAvg),
            isRecovering: typeof isRecovering !== 'undefined' ? isRecovering : false,
            lastUpdate: firebase.database.ServerValue.TIMESTAMP
        }).catch(e => console.warn("Firebase status push failed:", e));
    }
}

function loop() {
    syncToFirebase();
    updateZones();
    let actions = getActions();
    applyFeedbackLoop(actions);
    renderZones();

    let globalAvg = Object.values(zones).reduce((acc, z) => acc + z.density, 0) / Object.keys(zones).length;
    if (typeof updateTelemetry !== 'undefined') updateTelemetry(Math.round(globalAvg));
    if (typeof updateMapPolygons !== 'undefined') updateMapPolygons();

    renderDecisions(actions);
}

window.simulateEvent = function (type) {
    if (type === 'match_start') {
        zones.gateA.density += 45;
        zones.gateB.density += 40;
        zones.merch.density += 20;
    } else if (type === 'halftime') {
        zones.food.density += 55;
        zones.washroom.density += 65;
        zones.gateA.density = Math.max(0, zones.gateA.density - 30);
    } else if (type === 'match_end') {
        zones.gateA.density += 70;
        zones.gateB.density += 60;
        zones.food.density = Math.max(0, zones.food.density - 40);
        zones.vip.density += 20;
    }
    loop();
};

window.triggerSurge = function () {
    isRecovering = true;

    let mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.classList.add('surge-active');
        setTimeout(() => mapContainer.classList.remove('surge-active'), 600);
    }

    for (let key in zones) {
        zones[key].density = Math.min(100, zones[key].density + 40 + Math.random() * 30);
        zones[key].inflow = Math.min(35, zones[key].inflow + 15 + Math.random() * 10);
        zones[key].queue = Math.min(60, zones[key].queue + 20 + Math.random() * 20);
    }

    loop();
};