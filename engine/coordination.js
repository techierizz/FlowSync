/**
 * Coordination Engine
 * Analyzes overall venue state to generate actionable intelligence.
 */
function getActions() {
    let actions = [];
    
    let totalZones = Object.keys(zones).length;
    let globalDensity = Object.values(zones).reduce((acc, z) => acc + z.density, 0) / totalZones;
    
    if (globalDensity > 75) {
        actions.push({ type: 'CRITICAL', msg: `Venue at critical capacity (${Math.round(globalDensity)}%). Deploying overflow protocols immediately.` });
    } else if (globalDensity > 55) {
        actions.push({ type: 'ALERT', msg: `Elevated global venue traffic detected.` });
    }

    for (let key in zones) {
        let z = zones[key];

        if (isCongested(z)) {
            let alt = getBestZone();
            if (alt.name !== z.name) {
                actions.push({ type: 'ALERT', msg: `Reroute traffic from ${z.name} to ${alt.name}. Density critical.` });
            }
        } else if (z.queue > 15) {
            let waitTime = predictTimeInQueue(z);
            actions.push({ type: 'WARN', msg: `Deploy staff to ${z.name}. Est. wait: ~${waitTime}m.` });
        }
    }

    if (actions.length === 0) {
        actions.push({ type: 'INFO', msg: `All venue zones operating optimally. No actions required.` });
    }

    return actions;
}