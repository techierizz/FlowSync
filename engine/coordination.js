/**
 * Coordination Engine
 * Analyzes overall venue state to generate actionable intelligence.
 */
function getActions() {
    let actions = [];

    let totalZones = Object.keys(zones).length;
    let globalDensity = Object.values(zones).reduce((acc, z) => acc + z.density, 0) / totalZones;

    if (globalDensity > 75) {
        actions.push({ 
            type: 'CRITICAL', 
            msg: `Venue at critical capacity (${Math.round(globalDensity)}%). Deploying overflow protocols immediately.`,
            actionType: 'OVERFLOW'
        });
    } else if (globalDensity > 55) {
        actions.push({ type: 'ALERT', msg: `Elevated global venue traffic detected.`, actionType: 'NONE' });
    }

    for (let key in zones) {
        let z = zones[key];

        if (isCongested(z)) {
            // Venue operations should always use the 'speed' (efficiency) metric for reroutes
            let alt = getBestZone('speed');
            let altKey = Object.keys(zones).find(k => zones[k].name === alt.name);

            if (alt.name !== z.name) {
                actions.push({ 
                    type: 'ALERT', 
                    msg: `Reroute traffic from ${z.name} to ${alt.name}. (density: ${Math.round(z.density)}%, predicted congestion risk high)`,
                    actionType: 'REROUTE',
                    source: key,
                    target: altKey
                });
            }
        } else if (z.queue > 15) {
            let waitTime = predictTimeInQueue(z);
            actions.push({ 
                type: 'WARN', 
                msg: `Deploy staff to ${z.name}. Est. wait: ~${waitTime}m.`,
                actionType: 'STAFF',
                target: key
            });
        }
    }

    if (actions.length === 0) {
        actions.push({ type: 'INFO', msg: `All venue zones operating optimally. No actions required.`, actionType: 'NONE' });
    }

    return actions;
}

/**
 * Real-Time Coordination Feedback Loop
 * Modifies the live simulation state by acting upon the generated AI directives.
 */
function applyFeedbackLoop(actions) {
    actions.forEach(action => {
        if (action.actionType === 'REROUTE' && action.source && action.target) {
            // Divert flow actively: reduce source density/inflow, smoothly increase target
            zones[action.source].density = Math.max(0, zones[action.source].density - 2.5);
            zones[action.source].inflow = Math.max(0, zones[action.source].inflow - 1.5);
            
            zones[action.target].density = Math.min(100, zones[action.target].density + 1.0);
            zones[action.target].inflow += 0.5;
        } else if (action.actionType === 'STAFF' && action.target) {
            // Deployed staff process the queue rapidly
            zones[action.target].queue = Math.max(0, zones[action.target].queue - 4);
            zones[action.target].density = Math.max(0, zones[action.target].density - 1.0);
            zones[action.target].inflow = Math.max(0, zones[action.target].inflow - 0.5);
        } else if (action.actionType === 'OVERFLOW') {
            // System-wide lockdown: throttle all inflows heavily
            for (let k in zones) {
                zones[k].inflow = Math.max(0, zones[k].inflow - 2);
                zones[k].density = Math.max(0, zones[k].density - 1);
            }
        }
    });
}