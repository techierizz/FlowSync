/**
 * Main Application Controller
 * Handles UI binding, rendering loop, and event simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMapFallback();
    
    // User-Level Intelligence: Attach listener for persona change
    let personaSelector = document.getElementById('persona-selector');
    if (personaSelector) {
        personaSelector.addEventListener('change', renderDecisions);
    }
    
    loop();
    // Use requestAnimationFrame in a real app, but setInterval is fine for periodic data fetches
    setInterval(loop, 2500); 
});

function initTheme() {
    const btn = document.getElementById('theme-toggle');
    btn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        let isLight = document.body.classList.contains('light-theme');
        btn.innerHTML = isLight ? '<span class="material-symbols-outlined" aria-hidden="true">dark_mode</span>' : '<span class="material-symbols-outlined" aria-hidden="true">light_mode</span>';
    });
}

function initMapFallback() {
    // Architecture Note: Google Maps API would be initialized here.
    // We are using a robust CSS grid visualizer to represent the spatial intelligence.
    const map = document.getElementById('map-overlay');
    map.innerHTML = '<div class="pseudo-map" id="pseudo-map"></div>';
    renderHeatmap();
}

function renderHeatmap() {
    const pseudoMap = document.getElementById('pseudo-map');
    if(!pseudoMap) return;
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
        
        // Dynamically calculate heat color (Green -> Yellow -> Red)
        let r = Math.min(255, (z.density / 100) * 255 * 2);
        let g = Math.min(255, ((100 - z.density) / 100) * 255 * 2);
        node.style.background = `rgba(${r}, ${g}, 0, 0.65)`;
        node.style.transform = `scale(${1 + (z.density/100) * 1.5})`;
        node.style.boxShadow = `0 0 ${z.density}px rgba(${r}, ${g}, 0, 0.8)`;
        
        let label = document.createElement('span');
        label.className = 'heat-label';
        label.innerText = z.name;

        container.appendChild(node);
        container.appendChild(label);
        pseudoMap.appendChild(container);
    }
}

function renderZones() {
    let container = document.getElementById("zones");
    container.innerHTML = "";

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
        
        // XSS Prevention: Use DOM manipulation instead of innerHTML where user data might exist.
        // Here we use strict template literals as data is internally controlled.
        div.innerHTML = `
            <div class="zone-info">
                <span class="zone-name">${z.name}</span>
                <span class="zone-stats">Queue: ${z.queue} | Flow: ${z.inflow.toFixed(1)}/min</span>
            </div>
            <div class="zone-density" style="font-family: var(--font-mono)">${Math.round(z.density)}%</div>
        `;

        container.appendChild(div);
    }

    let globalAvg = totalDensity / Object.keys(zones).length;
    let globalDensityEl = document.getElementById('global-density');
    globalDensityEl.innerText = Math.round(globalAvg) + '%';
    globalDensityEl.style.color = globalAvg > 75 ? 'var(--alert)' : (globalAvg > 45 ? '#f59e0b' : 'var(--secondary)');
}

function renderDecisions(actions) {
    let div = document.getElementById("decisions");
    
    // User-Level Intelligence Layer logic
    let personaSelector = document.getElementById('persona-selector');
    let currentPersona = personaSelector ? personaSelector.value : 'speed';

    // Update UI text for persona description
    let desc = document.getElementById('persona-description');
    if (desc) {
        if (currentPersona === 'speed') desc.innerText = "Prioritizing minimum wait time.";
        else if (currentPersona === 'comfort') desc.innerText = "Prioritizing less crowded areas.";
        else if (currentPersona === 'accessibility') desc.innerText = "Prioritizing accessible zones.";
    }

    // Get personalized best route based on user persona
    let best = getBestZone(currentPersona);
    document.getElementById('best-zone').innerText = best.name;

    // Fallback if triggered by an Event Listener (like persona change) instead of the loop
    if (!actions || !Array.isArray(actions)) {
        actions = getActions();
    }
    
    
    // Hash actions to prevent redundant DOM updates and allow CSS animations to play naturally
    let newHash = actions.map(a => a.msg).join('');
    if (div.dataset.hash === newHash) return;
    div.dataset.hash = newHash;

    div.innerHTML = "";
    actions.forEach(a => {
        let p = document.createElement("div");
        p.className = `decision-item ${a.type.toLowerCase()}`;
        
        let icon = 'info';
        if(a.type === 'CRITICAL') icon = 'warning';
        if(a.type === 'ALERT') icon = 'error';
        if(a.type === 'WARN') icon = 'assignment_late';

        p.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true">${icon}</span> <span>${a.msg}</span>`;
        div.appendChild(p);
    });
}

function loop() {
    updateZones();
    let actions = getActions();
    applyFeedbackLoop(actions);
    renderZones();
    renderHeatmap();
    renderDecisions(actions);
}

// Interactive Simulation Triggers
window.simulateEvent = function(type) {
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
    loop(); // Force immediate UI update
};

// High-Intensity Peak Surge Scenario
window.triggerSurge = function() {
    // Visual effect on the Map Panel
    let mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.classList.add('surge-active');
        setTimeout(() => mapContainer.classList.remove('surge-active'), 600);
    }

    // Instantly destabilize the venue with extreme mass crowd injection
    for (let key in zones) {
        zones[key].density = Math.min(100, zones[key].density + 40 + Math.random() * 30);
        zones[key].inflow = Math.min(35, zones[key].inflow + 15 + Math.random() * 10);
        zones[key].queue = Math.min(60, zones[key].queue + 20 + Math.random() * 20);
    }
    
    // Force immediate UI update to show chaos before AI starts mitigating
    loop(); 
};